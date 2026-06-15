import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function run(label, cmd, opts = {}) {
  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`  ${label}`);
  console.log(`  $ ${cmd}`);
  console.log(`═══════════════════════════════════════════════\n`);
  execSync(cmd, { cwd: __dirname, stdio: 'inherit', ...opts });
}

console.log(`\n╔════════════════════════════════════════════╗`);
console.log(`║     Lumiere Pipeline — Stage 1            ║`);
console.log(`║     Export + Dependency + Screen-API Map  ║`);
console.log(`╚════════════════════════════════════════════╝\n`);

const ts = new Date();
console.log(`Started: ${ts.toISOString()}\n`);

// Ensure output directories
mkdirSync(join(__dirname, 'output', 'api-builder', 'latest'), { recursive: true });
mkdirSync(join(__dirname, 'output', 'ui-builder', 'latest'), { recursive: true });
mkdirSync(join(__dirname, 'output', 'screen-api-map', 'latest'), { recursive: true });

// ─── Stage 1a: Fetch API definitions ──────────────────────────────
run('Stage 1a — Fetch API Definitions from Backend Builder',
  `EMAIL=${process.env.EMAIL} PASSWORD=${process.env.PASSWORD} npx playwright test fetch-api-definitions.spec.ts --reporter=list`,
  { timeout: 120000 });

// ─── Stage 1b: Fetch UI screens ───────────────────────────────────
run('Stage 1b — Fetch UI Screens from UI Builder',
  `EMAIL=${process.env.EMAIL} PASSWORD=${process.env.PASSWORD} npx playwright test fetch-ui-builder.spec.ts --reporter=list`,
  { timeout: 120000 });

// ─── Stage 2: Map API dependencies ────────────────────────────────
run('Stage 2 — Map API Dependency Tiers',
  'node map-dependencies.mjs',
  { timeout: 30000 });

// ─── Stage 3: Map screen-to-API with constraints ──────────────────
run('Stage 3 — Map Screens to APIs with Constraints',
  'node map-screen-apis.mjs',
  { timeout: 30000 });

const end = new Date();
const elapsed = ((end - ts) / 1000).toFixed(1);

console.log(`\n╔════════════════════════════════════════════╗`);
console.log(`║  Pipeline complete in ${elapsed}s              ║`);
console.log(`╚════════════════════════════════════════════╝\n`);

console.log(`  Output folders (each run creates a timestamped + latest/ copy):`);
console.log(`  ├── output/api-builder/<ts>/`);
console.log(`  │   ├── api-definitions.json       (raw API definitions)`);
console.log(`  │   ├── modules.json               (modules)`);
console.log(`  │   └── api-dependency-map.json    (dependency tiers)`);
console.log(`  ├── output/ui-builder/<ts>/`);
console.log(`  │   ├── screens-list.json          (flat screen list)`);
console.log(`  │   ├── screens-grouped.json       (screens by group)`);
console.log(`  │   ├── screens-components.json    (component trees)`);
console.log(`  │   └── ui-builder-export.json      (full export)`);
console.log(`  └── output/screen-api-map/<ts>/`);
console.log(`      └── screen-api-map.json         (screens → APIs → merged constraints)\n`);
