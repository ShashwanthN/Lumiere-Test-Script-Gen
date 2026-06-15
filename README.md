# Lumiere ERP — Export, Analysis & Test Generation

Automates exporting API definitions and UI screens from EEPC ERP, mapping API dependency order, extracting UI component constraints, merging into a unified screen-to-API map, and **auto-generating Playwright end-to-end tests** for every CRUD screen (19 screens, ~88 tests).

---

## Table of Contents

- [Quick Start](#quick-start)
- [Pipeline Overview (Stage 1)](#pipeline-overview-stage-1)
- [Test Generation (Stage 2)](#test-generation-stage-2)
- [How to Run Tests](#how-to-run-tests)
- [Test Architecture](#test-architecture)
- [Test Generation Logic](#test-generation-logic)
- [Obstacles Encountered](#obstacles-encountered)
- [Output Structure](#output-structure)
- [API Dependency Tiers](#api-dependency-tiers)
- [Screen Build Order](#screen-build-order)
- [File Reference](#file-reference)

---

## Quick Start

### Full Pipeline + Test Generation

```bash
npm install
npx playwright install chromium

# Stage 1: Export + dependency mapping + screen-API map
EMAIL=coffee@coffeeinc.in PASSWORD=Kafka@shore25 npm run pipeline:stage1

# Stage 2: Generate Playwright tests from the merged screen-API map
npm run generate:tests

# Run the generated tests
npm run test:generated
```

### Run Tests Headed (to watch execution)

```bash
npm run test:generated:headed
```

### Run a Single Screen

```bash
npx playwright test --config output/tests/playwright.config.ts output/tests/01-tier1-materials.spec.ts --headed
```

---

## Pipeline Overview (Stage 1)

```
pipeline:stage1
  ├── Stage 1a — fetch:api-defs     Playwright → output/api-builder/<ts>/
  │     Captures all API definitions + modules from /admin/backend-builder
  │
  ├── Stage 1b — fetch:ui           Playwright → output/ui-builder/<ts>/
  │     Captures all UI screens + full component trees from /admin/screens
  │
  ├── Stage 2  — map:deps           Node → api-dependency-map.json
  │     Reads YAML definitions, builds FK/JOIN/INSERT dependency graph,
  │     computes execution tiers via topological sort
  │
  └── Stage 3  — map:screens        Node → screen-api-map.json
        Maps each screen → its APIs by module_id, extracts UI component
        properties and API constraints, merges dependency tier info
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run pipeline:stage1` | Run all Stage 1 steps end-to-end |
| `npm run fetch:api-defs` | Fetch API definitions from backend builder |
| `npm run fetch:ui` | Fetch UI screens and component trees |
| `npm run map:deps` | Compute API dependency tiers |
| `npm run map:screens` | Merge screens → APIs → constraints |
| `npm run assemble:ui` | Re-assemble UI export from cached files |
| `npm run generate:tests` | Generate Playwright spec files (Stage 2) |
| `npm run test:generated` | Run all generated tests headless |
| `npm run test:generated:headed` | Run all generated tests headed |

---

## Test Generation (Stage 2)

`npm run generate:tests` runs `generate-tests.mjs`, which reads two files:

| Input | Source |
|-------|--------|
| `output/screen-api-map/latest/screen-api-map.json` | Produced by Stage 1 — `map:screens` |
| `output/ui-builder/latest/ui-builder-export.json` | Produced by Stage 1 — `fetch:ui` + `assemble:ui` |

It generates one spec file per screen in `output/tests/`, plus support files:

| File | Purpose |
|------|---------|
| `output/tests/playwright.config.ts` | Standalone config (workers: 1, retries: 1) |
| `output/tests/global-setup.ts` | Chrome login + storage state |
| `output/tests/helpers/context.ts` | `readCtx()` / `writeCtx()` — cross-test context |

### Skipped Screens

- `/adeos_document_intelligence` — non-CRUD, permanently skipped

### What Each Generated Test Does

#### Tier Structure

Tests are grouped by API dependency tier. All tests run sequentially (`workers: 1`) in tier order:

| Tier | Screens |
|------|---------|
| 1 (Tier-1) | materials, uom, items, item-groups, item-classes, material-specifications, drawing-categories, drawing-sizes, product-groups, customers, raw-material-indents |
| 2 (Tier-2) | pgma, employees, projects, applicable-pgma |
| 3 (Tier-3) | bill-of-materials, boc-indents, drawing-no-generation |
| 4 (Tier-4) | pms-generation |

#### Per-Screen Test Suite (≈5 tests/screen)

1. **UI Render** — navigates to screen, asserts page heading is visible
2. **Create Record** — clicks Add, fills form, submits, verifies sheet closes, fetches record via GET API, writes to context
3. **Constraint Tests** — one per API constraint (`unique`, `min_length`, `is_email`, `unique_except_self`, `unique_combination`, `exists`, `not_exceeds_available`, `max_length`)
4. **Update Record** — self-contained create (or reuses create-test record via ctx for screens with auto-generated unique fields), fills edit fields, submits, verifies
5. **Delete Record** — self-contained create (or reuses create-test record via ctx), clicks delete, confirms, verifies sheet closes

---

## Test Architecture

### How the Generator Works

1. **Button Metadata** (`buildUIMeta`): Scans all screen components for buttons with specific action types to find Add, Submit, Edit, Delete button labels
2. **Cascade-Aware Field Ordering** (`getCascadeOrderedFields`): Builds a dependency graph from:
   - URL path-param dependencies (e.g., `{project_id}` in endpoint URL means that field must be filled after `project_id`)
   - Component type exclusions: `code-generator`, `key-value`, `file-upload` are skipped
   - Priority ordering: required cascade → disabled cascade → disabled non-cascade → optional cascade → remaining enabled
3. **Field Fill Lines** (`fieldFillLines`): Generates Playwright `.fill()` lines per field:
   - `select`/`dropdown`: Robust multi-locator click, picks first option, waits 700ms after cascade selects
   - `textarea`: Template string `PREFIX_${T}` (e.g., `MATERIAL_SPECIFICATION_DESCRIPTION_697589`)
   - `input` (text): Template string `PREFIX_${T}` based on field name
   - `input` (number): Timestamp-based numeric value `${T}`
   - `input` (date): Static `2026-01-01`
   - Disabled inputs: Conditional `.fill()` only if `.isEnabled()`
   - `code-generator`: **Hard-skipped** — never touched
4. **Unique Field Tracking**: The first fillable text field with a `unique` constraint becomes the **primary tracking field** (e.g., `name` for Items, `material_specification_code` for Material Specs). Its value is declared as a module-level variable (`const NAME = \`NAME_${T}\``) and stored in the cross-test context.
5. **Row Finders**: Search the table by typing the tracking field value into the search input, then filter rows by `hasText` to find the correct data row. Falls back to clicking the last row's action button when no unique field exists.
6. **Self-Contained vs Ctx-Based Update/Delete**: Screens with auto-generated unique fields (like `item_code` from a `code-generator`) cannot safely re-create records within the same session — the generator produces the same code every time. For these screens, update/delete tests read the create test's record from ctx.
7. **Constraint Tests** (`constraintTest`): Generate per-constraint tests:
   - UI-level for fillable fields (fill form, submit, assert error visible)
   - API-level for non-fillable/auto-generated fields (direct `page.request.post`)

### Fill Value Strategy

All fill values are **dynamically generated per field** using the field's own metadata:

| Field Type | Fill Value | Example |
|-----------|------------|---------|
| Text (primary unique) | `NAME_${T}` | `NAME_697589` |
| Text (other) | `PREFIX_${T}` | `UNIT_WEI_697589` |
| Number | `${T}` (numeric) | `697589` |
| Date | `2026-01-01` | — |
| Select/Dropdown | First option from API/static list | — |
| Textarea | `PREFIX_${T}` | `DESC_697589` |

All inputs in the UI builder export have `inputType: "text"` — even fields mapped to numeric DB columns. The prefix-based template strings provide unique, distinguishable values per field.

### Cascade Select Handling

The most complex part. The form has REQUIRED cascade selects that are initially **disabled**. Selecting from a parent cascade triggers `onSelectAction` which enables and populates the downstream selects.

The generator:
1. Orders fields so cascade parents come before dependents (via `order_index` or URL path-param deps)
2. For each disabled select with an API source: tries to click it (may be enabled now), picks first option, waits 700ms for cascading
3. For enabled selects: uses a 3-locator fallback (label → combobox sibling → button sibling)
4. No `waitForTimeout` outside of `fieldFillLines` — all waits are field-specific

### Cross-Test Context (`readCtx` / `writeCtx`)

The create test writes `{ id, name, item_code }` to a JSON file via `writeCtx`. Tests that need the same record read it back via `readCtx`. The context lives at `output/tests/context/test-context.json` and persists across test runs.

---

## Obstacles Encountered

### 1. `code-generator` Fields Produce Duplicate Values

**Problem**: The code-generator component auto-generates `item_code` from segments (item class, group, material spec, supply condition + serial). Each form open resets its serial to 1. When update/delete tests create their own record using the same cascade selections, the code-generator produces the same `item_code`, violating the unique constraint.

**Solution**: 
- `code-generator` fields are **excluded** from `getCascadeOrderedFields` — not filled, not tracked
- The next fillable unique field (e.g., `name`) becomes the primary tracking field
- For screens with auto-generated unique fields (`hasAutoGenUniq`), update/delete tests **skip self-contained creates** and instead directly use the create test's record via `readCtx()`

### 2. All Inputs Have `inputType: "text"` in UI Builder Export

**Problem**: The UI builder export marks every input as `inputType: "text"` — even fields backed by numeric DB columns (`unit_weight`, `rate`, `quantity`). There is no type information in any export. String fill values caused PostgreSQL type errors.

**Solution**: Use unique prefix-based strings (`NAME_${T}`) for text inputs, timestamp-based numbers `${T}` for number inputs, and static `2026-01-01` for dates. The prefix is derived from the field name (e.g., `material_specification_description` → `MATERIAL_SPE`).

### 3. Cascade Popover vs Sheet Dialog — Strict-Mode Violation

**Problem**: Both the Add/Edit sheet and cascade popover use `role="dialog"`. Playwright's auto-waiting finds 2 elements for `[role="dialog"]`, throwing strict-mode violations.

**Solution**: The generator emits `[role="dialog"][data-slot="sheet-content"]` for sheet assertions — cascade popovers have `data-slot="popover-content"`, eliminating ambiguity.

### 4. Disabled Inputs Can't Be Filled Unconditionally

**Problem**: Some inputs start disabled and only become enabled after cascade selections. Filling them before cascade fires fails silently.

**Solution**: Disabled text/number inputs get a conditional `.fill()` guarded by `.isEnabled()`:
```typescript
if (await page.getByLabel('...').isEnabled().catch(() => false)) {
  await page.getByLabel('...').fill('...');
}
```

### 5. Submit Button Name Conflicts ("Add" vs "Add Pair")

**Problem**: Screens with multiple submit buttons (e.g., "Add" + "Add Pair") cause Playwright to find 2+ elements matching `getByRole('button', { name: 'Add' })`.

**Solution**: All submit button locators use `{ exact: true }` — `getByRole('button', { name: 'Add', exact: true })`.

### 6. Row Pagination — Can't Always Click Last Row

**Problem**: The initial fallback row finder clicked `tr:last-child button`, which hits pagination controls, not data rows. Also, records created in one test may be on page 2+ for the next test.

**Solution**: Search-based row finding: fill the table search input with the tracking field value, `waitForTimeout(500)` for the table to filter, then `getByRole('row').filter({ hasText: VALUE }).first()` to find the correct data row (skipping the header row).

### 7. `updateFillLines` Uses Static `1` for All Fields

**Problem**: The update fill lines generated `\`1\`` for every non-unique text field, producing a generic value that doesn't prove the update happened.

**Solution**: Changed to use `fieldFillLines(f)` which generates field-specific prefix-based strings. Now each updated field gets a unique value based on its name.

### 8. Button Label Detection Fails on Non-Standard Labels

**Problem**: The `buildUIMeta` function scans buttons by regex (e.g., `/add|create|new/i` for add triggers). Screens with non-standard labels (e.g., Drawing Categories has no Add button) produce empty/null labels.

**Solution**: Default fallbacks: `addTrigger = 'Add'`, `addSubmit = 'Add'`, `editSubmit = 'Submit'`, `deleteConfirm = 'Delete'`.

### 9. Self-Contained Update/Delete with Auto-Generated Codes

**Problem**: For screens like Items with `code-generator` auto-generating `item_code`, the self-contained create in update/delete tests produces a duplicate code. Two approaches exist:
- **Self-contained** (old): Create a fresh record with `UPD_TRACK`/`DEL_TRACK` for the unique name — works for screens without auto-generated unique fields
- **Ctx-based** (new): Reuse the create test's record — required for screens with auto-generated unique fields

Both approaches are supported. The generator detects `hasAutoGenUniq` (any `unique` constraint on a non-fillable field) and selects the appropriate template.

---

## Output Structure

Each Stage 1 run creates a **timestamped folder** plus a `latest/` symlink (symlinks not available on all platforms — actual copies are used instead):

```
output/
├── api-builder/
│   ├── 2026-06-15T10-20-39-094Z/
│   │   ├── api-definitions.json        Raw API definitions from backend builder
│   │   ├── modules.json                Module list
│   │   └── api-dependency-map.json     Dependency tiers + execution order
│   └── latest/                         Always current copy
│
├── ui-builder/
│   ├── 2026-06-15T10-20-39-226Z/
│   │   ├── screens-list.json           Flat screen list
│   │   ├── screens-grouped.json        Screens by group
│   │   ├── screens-components.json     Full component trees per screen
│   │   └── ui-builder-export.json      Assembled export (used by test generator)
│   └── latest/
│
├── screen-api-map/
│   ├── 2026-06-15T10-29-49-239Z/
│   │   └── screen-api-map.json         Screens → APIs → constraints + deps
│   └── latest/
│
└── tests/                               Generated by Stage 2
    ├── playwright.config.ts             Standalone Playwright config
    ├── global-setup.ts                  Login + storage state
    ├── helpers/
    │   └── context.ts                   readCtx / writeCtx
    ├── context/
    │   └── test-context.json            Cross-test context (created at runtime)
    ├── 01-tier1-materials.spec.ts       Generated test files (19 total)
    ├── 01-tier1-items.spec.ts
    ├── ...
    └── 04-tier4-pms-generation.spec.ts
```

### Generated Spec Files (19 total)

| File | Tier | Tests |
|------|------|-------|
| `01-tier1-materials.spec.ts` | T1 | 5 |
| `01-tier1-units-of-measurement.spec.ts` | T1 | 5 |
| `01-tier1-items.spec.ts` | T1 | 6 |
| `01-tier1-item-groups.spec.ts` | T1 | 4 |
| `01-tier1-item-classes.spec.ts` | T1 | 1 |
| `01-tier1-material-specifications.spec.ts` | T1 | 5 |
| `01-tier1-drawing-categories.spec.ts` | T1 | 1 |
| `01-tier1-drawing-sizes.spec.ts` | T1 | 1 |
| `01-tier1-product-groups-pg.spec.ts` | T1 | 5 |
| `01-tier1-customers.spec.ts` | T1 | 4 |
| `01-tier1-raw-material-indents.spec.ts` | T1 | 5 |
| `02-tier2-pgma.spec.ts` | T2 | 5 |
| `02-tier2-employees.spec.ts` | T2 | 1 |
| `02-tier2-projects.spec.ts` | T2 | 4 |
| `02-tier2-applicable-pgma.spec.ts` | T2 | 5 |
| `03-tier3-bill-of-materials-v2.spec.ts` | T3 | 5 |
| `03-tier3-bought-out-components.spec.ts` | T3 | 5 |
| `03-tier3-drawing-no-generation.spec.ts` | T3 | 6 |
| `04-tier4-pms-generation.spec.ts` | T4 | 5 |

---

## API Dependency Tiers

| Tier | Count | Key APIs |
|------|-------|----------|
| 1 | 22 | `create_uom`, `create_item_groups`, `create_material`, `create_customer`, `create_user`, `create_products` |
| 2 | 28 | `create_items`, `create_projects`, `create_pgma_master` |
| 3 | 16 | `create_drawing`, `create_applicable_pgma`, `create_bought_out_component` |
| 4 | 22 | `create_bom_v2`, BOC GETs |
| 5 | 6 | `create_product_manufacturing_schedule`, `update_bom_v2` |
| 6 | 7 | `update_product_manufacturing_schedule`, PMS GETs |
| 7 | 4 | Deep PMS details |

Dependencies are computed by:
- Parsing `yaml_definition` for `action: insert` + `table:` → API creates rows in that table
- Scanning fields matching `fkToTable` map (e.g., `uom_id` → `uom` table)
- Topological sort on the dependency graph

## Screen Build Order

| Order | Screen | Tier Range |
|-------|--------|------------|
| 1 | `/masters/materials` | T1–2 |
| 2 | `/masters/units-of-measurement` | T1–2 |
| 3 | `/masters/items` | T1–2 |
| 4 | `/masters/item-groups` | T1–2 |
| 5 | `/masters/item-classes` | T1 |
| 6 | `/masters/material-specifications` | T1–2 |
| 7 | `/masters/drawing-categories` | T1 |
| 8 | `/masters/drawing-sizes` | T1 |
| 9 | `/masters/product-groups (PG)` | T1–4 |
| 10 | `/customers` | T1–2 |
| 11 | `/raw-material-indents` | T1–4 |
| 12 | `/adeos_document_intelligence` | T1 — skipped (non-CRUD) |
| 13 | `/masters/pgma` | T2–4 |
| 14 | `/employees` | T2 |
| 15 | `/projects/list` | T2–3 |
| 16 | `/projects/applicable-pgma` | T2–4 |
| 17 | `/projects/drawings` | T3–4 |
| 18 | `/bill-of-materials` | T3–6 |
| 19 | `/boc-indents` | T3–4 |
| 20 | `/pms-generation` | T4–7 |

**Orphan modules** (APIs with no UI screen): Users, Products, PGMA Category Master, Supply Conditions, adeos.

### Screens → APIs by Group

| Group | Screens (APIs/screen, tier range) |
|-------|-----------------------------------|
| **Masters** | Materials (5, T1–2), Units Of Measurement (4, T1–2), Items (6, T1–2), Item Groups (4, T1–2), Item Classes (1, T1), Material Specifications (5, T1–2), Drawing Categories (3, T1), Drawing Sizes (1, T1), Product Groups (5, T1–4), PGMA (5, T2–4) |
| **Employees** | Employees (1, T2) |
| **Customers** | Customers (4, T1–2) |
| **Projects** | Projects (4, T2–3), Drawing No. Generation (10, T3–4), Applicable PGMA (6, T2–4) |
| **Material Indents** | Bill of Materials v2 (7, T3–6), Raw Material Indents (22, T1–4), Bought Out Components (7, T3–4) |
| **PMS Generation** | PMS Generation (14, T4–7) |
| **Adeos** | Adeos Document Intelligence (3, T1) |

---

## File Reference

| File | Purpose |
|------|---------|
| `pipeline-stage1.mjs` | Orchestrator — runs all Stage 1 steps sequentially |
| `fetch-api-definitions.spec.ts` | Playwright — logs in, navigates to backend builder, saves API definitions + modules |
| `fetch-ui-builder.spec.ts` | Playwright — logs in, navigates to screen builder, captures all screen component trees |
| `map-dependencies.mjs` | Node — reads YAML definitions, builds FK/JOIN/INSERT dependency graph, computes tiers |
| `map-screen-apis.mjs` | Node — merges UI screens with API definitions, extracts constraints, adds dependency info |
| `assemble-ui-export.mjs` | Node — assembles `ui-builder-export.json` from individual screen exports |
| `generate-tests.mjs` | **Test generator** — reads screen-api-map + UI export, writes Playwright spec files |
| `playwright.config.ts` | Root Playwright config (for fetch scripts) |
| `output/tests/playwright.config.ts` | Generated standalone config (for generated tests) |
| `output/tests/global-setup.ts` | Generated — Chrome login with auth persistence |
| `output/tests/helpers/context.ts` | Generated — cross-test context (`readCtx`/`writeCtx`) |

## Configuration

Credentials are passed via environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMAIL` | `coffee@coffeeinc.in` | Login email for Playwright fetch scripts |
| `PASSWORD` | `Kafka@shore25` | Login password |

The app URL and API base are hardcoded in `generate-tests.mjs`:
```javascript
const APP_BASE = 'https://dev.erp.eepc.coffeeinc.in';
const API_BASE = 'https://api.dev.erp.eepc.coffeeinc.in/api';
```

Generated test config (`output/tests/playwright.config.ts`):
- `workers: 1` — sequential execution, required for ctx-based record reuse
- `retries: 1` — one retry on failure
- `timeout: 120000` — 2 minute per-test timeout
- `actionTimeout: 15000` — 15s per Playwright action
- `navigationTimeout: 90000` — 90s page load timeout
