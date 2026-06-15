# Lumiere ERP — Export & Analysis Tools

Automates exporting API definitions and UI screens from EEPC ERP, mapping API dependency order, extracting UI component constraints, and merging everything into a unified screen-to-API map.

## Quick Start (Full Pipeline)

```bash
npm install
npx playwright install chromium
EMAIL=coffee@coffeeinc.in PASSWORD=Kafka@shore25 npm run pipeline:stage1
```

This runs all stages — fetches API defs + UI screens, maps dependencies, extracts UI constraints, and creates the merged screen-to-API map.

## Output Structure

Each run creates a timestamped folder `<ts>/` plus a `latest/` symlink:

```
output/
├── api-builder/
│   ├── 2026-06-15T10-20-39-094Z/
│   │   ├── api-definitions.json        raw API definitions
│   │   ├── modules.json                modules
│   │   └── api-dependency-map.json     dependency tiers
│   ├── latest/                         always current copy
│   │   ├── api-definitions.json
│   │   ├── modules.json
│   │   └── api-dependency-map.json
│
├── ui-builder/
│   ├── 2026-06-15T10-20-39-226Z/
│   │   ├── screens-list.json           flat screen list
│   │   ├── screens-grouped.json        screens by group
│   │   ├── screens-components.json     full component trees
│   │   └── ui-builder-export.json      assembled export
│   ├── latest/
│
└── screen-api-map/
    ├── 2026-06-15T10-29-49-239Z/
    │   └── screen-api-map.json         merged screen→APIs→constraints+deps
    ├── latest/
```

## Pipeline Stages

```
pipeline:stage1
  ├── Stage 1a — fetch:api-defs     Playwright → output/api-builder/<ts>/
  ├── Stage 1b — fetch:ui           Playwright → output/ui-builder/<ts>/
  ├── Stage 2  — map:deps           Node → api-dependency-map.json
  ├── Stage 3  — map:screens        Node → screen-api-map.json (APIs + UI fields + constraints + dependency order)
  └── Stage X  — assemble:ui        Node → ui-builder-export.json (optional re-assembly)
```

## Commands

### `npm run pipeline:stage1`

Run everything end-to-end.

```bash
EMAIL=coffee@coffeeinc.in PASSWORD=Kafka@shore25 npm run pipeline:stage1
```

### `npm run fetch:api-defs`

Logs in, navigates to `/admin/backend-builder`, captures all API definitions + modules.

```bash
EMAIL=coffee@coffeeinc.in PASSWORD=Kafka@shore25 npm run fetch:api-defs
```

### `npm run fetch:ui`

Logs in, navigates to `/admin/screens`, captures all screens and their full component trees.

```bash
EMAIL=coffee@coffeeinc.in PASSWORD=Kafka@shore25 npm run fetch:ui
```

### `npm run map:deps`

Reads latest API definitions, builds a dependency graph from YAML definitions (FK refs, JOINs, INSERT tables), and arranges APIs into execution tiers via topological sort.

```bash
npm run map:deps
```

### `npm run map:screens`

Reads latest API defs + UI screens + component trees, then:

- Maps each screen to its associated APIs by `module_id`
- Extracts **API-level constraints** from YAML (`unique`, `exists`, `is_email`, `min_length`, etc.)
- Extracts **all UI component properties** from every named screen component (`inputType`, `label`, `required`, `disabled`, `readOnly`, `validation`, `onChangeAction`, `optionsSource`, `dataSource`, etc.)
- Merges **dependency tier info** from the dependency map into each API
- Sorts APIs within each screen by build order
- Generates a `screenDependencySummary` sorted by minimum tier

```bash
npm run map:screens
```

### `npm run assemble:ui`

