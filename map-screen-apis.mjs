import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_OUT = join(__dirname, 'output', 'api-builder');
const UI_OUT = join(__dirname, 'output', 'ui-builder');
const MAP_OUT = join(__dirname, 'output', 'screen-api-map');

// ─── 1. Load data ─────────────────────────────────────────────────
const apiDefs = JSON.parse(readFileSync(join(API_OUT, 'latest', 'api-definitions.json'), 'utf-8'));
const modules = JSON.parse(readFileSync(join(API_OUT, 'latest', 'modules.json'), 'utf-8'));
const grouped = JSON.parse(readFileSync(join(UI_OUT, 'latest', 'screens-grouped.json'), 'utf-8'));
const flatScreens = JSON.parse(readFileSync(join(UI_OUT, 'latest', 'screens-list.json'), 'utf-8'));
const allComponents = JSON.parse(readFileSync(join(UI_OUT, 'latest', 'screens-components.json'), 'utf-8'));

const compsByScreenId = {};
for (const [screenId, comps] of Object.entries(allComponents)) {
  compsByScreenId[screenId] = comps;
}

const moduleMap = {};
for (const m of modules) moduleMap[m.id] = m;

// ─── 1b. Load dependency map ───────────────────────────────────────
const depMap = JSON.parse(readFileSync(join(API_OUT, 'latest', 'api-dependency-map.json'), 'utf-8'));
const depTierByApi = {};
for (const t of depMap.tiers) {
  for (const a of t.apis) {
    depTierByApi[a.name] = t.tier;
  }
}
const execOrder = depMap.executionOrder;
const execPosByApi = {};
for (let i = 0; i < execOrder.length; i++) execPosByApi[execOrder[i]] = i;

function getDepTier(name) { return depTierByApi[name] || null; }
function getDepOrder(name) { return execPosByApi[name] ?? null; }
function getDependsOn(name) { return depMap.dependencyMap[name] || []; }

// ─── 2. Parse constraints from YAML ───────────────────────────────
function parseConstraints(yaml) {
  if (!yaml) return [];
  const conditions = [];
  let inValidate = false, inConditions = false;
  let buf = {};

  for (const line of yaml.split('\n')) {
    const t = line.trim();

    if (/type:\s*validate/.test(t)) { inValidate = true; continue; }
    if (/type:\s*(query|insert|update|delete|select)/.test(t)) {
      if (inValidate && buf.rule) conditions.push({ ...buf });
      inValidate = false; inConditions = false; buf = {};
      continue;
    }
    if (inValidate && /^conditions?:/.test(t)) { inConditions = true; continue; }

    if (inValidate && inConditions) {
      // New condition list item — push previous
      if (t.startsWith('- field:') && buf.rule) {
        conditions.push({ ...buf });
        buf = {};
      }

      const fk = t.match(/^-?\s*field:\s*(.+)/);
      if (fk) buf.field = fk[1].trim();

      const rl = t.match(/rule:\s*(.+)/);
      if (rl) buf.rule = rl[1].trim();

      const tb = t.match(/table:\s*(.+)/);
      if (tb) buf.table = tb[1].trim();

      const ky = t.match(/key:\s*(.+)/);
      if (ky) buf.key = ky[1].trim();

      const vl = t.match(/value:\s*(.+)/);
      if (vl) buf.value = vl[1].trim();

      const idf = t.match(/id_field:\s*(.+)/);
      if (idf) buf.id_field = idf[1].trim();
    }
  }
  if (inValidate && buf.rule) conditions.push({ ...buf });
  return conditions;
}

function parseInputFields(yaml) {
  const fields = { required: [], optional: [] };
  if (!yaml) return fields;
  for (const line of yaml.split('\n')) {
    const m = line.trim().match(/^-?\s*(\w+):\s*(required|optional)/);
    if (m) {
      if (m[2] === 'required') fields.required.push(m[1]);
      else fields.optional.push(m[1]);
    }
  }
  return fields;
}

