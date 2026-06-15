import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'output', 'ui-builder');

const grouped = JSON.parse(readFileSync(join(OUT, 'latest', 'screens-grouped.json'), 'utf-8'));
const flatScreens = JSON.parse(readFileSync(join(OUT, 'latest', 'screens-list.json'), 'utf-8'));

const compIndex = {};
for (const f of readdirSync(join(OUT, 'latest'))) {
  const m = f.match(/^comp-([a-f0-9]+)\.json$/);
  if (!m) continue;
  compIndex[m[1]] = JSON.parse(readFileSync(join(OUT, 'latest', f), 'utf-8'));
}

function getComponents(screenId) {
  if (compIndex[screenId]) return compIndex[screenId];
  return compIndex[screenId.split('-')[0]] || [];
}

const output = {
  generatedAt: new Date().toISOString(),
  totalScreens: flatScreens.length,
  totalGroups: grouped.groups.length,
  groups: grouped.groups.map(g => ({
    group: g.title, icon: g.icon, position: g.position,
    screens: g.screens.map(s => ({
      name: s.name, route: s.route, description: s.description,
      isPublished: s.is_published, isMenu: s.is_menu,
      menuPosition: s.menu_position, menuIcon: s.menu_icon,
      moduleId: s.module_id, screenId: s.id,
      componentCount: getComponents(s.id).length,
      components: getComponents(s.id),
    })),
  })),
};

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const tsDir = join(OUT, ts);
const latestDir = join(OUT, 'latest');
if (!existsSync(tsDir)) mkdirSync(tsDir, { recursive: true });
if (!existsSync(latestDir)) mkdirSync(latestDir, { recursive: true });
writeFileSync(join(tsDir, 'ui-builder-export.json'), JSON.stringify(output, null, 2));
writeFileSync(join(latestDir, 'ui-builder-export.json'), JSON.stringify(output, null, 2));

console.log(`\n  ✓ ${flatScreens.length} screens across ${grouped.groups.length} groups exported`);
console.log(`  ✓ output/ui-builder/${ts}/ui-builder-export.json\n`);
for (const g of output.groups) {
  console.log(`  ${g.group} (${g.screens.length} screens):`);
  for (const s of g.screens) console.log(`    ${s.route} → ${s.name} (${s.componentCount} components)`);
}