Re-assembles `ui-builder-export.json` from `latest/` cached files (alternative to the fetch script's export).

```bash
npm run assemble:ui
```

---

## API Dependency Logic

| Signal | What it means |
|--------|---------------|
| `action: insert` + `table: X` | API creates rows in table X |
| Field `foo_id` in YAML | API references FK → creator of `foo` table must run first |
| `joins:` section with `- table: Y` | API reads from Y → Y must have data |
| `is_active: false` | API excluded from analysis |

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

To seed data: **execute each tier sequentially**; within a tier, APIs can run in any order.

## Screens → APIs Summary

| Group | Screens (APIs per screen, tier range) |
|-------|---------------------------------------|
| **Masters** | Materials (5, T1–2), Units Of Measurement (4, T1–2), Items (6, T1–2), Item Groups (4, T1–2), Item Classes (1, T1), Material Specifications (5, T1–2), Drawing Categories (3, T1), Drawing Sizes (1, T1), Product Groups (5, T1–4), PGMA (5, T2–4) |
| **Employees** | Employees (1, T2) |
| **Customers** | Customers (4, T1–2) |
| **Projects** | Projects (4, T2–3), Drawing No. Generation (10, T3–4), Applicable PGMA (6, T2–4) |
| **Material Indents** | Bill of Materials v2 (7, T3–6), Raw Material Indents (22, T1–4), Bought Out Components (7, T3–4) |
| **PMS Generation** | PMS Generation (14, T4–7) |
| **Adeos** | Adeos Document Intelligence (3, T1) |

**Orphan modules** (APIs with no screen): Users, Products, PGMA Category Master, Supply Conditions, adeos.

## Screen Build Order (Dependency Summary)

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
| 12 | `/adeos_document_intelligence` | T1 |
| 13 | `/masters/pgma` | T2–4 |
| 14 | `/employees` | T2 |
| 15 | `/projects/list` | T2–3 |
| 16 | `/projects/applicable-pgma` | T2–4 |
| 17 | `/projects/drawings` | T3–4 |
| 18 | `/bill-of-materials` | T3–6 |
| 19 | `/boc-indents` | T3–4 |
| 20 | `/pms-generation` | T4–7 |

---

## Output Schemas

### `screen-api-map.json`

```jsonc
{
  "generatedAt": "2026-06-15T10-29-49-239Z",
  "totalScreens": 25,
  "totalApisMapped": 117,
  "dependencyExecutionOrder": ["create_uom", "create_item_groups", ...],

  "groups": [{
    "group": "Masters",
    "icon": "Database",
    "screens": [{
      "name": "Items",
      "route": "/masters/items",
      "moduleId": 4,
      "moduleName": "Item Master",
      "apiCount": 6,
      "fieldCount": 17,
      "dependencyTierRange": { "min": 1, "max": 2 },

      // UI component fields extracted from the screen builder
      "screenFields": [{
        "componentType": "input",
        "name": "item_code",
        "label": "Item Code",
        "inputType": "text",
        "required": true,
        "validation": { "minLength": 1 },
        "dataSource": { "type": "state", "statePath": "..." }
      }, {
        "componentType": "select",
        "name": "uom_id",
        "label": "UOM",
        "required": true,
        "searchable": true,
        "optionsSource": {
          "endpoint": "/api/uom",
          "valueKey": "id",
          "labelKeys": ["uom_unit"]
        }
      }],

      // APIs mapped to this screen
      "apis": [{
        "name": "create_items",
        "method": "POST",
        "path": "/items/create",
        "dependencyTier": 2,          // from dependency map
        "dependencyOrder": 9,          // position in global exec order
        "dependsOn": ["create_uom", "create_item_groups"],
        "input": {
          "required": ["item_code", "name"],
          "optional": ["item_size", "uom_id", ...]
        },
        "constraints": [
          { "field": "item_code", "rule": "unique",
            "description": "Must be unique in items.item_code",
            "params": { "table": "items", "key": null } }
        ]
      }]
    }]
  }],

  "unassociatedModules": [{            // orphans: APIs with no UI screen
    "moduleId": 1,
    "moduleName": "users",
    "displayName": "Users",
    "apiCount": 2,
    "apis": [{ "name": "create_user", "dependencyTier": 1, ... }]
  }],

  "screenDependencySummary": [{        // all screens sorted by build order
    "screen": "Materials",
    "route": "/masters/materials",
    "group": "Masters",
    "apiCount": 5,
    "tierRange": { "min": 1, "max": 2 }
  }]
}
```

### `api-dependency-map.json`

```jsonc
{
  "tiers": [
    {
      "tier": 1,
      "description": "No dependencies — create these first",
      "apis": [{
        "name": "create_uom", "method": "POST",
        "module": "Unit of Measurement", "path": "/uom/create",
        "creates": ["uom"], "dependsOn": []
      }]
    }
  ],
  "executionOrder": ["create_uom", "create_item_groups", ...],
  "dependencyMap": { "create_items": ["create_uom", "create_item_groups"] },
  "reverseDeps": { "create_uom": ["get_uom", "create_items", ...] }
}
```

### UI Component Properties Captured

All properties from every named screen component are captured verbatim. Key types:

| Component Type | Typical Properties |
|----------------|--------------------|
| `input` | `name`, `label`, `inputType` (text/number/date), `required`, `disabled`, `readOnly`, `placeholder`, `validation` (minLength, pattern), `dataSource`, `onChangeAction`, `helpMessage`, `defaultValue` |
| `select` | `name`, `label`, `required`, `disabled`, `searchable`, `placeholder`, `optionsSource` (API endpoint, valueKey, labelKeys), `options` (static), `dataSource`, `onSelectAction` |
| `textarea` | `name`, `label`, `required`, `rows`, `placeholder`, `dataSource` |
| `code-generator` | `name`, `label`, `segments` (type, statePath, serialConfig), `serialConfig` |
| `key-value` | `name`, `label`, `readOnly`, `keyHeader`, `valueHeader`, `displayVariant` |

---

## File Reference

| File | Purpose |
|------|---------|
| `pipeline-stage1.mjs` | Unified orchestrator — runs all stages |
| `fetch-api-definitions.spec.ts` | Playwright — exports API definitions + modules |
| `fetch-ui-builder.spec.ts` | Playwright — exports UI screens with component trees |
| `map-dependencies.mjs` | Node — computes API dependency tiers via topological sort |
| `map-screen-apis.mjs` | Node — maps screens → APIs, merges UI constraints + dependency tiers |
| `assemble-ui-export.mjs` | Node — assembles UI export from raw screen data |
| `playwright.config.ts` | Playwright config |