function formatConstraint(c) {
  const tag = c.table ? ` [${c.table}]` : '';
  switch (c.rule) {
    case 'is_email': return `Must be a valid email address`;
    case 'unique': return `Must be unique in ${c.table}.${c.key || c.field}${c.key ? '' : ''}`;
    case 'unique_except_self': return `Must be unique (excl. self) in ${c.table}.${c.key || c.field}`;
    case 'unique_combination': return `Combination [${c.field}] must be unique in ${c.table}`;
    case 'min_length': return `Minimum ${c.value} characters`;
    case 'max_length': return `Maximum ${c.value} characters`;
    case 'exists': return `Must reference existing record in ${c.table}`;
    case 'not_exceeds_available': return `Quantity must not exceed available in ${c.table}`;
    default: return `${c.rule}${tag}`;
  }
}

// ─── 2b. Extract ALL component data from screens ────────────────────
// Returns fields grouped by containing modal context:
//   all  – every named component (deduped by name, last-wins)
//   add  – fields inside a modal whose title matches Add/Create/New
//   edit – fields inside a modal whose title matches Edit/Update
function extractScreenComponents(components) {
  if (!components || !components.length) return { all: [], add: [], edit: [] };

  const byId = {};
  for (const comp of components) byId[comp.id] = comp;

  function findModalTitle(compId) {
    let id = compId;
    while (id && byId[id]) {
      if (byId[id].component_type === 'modal')
        return byId[id].content?.title || null;
      id = byId[id].parent_id;
    }
    return null;
  }

  const allFields = {};
  const addFields = {};
  const editFields = {};

  for (const comp of components) {
    const c = comp.content || {};
    if (!c.name || c.componentType === 'text') continue;

    const entry = { componentType: comp.component_type, ...c };
    allFields[c.name] = entry;

    const modalTitle = findModalTitle(comp.id);
    if (!modalTitle) continue;
    if (/add|create|new/i.test(modalTitle)) {
      if (!addFields[c.name]) addFields[c.name] = entry;
    } else if (/edit|update/i.test(modalTitle)) {
      if (!editFields[c.name]) editFields[c.name] = entry;
    }
  }

  return {
    all: Object.values(allFields),
    add: Object.values(addFields),
    edit: Object.values(editFields),
  };
}

// ─── 3. Build API lookup by module_id ──────────────────────────────
const apisByModule = {};
for (const a of apiDefs) {
  if (a.is_active !== true) continue;
  if (!apisByModule[a.module_id]) apisByModule[a.module_id] = [];
  apisByModule[a.module_id].push(a);
}

// ─── 4. Build screen-to-API mapping ───────────────────────────────
const output = {
  generatedAt: new Date().toISOString(),
  totalScreens: flatScreens.length,
  totalApisMapped: 0,
  dependencyExecutionOrder: execOrder,
  groups: grouped.groups.map(g => ({
    group: g.title,
    icon: g.icon,
    screens: g.screens.map(s => {
      const apiList = apisByModule[s.module_id] || [];
      const apis = apiList.map(a => {
        const inputFields = parseInputFields(a.yaml_definition);
        const constraints = parseConstraints(a.yaml_definition);
        return {
          name: a.name,
          method: a.method,
          path: a.path,
          description: a.description || null,
          dependencyTier: getDepTier(a.name),
          dependencyOrder: getDepOrder(a.name),
          dependsOn: getDependsOn(a.name),
          input: inputFields.required.length || inputFields.optional.length
            ? { required: inputFields.required, optional: inputFields.optional }
            : null,
          constraints: constraints.map(c => ({
            field: c.field || null,
            rule: c.rule,
            description: formatConstraint(c),
            params: c.table ? { table: c.table, key: c.key || null, value: c.value || null } : null,
          })),
        };
      });
      // Sort APIs by dependency order
      apis.sort((a, b) => (a.dependencyOrder ?? 999) - (b.dependencyOrder ?? 999));
      const extracted = extractScreenComponents(compsByScreenId[s.id]);
      const tiers = apis.map(a => a.dependencyTier).filter(t => t !== null);
      const minTier = tiers.length ? Math.min(...tiers) : null;
      const maxTier = tiers.length ? Math.max(...tiers) : null;
      return {
        name: s.name,
        route: s.route,
        description: s.description,
        moduleId: s.module_id,
        moduleName: moduleMap[s.module_id]?.module_name || null,
        apiCount: apis.length,
        fieldCount: extracted.all.length,
        dependencyTierRange: minTier !== null ? { min: minTier, max: maxTier } : null,
        screenFields: extracted.all,
        addFields: extracted.add,
        editFields: extracted.edit,
        apis,
      };
    }),
  })),
  unassociatedModules: [],
};

