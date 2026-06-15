import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_OUT = join(__dirname, 'output', 'api-builder');

const raw = JSON.parse(readFileSync(join(API_OUT, 'latest', 'api-definitions.json'), 'utf-8'));

// ─── 1. Collect INSERT & JOIN info ────────────────────────────────
const tableToCreateApis = {};
const apiMap = {};

function getInsertTables(yaml) {
  const tables = [];
  if (!yaml) return tables;
  const lines = yaml.split('\n');
  let inInsert = false;
  for (const line of lines) {
    const t = line.trim();
    if (/action:\s*(insert|create)/.test(t)) inInsert = true;
    if (inInsert && /^table:\s*(\S+)/.test(t)) tables.push(t.match(/^table:\s*(\S+)/)[1]);
  }
  return tables;
}

function getJoinTables(yaml) {
  const tables = [];
  if (!yaml) return tables;
  for (const line of yaml.split('\n')) {
    const m = line.trim().match(/^- table:\s*(\S+)/);
    if (m) tables.push(m[1]);
  }
  return tables;
}

for (const a of raw) {
  if (a.is_active !== true) continue;
  const inserts = getInsertTables(a.yaml_definition);
  const joins = getJoinTables(a.yaml_definition);
  apiMap[a.name] = {
    id: a.id, name: a.name, method: a.method,
    module: a.module?.display_name || a.module?.module_name, path: a.path,
    inserts, joins, yaml: a.yaml_definition,
  };
  for (const tbl of inserts) {
    if (!tableToCreateApis[tbl]) tableToCreateApis[tbl] = [];
    if (!tableToCreateApis[tbl].includes(a.name)) tableToCreateApis[tbl].push(a.name);
  }
}

// ─── 2. FK field → source table mapping ────────────────────────────
const fkToTable = {
  uom_id: 'uom', weight_uom_id: 'uom',
  item_group_id: 'item_groups',
  item_class_id: 'item_classes', class_id: 'item_classes',
  material_id: 'materials',
  material_spec_id: 'material_specifications', material_specification_id: 'material_specifications',
  supply_condition_id: 'supply_conditions',
  customer_id: 'customers', customer_code: 'customers',
  project_id: 'projects', project_code: 'projects',
  product_id: 'products',
  drawing_category_id: 'drawing_categories', dr_cat_id: 'drawing_categories',
  drawing_size_id: 'drawing_sizes', dr_size_id: 'drawing_sizes',
  pg_master_id: 'pg_master',
  pgma_category_id: 'pgma_category_master', pgma_category_master_id: 'pgma_category_master',
  pgma_master_id: 'pgma_master',
  applicable_pgma_id: 'applicable_pgma', applicable_pgma_list_id: 'applicable_pgma',
  drawing_id: 'drawings', drawing_number_id: 'drawings',
  indent_id: 'raw_material_indents', raw_material_indent_id: 'raw_material_indents',
  rmi_id: 'raw_material_indents', rmi_group_id: 'rmi_groups',
  boc_id: 'bought_out_components',
  bom_id: 'bill_of_materials', bom_item_id: 'bill_of_materials',
  pms_id: 'product_manufacturing_schedule',
  employe_id: 'employees', employee_id: 'employees',
};

function findTableRefs(yaml) {
  const refs = [];
  if (!yaml) return refs;
  for (const [fk, table] of Object.entries(fkToTable)) {
    if (new RegExp(`\\b${fk}\\b`).test(yaml)) {
      const creators = tableToCreateApis[table];
      if (creators?.length) refs.push({ field: fk, table, creators });
    }
  }
  return refs;
}

// ─── 3. Build dependencies ────────────────────────────────────────
const dependencies = {};
const allNames = Object.keys(apiMap);

for (const name of allNames) {
  const api = apiMap[name];
  const depSet = new Set();
  for (const ref of findTableRefs(api.yaml)) {
    for (const c of ref.creators) if (c !== name) depSet.add(c);
  }
  for (const jt of api.joins) {
    const creators = tableToCreateApis[jt];
    if (creators) for (const c of creators) if (c !== name) depSet.add(c);
  }
  dependencies[name] = { dependsOn: [...depSet] };
}

// ─── 4. Topological sort ──────────────────────────────────────────
function topoSort(names, deps) {
  const visited = new Set(), order = [];
  function visit(n, stack) {
    if (stack.has(n) || visited.has(n)) return;
    visited.add(n), stack.add(n);
    for (const d of (deps[n]?.dependsOn || [])) if (names.includes(d)) visit(d, stack);
    stack.delete(n), order.push(n);
  }
  for (const n of names) visit(n, new Set());
  return order;
}

const execOrder = topoSort(allNames, dependencies);

// ─── 5. Compute tiers ────────────────────────────────────────────
const tiers = [];
const executed = new Set();
while (executed.size < execOrder.length) {
  const tier = execOrder.filter(n => !executed.has(n) && (dependencies[n]?.dependsOn || []).every(d => executed.has(d)));
  if (!tier.length) break;
  for (const n of tier) executed.add(n);
  tiers.push(tier);
}

// ─── 6. Build output ──────────────────────────────────────────────
const output = {
  generatedAt: new Date().toISOString(),
  totalActiveApis: allNames.length,
  tiers: tiers.map((tier, i) => ({
    tier: i + 1,
    description: i === 0 ? 'No dependencies — create these first' : `Depends on previous ${i} tier(s)`,
    apis: tier.map(name => ({
      name, method: apiMap[name].method, module: apiMap[name].module,
      path: apiMap[name].path, creates: apiMap[name].inserts,
      dependsOn: dependencies[name].dependsOn,
    })),
  })),
  executionOrder: execOrder,
  dependencyMap: Object.fromEntries(allNames.map(n => [n, dependencies[n].dependsOn])),
  reverseDeps: Object.fromEntries(allNames.map(n => [n, allNames.filter(m => dependencies[m].dependsOn.includes(n))])),
};

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const tsDir = join(API_OUT, ts);
const latestDir = join(API_OUT, 'latest');
if (!existsSync(tsDir)) mkdirSync(tsDir, { recursive: true });
if (!existsSync(latestDir)) mkdirSync(latestDir, { recursive: true });
writeFileSync(join(tsDir, 'api-dependency-map.json'), JSON.stringify(output, null, 2));
writeFileSync(join(latestDir, 'api-dependency-map.json'), JSON.stringify(output, null, 2));

console.log(`\n  ✓ ${allNames.length} active APIs analyzed`);
console.log(`  ✓ ${tiers.length} dependency tiers`);
console.log(`  ✓ output/api-builder/${ts}/api-dependency-map.json\n`);

for (const tier of output.tiers) {
  const withDeps = tier.apis.filter(a => a.dependsOn.length > 0);
  const noDeps = tier.apis.filter(a => a.dependsOn.length === 0);
  console.log(`  Tier ${tier.tier} (${tier.apis.length} APIs)`);
  if (noDeps.length) console.log(`    Independent: ${noDeps.map(a => a.method + ' ' + a.name).join(', ')}`);
  for (const a of withDeps) console.log(`    ${a.method} ${a.name} → waits for [${a.dependsOn.join(', ')}]`);
  console.log('');
}