output.totalApisMapped = output.groups.reduce((s, g) =>
  s + g.screens.reduce((s2, sc) => s2 + sc.apiCount, 0), 0);

// Build screen dependency summary (all screens across all groups, sorted by min tier)
const allScreenEntries = [];
for (const g of output.groups) {
  for (const s of g.screens) {
    allScreenEntries.push({
      screen: s.name,
      route: s.route,
      group: g.group,
      apiCount: s.apiCount,
      tierRange: s.dependencyTierRange,
      moduleName: s.moduleName,
    });
  }
}
allScreenEntries.sort((a, b) => {
  const aMin = a.tierRange?.min ?? 999;
  const bMin = b.tierRange?.min ?? 999;
  return aMin - bMin;
});
output.screenDependencySummary = allScreenEntries;

// Orphan modules
const matchedIds = new Set();
for (const g of grouped.groups)
  for (const s of g.screens)
    matchedIds.add(s.module_id);

output.unassociatedModules = Object.entries(apisByModule)
  .filter(([mid]) => !matchedIds.has(Number(mid)))
  .map(([mid, apis]) => ({
    moduleId: Number(mid),
    moduleName: moduleMap[Number(mid)]?.module_name || 'unknown',
    displayName: moduleMap[Number(mid)]?.display_name || 'Unknown',
    apiCount: apis.length,
    apis: apis.map(a => ({
      name: a.name, method: a.method, path: a.path,
      dependencyTier: getDepTier(a.name),
      dependencyOrder: getDepOrder(a.name),
      dependsOn: getDependsOn(a.name),
      constraints: parseConstraints(a.yaml_definition).map(c => ({
        field: c.field || null, rule: c.rule, description: formatConstraint(c),
        params: c.table ? { table: c.table, key: c.key || null, value: c.value || null } : null,
      })),
    })).sort((a, b) => (a.dependencyOrder ?? 999) - (b.dependencyOrder ?? 999)),
  }));

// ─── 5. Write output ──────────────────────────────────────────────
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const tsDir = join(MAP_OUT, ts);
const latestDir = join(MAP_OUT, 'latest');
if (!existsSync(tsDir)) mkdirSync(tsDir, { recursive: true });
if (!existsSync(latestDir)) mkdirSync(latestDir, { recursive: true });
writeFileSync(join(tsDir, 'screen-api-map.json'), JSON.stringify(output, null, 2));
writeFileSync(join(latestDir, 'screen-api-map.json'), JSON.stringify(output, null, 2));

console.log(`\n  ✓ Mapped ${output.totalApisMapped} APIs to ${output.totalScreens} screens`);
console.log(`  ✓ ${output.unassociatedModules.length} unassociated module(s) with orphan APIs`);
console.log(`  ✓ output/screen-api-map/${ts}/screen-api-map.json\n`);

for (const g of output.groups) {
  console.log(`  ${g.group}:`);
  for (const s of g.screens) {
    const tr = s.dependencyTierRange;
    const tierStr = tr ? `tiers ${tr.min}–${tr.max}` : 'no dep data';
    console.log(`    ${s.route} → ${s.name} (${s.apiCount} APIs, ${s.fieldCount} fields, ${tierStr})`);
    for (const a of s.apis) {
      const depStr = a.dependsOn.length ? ` ← ${a.dependsOn.join(', ')}` : '';
      console.log(`      T${a.dependencyTier ?? '?'} ${a.method} ${a.name}${depStr}`);
      if (a.constraints.length) {
        for (const c of a.constraints) {
          console.log(`        ⚠ field=${c.field}, ${c.description}`);
        }
      }
    }
  }
}
if (output.unassociatedModules.length) {
  console.log(`\n  Orphan modules (APIs without a UI screen):`);
  for (const m of output.unassociatedModules)
    console.log(`    ${m.displayName} — ${m.apis.map(a => `T${a.dependencyTier ?? '?'} ${a.method} ${a.name}`).join(', ')}`);
}

// Print dependency summary
console.log(`\n  Screen dependency summary (sorted by build order):`);
for (const e of output.screenDependencySummary) {
  const tr = e.tierRange ? `tiers ${e.tierRange.min}–${e.tierRange.max}` : 'no deps';
  console.log(`    ${e.route} → ${e.screen} [${tr}]`);
}
