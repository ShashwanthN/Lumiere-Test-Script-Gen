import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const APP_BASE = 'https://dev.erp.eepc.coffeeinc.in';
const API_BASE = 'https://api.dev.erp.eepc.coffeeinc.in/api';
const STORAGE  = 'storageState.json'; // lives next to playwright.config.ts
const OUT_DIR  = join(__dirname, 'output', 'tests');

// ─── Utilities ────────────────────────────────────────────────────────────────

function loadJSON(rel) {
  return JSON.parse(readFileSync(join(__dirname, rel), 'utf-8'));
}

function write(absPath, content) {
  mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content, 'utf-8');
}

function kebab(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function pad(n) { return String(n).padStart(2, '0'); }

// Escape single quotes for embedding in single-quoted JS strings
function q(s) { return String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

// ─── Load Stage-1 exports ─────────────────────────────────────────────────────

const screenMap = loadJSON('output/screen-api-map/latest/screen-api-map.json');
const uiExport  = loadJSON('output/ui-builder/latest/ui-builder-export.json');

// ─── Extract UI button metadata per screen route ──────────────────────────────

function buildUIMeta(uiExp) {
  const meta = {};
  for (const group of uiExp.groups) {
    for (const screen of group.screens) {
      const { route, components = [] } = screen;
      const m = { addTrigger: null, addSubmit: null, editSubmit: null, deleteConfirm: null, addUsesNavigate: false };
      for (const comp of components) {
        if (comp.component_type !== 'button') continue;
        const label   = comp.content?.label || '';
        const actions = comp.content?.action || [];
        for (const act of actions) {
          if (!m.addTrigger && act.type === 'open-modal' && /add|create|new/i.test(label))
            m.addTrigger = label;
          if (!m.addUsesNavigate && act.type === 'navigate' && /add|create|new/i.test(label))
            m.addUsesNavigate = true;
          if (!m.addSubmit && act.type === 'submit-form' && act.method === 'POST' && !/^cancel$/i.test(label.trim()))
            m.addSubmit = label;
          if (!m.editSubmit && act.type === 'submit-form' && act.method === 'PUT')
            m.editSubmit = label;
          if (!m.deleteConfirm && act.type === 'api-call' && act.method === 'DELETE')
            m.deleteConfirm = label;
        }
      }
      m.addTrigger    = m.addTrigger    || 'Add';
      m.addSubmit     = m.addSubmit     || 'Add';
      m.editSubmit    = m.editSubmit    || 'Submit';
      m.deleteConfirm = m.deleteConfirm || 'Delete';
      meta[route] = m;
    }
  }
  return meta;
}

// ─── Field fill-code generator ────────────────────────────────────────────────

// ─── Cascade-aware field ordering ─────────────────────────────────────────────
// Forms have dependency chains: a REQUIRED cascade select enables disabled
// downstream selects. We also respect URL path-param deps ({project_id} in
// endpoint means that field must appear after project_id in the fill sequence).

function getCascadeOrderedFields(screenFields) {
  function getEndpointDeps(f) {
    const ep = f.optionsSource?.endpoint || '';
    return [...ep.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
  }

  const isSelect = f => f.componentType === 'select' || f.componentType === 'dropdown';

  // Include disabled API-backed selects (cascade will enable them)
  const candidates = screenFields.filter(f =>
    !f.readOnly &&
    f.componentType !== 'code-generator' &&
    f.componentType !== 'key-value' &&
    f.componentType !== 'file-upload' &&
    !(f.disabled && !isSelect(f)) &&
    !(f.disabled && isSelect(f) && f.optionsSource?.type !== 'api')
  );

  const names = new Set(candidates.map(f => f.name));

  // Build URL path-param dependency graph
  const depMap = {};
  for (const f of candidates) {
    depMap[f.name] = getEndpointDeps(f).filter(d => names.has(d));
  }

  const visited = new Set();
  const result  = [];

  function visit(name) {
    if (visited.has(name)) return;
    visited.add(name);
    for (const dep of (depMap[name] || [])) visit(dep);
    const f = candidates.find(x => x.name === name);
    if (f) result.push(f);
  }

  // Priority: required enabled cascade → disabled cascade → disabled non-cascade
  //           → optional enabled cascade → remaining enabled
  const priority = [
    ...candidates.filter(f => !f.disabled && f.required  && f.onSelectAction?.length),
    ...candidates.filter(f =>  f.disabled                && f.onSelectAction?.length),
    ...candidates.filter(f =>  f.disabled                && !f.onSelectAction?.length),
    ...candidates.filter(f => !f.disabled && !f.required && f.onSelectAction?.length),
    ...candidates.filter(f => !f.disabled                && !f.onSelectAction?.length),
  ];

  const seen = new Set();
  for (const f of priority) {
    if (!seen.has(f.name)) { seen.add(f.name); visit(f.name); }
  }

  return result;
}

function fieldFillLines(field, valueExpr) {
  const { componentType, label, name, inputType, disabled, readOnly,
          optionsSource, options, onSelectAction } = field;
  const lbl = q(label || name);

  // Hard skips
  if (readOnly || componentType === 'code-generator') return [];
  // Disabled text/number inputs: may become enabled after a cascade select — try filling conditionally
  if (disabled && componentType !== 'select' && componentType !== 'dropdown') {
    const type = inputType || 'text';
    const isDate = type === 'date' || /(_date$|^date_|_dt$)/i.test(name);
    const val = isDate ? '`2026-01-01`' : '`1`';
    return [
      `    if (await page.getByLabel('${lbl}', { exact: false }).isEnabled().catch(() => false)) {`,
      `      await page.getByLabel('${lbl}', { exact: false }).fill(${val});`,
      `    }`,
    ];
  }
  // Disabled select without API source has no options to pick; skip
  if (disabled && (componentType === 'select' || componentType === 'dropdown') && optionsSource?.type !== 'api') return [];

  if (componentType === 'select' || componentType === 'dropdown') {
    // Robust multi-locator click: try label association, combobox sibling, button sibling.
    // Intentionally NOT using async .catch() — that pattern crashes when the test times
    // out and Playwright closes the page mid-catch.
    const clickBlock = [
      `    {`,
      `      const _lbl = page.getByLabel('${lbl}', { exact: false });`,
      `      const _cbx = page.locator('label').filter({ hasText: '${lbl}' }).locator('..').getByRole('combobox').first();`,
      `      const _btn = page.locator('label').filter({ hasText: '${lbl}' }).locator('xpath=following-sibling::*').locator('[role="combobox"], button').first();`,
      `      await (_lbl.or(_cbx).or(_btn)).first().click({ timeout: 12000 });`,
      `    }`,
    ];

    const waitOption = [
      `    await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });`,
      `    await page.getByRole('option').first().click();`,
    ];

    // After a CASCADE select the UI needs a moment to enable/populate dependent fields
    const cascadeWait = onSelectAction?.length
      ? [`    await page.waitForTimeout(700); // cascade: let dependent fields update`]
      : [];

    if (disabled) {
      // Initially disabled — the cascade trigger should have enabled it by now
      return [
        `    if (await page.locator('label').filter({ hasText: '${lbl}' }).locator('..').getByRole('combobox').first().isEnabled().catch(() => false)) {`,
        `      await page.locator('label').filter({ hasText: '${lbl}' }).locator('..').getByRole('combobox').first().click({ timeout: 12000 });`,
        `      await expect(page.getByRole('option').first()).toBeVisible({ timeout: 15000 });`,
        `      await page.getByRole('option').first().click();`,
        ...(onSelectAction?.length ? [`      await page.waitForTimeout(700);`] : []),
        `    }`,
      ];
    }

    if (Array.isArray(options) && options.length) {
      const opt = q(options[0].label ?? options[0].value ?? '');
      return [
        ...clickBlock,
        `    await page.getByRole('option', { name: '${opt}' }).first().click();`,
        ...cascadeWait,
      ];
    }

    return [...clickBlock, ...waitOption, ...cascadeWait];
  }

  if (componentType === 'textarea') {
    const prefix = (name || 'V').toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 8);
    const val = valueExpr || `\`${prefix}_\${T}\``;
    return [`    await page.getByLabel('${lbl}', { exact: false }).fill(${val});`];
  }

  if (componentType === 'input' || !componentType) {
    const type = inputType || 'text';
    // Detect date fields by inputType OR field name pattern (lst_reg_date, start_date, etc.)
    const isDate = type === 'date' || /(_date$|^date_|_dt$)/i.test(name);
    let val;
    if (valueExpr) {
      val = valueExpr;
    } else if (type === 'number') {
      val = '`${T}`';
    } else if (isDate) {
      val = '`2026-01-01`';
    } else {
      const prefix = (name || 'V').toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 8);
      val = `\`${prefix}_\${T}\``;
    }
    return [`    await page.getByLabel('${lbl}', { exact: false }).fill(${val});`];
  }

  return [`    // unhandled componentType '${componentType}' for field '${lbl}'`];
}

function fieldVarExpr(field) {
  if (!field) return null;
  const { componentType, name, inputType } = field;
  if (componentType === 'select' || componentType === 'dropdown') return null;
  const type = inputType || 'text';
  if (type === 'number') return '`${T}`';
  const isDate = type === 'date' || /(_date$|^date_|_dt$)/i.test(name);
  if (isDate) return '`2026-01-01`';
  const prefix = (name || 'V').toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 8);
  return `\`${prefix}_\${T}\``;
}

// ─── Constraint → test block ──────────────────────────────────────────────────
// Rules:
//  - 'exists': always API-level (select dropdowns only show valid options)
//  - 'unique' on non-fillable field (code-generator/auto-gen): API-level
//  - 'unique_except_self' on non-fillable or composite field: skip with TODO
//  - 'unique_combination': UI test re-submitting same selects
//  - min_length / max_length / is_email: UI-level on the field label

// uniqueVarName: the module-level JS variable that holds the value used in the create test
// (e.g. "ITEM_GROUP_C"). Passed so constraint tests can reference it directly without ctx.
function constraintTest(c, screen, ui, fillables, uniqueVarName) {
  const { rule, field: fieldName, description, params } = c;
  const route       = q(screen.route);
  const mod         = screen.moduleName || kebab(screen.name);
  const addTrigger  = q(ui.addTrigger);
  const addSubmit   = q(ui.addSubmit);
  const editSubmit  = q(ui.editSubmit);
  const postApi     = screen.apis?.find(a => a.method === 'POST');
  const apiPath     = postApi?.path || '';

  const fieldObj   = fillables.find(f => f.name === fieldName);
  const fieldLbl   = q(fieldObj?.label || fieldName);
  const isSelect   = fieldObj?.componentType === 'select' || fieldObj?.componentType === 'dropdown';
  const isFillable = !!fieldObj && !isSelect;

  const lenMatch = description?.match(/\d+/);
  const lenVal   = lenMatch ? parseInt(lenMatch[0], 10) : 0;

  const ctxKey = `'${mod}'`;

  // ── unique ──────────────────────────────────────────────────────────────────
  if (rule === 'unique') {
    if (!isFillable) {
      // Auto-generated or select — test via API call using ctx value
      return `
  test('${q(fieldName)} — unique name rejected (API)', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx[${ctxKey}]?.['${fieldName}']) test.skip();
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': ctx[${ctxKey}]['${fieldName}'] },
    });
    expect(resp.ok()).toBe(false);
  });`;
    }
    // For fillable unique fields: the same value used in the create test is in the
    // module-level variable — no ctx needed.
    const dupValue  = uniqueVarName && fieldName === (fillables.find(f => f.componentType !== 'select' && f.componentType !== 'dropdown' && f.name === fieldName)?.name)
      ? uniqueVarName
      : `ctx[${ctxKey}]['${fieldName}']`;
    const ctxGuard  = uniqueVarName ? '' : `    const ctx = readCtx();\n    if (!ctx[${ctxKey}]?.['${fieldName}']) test.skip();\n`;
    const otherFills = fillables
      .filter(f => f.name !== fieldName)
      .flatMap(f => fieldFillLines(f))
      .join('\n');
    return `
  test('${q(fieldName)} — unique name rejected', async ({ page }) => {
${ctxGuard}    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
    await page.getByLabel('${fieldLbl}', { exact: false }).fill(${dupValue});
${otherFills || '    // no other required fields'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });`;
  }

  // ── unique_except_self ──────────────────────────────────────────────────────
  if (rule === 'unique_except_self') {
    if (!isFillable || fieldName.startsWith('[')) {
      return `
  test('${q(fieldName)} — unique_except_self: TODO', async () => {
    // '${fieldName}' is auto-generated or a composite field — cannot test via form fill.
    test.skip();
  });`;
    }
    const createFills   = fillables.flatMap(f => fieldFillLines(f)).join('\n');
    const createFillsT2 = createFills.replace(/\$\{T\}/g, '${T2}');
    const fieldPrefix   = (fieldName || 'V').toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 8);
    // Value of the FIRST record (use module-level var if available, otherwise ctx)
    const firstVal  = uniqueVarName || `ctx[${ctxKey}]['${fieldName}']`;
    const ctxGuard2 = uniqueVarName ? '' : `    const ctx = readCtx();\n    if (!ctx[${ctxKey}]?.['${fieldName}']) test.skip();\n`;
    return `
  test('${q(fieldName)} — unique_except_self: duplicate on update rejected', async ({ page }) => {
${ctxGuard2}    const T2 = String(Date.now() + 1).slice(-6);
    const FIELD_T2 = \`${fieldPrefix}_\${T2}\`;
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
${createFillsT2}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /search|filter|find/i }).or(page.getByPlaceholder(/search|filter|find/i)).first().fill(FIELD_T2);
    await page.waitForTimeout(500);
    const row2 = page.getByRole('row').filter({ hasText: FIELD_T2 }).first();
    await row2.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());
    await page.getByLabel('${fieldLbl}', { exact: false }).clear();
    await page.getByLabel('${fieldLbl}', { exact: false }).fill(${firstVal});
    await page.getByRole('button', { name: '${editSubmit}', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|error/i).first()).toBeVisible({ timeout: 8000 });
  });`;
  }

  // ── exists ──────────────────────────────────────────────────────────────────
  // Always API-level: UI select dropdowns only list valid options, so an invalid UUID
  // can only be injected via direct API call.
  if (rule === 'exists') {
    return `
  test('${q(fieldName)} — nonexistent reference rejected (API)', async ({ page }) => {
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': '00000000-0000-0000-0000-000000000000' },
    });
    expect(resp.ok()).toBe(false);
  });`;
  }

  // ── unique_combination ──────────────────────────────────────────────────────
  // Re-submit the same selects — the server should reject the duplicate combination.
  if (rule === 'unique_combination') {
    const allFills = fillables.flatMap(f => fieldFillLines(f)).join('\n');
    return `
  test('${q(fieldName)} — unique combination rejected', async ({ page }) => {
    const ctx = readCtx();
    if (!ctx[${ctxKey}]) test.skip();
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
${allFills || '    // no fillable fields'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/unique|already exists|duplicate|combination|error/i)).toBeVisible({ timeout: 8000 });
  });`;
  }

  // ── min_length ──────────────────────────────────────────────────────────────
  if (rule === 'min_length' && lenVal > 0) {
    if (!isFillable) {
      return `
  test('${q(fieldName)} — below min length (${lenVal}) rejected (API)', async ({ page }) => {
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': '${'A'.repeat(Math.max(0, lenVal - 1))}' },
    });
    expect(resp.ok()).toBe(false);
  });`;
    }
    const otherFills = fillables.filter(f => f.name !== fieldName).flatMap(f => fieldFillLines(f)).join('\n');
    return `
  test('${q(fieldName)} — below min length (${lenVal}) rejected', async ({ page }) => {
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
    await page.getByLabel('${fieldLbl}').fill('${'A'.repeat(Math.max(0, lenVal - 1))}');
${otherFills || '    // no other fields'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/min|short|required|at least|too few|error/i)).toBeVisible({ timeout: 5000 });
  });`;
  }

  // ── max_length ──────────────────────────────────────────────────────────────
  if (rule === 'max_length' && lenVal > 0) {
    if (!isFillable) {
      return `
  test('${q(fieldName)} — above max length (${lenVal}) rejected (API)', async ({ page }) => {
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': '${'A'.repeat(lenVal + 1)}' },
    });
    expect(resp.ok()).toBe(false);
  });`;
    }
    return `
  test('${q(fieldName)} — above max length (${lenVal}) rejected', async ({ page }) => {
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
    await page.getByLabel('${fieldLbl}').fill('${'A'.repeat(lenVal + 1)}');
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/max|too long|limit|exceed|error/i)).toBeVisible({ timeout: 5000 });
  });`;
  }

  // ── is_email ─────────────────────────────────────────────────────────────────
  if (rule === 'is_email') {
    if (!isFillable) {
      return `
  test('${q(fieldName)} — invalid email rejected (API)', async ({ page }) => {
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': 'not-an-email' },
    });
    expect(resp.ok()).toBe(false);
  });`;
    }
    return `
  test('${q(fieldName)} — invalid email rejected', async ({ page }) => {
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
    await page.getByLabel('${fieldLbl}').fill('not-an-email');
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/email|invalid|format|error/i)).toBeVisible({ timeout: 5000 });
  });`;
  }

  // ── not_exceeds_available ─────────────────────────────────────────────────────
  if (rule === 'not_exceeds_available') {
    if (!isFillable) {
      return `
  test('${q(fieldName)} — exceeds available rejected (API)', async ({ page }) => {
    const resp = await page.request.post('${API_BASE}${q(apiPath)}', {
      data: { '${fieldName}': 999999 },
    });
    expect(resp.ok()).toBe(false);
  });`;
    }
    return `
  test('${q(fieldName)} — exceeds available rejected', async ({ page }) => {
    await page.goto('${route}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
    await page.getByLabel('${fieldLbl}').fill('999999');
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.getByText(/exceed|available|limit|error/i)).toBeVisible({ timeout: 5000 });
  });`;
  }

  // ── generic fallback ──────────────────────────────────────────────────────────
  return `
  test('${q(fieldName)} — ${q(rule)} constraint: TODO', async () => {
    // Rule '${rule}' on field '${fieldName}': ${description}
    test.skip();
  });`;
}

// ─── Full spec file generator ─────────────────────────────────────────────────

function genSpec(screen, groupName, tier, ui) {
  const { name, route, moduleName, pageHeading, screenFields = [], addFields = [], editFields = [], apis = [] } = screen;
  const mod = moduleName || kebab(name);

  const postApis    = apis.filter(a => a.method === 'POST');
  const putApis     = apis.filter(a => a.method === 'PUT');
  const deleteApis  = apis.filter(a => a.method === 'DELETE');
  const getListApi  = apis.find(a => a.method === 'GET' && !a.path.includes('{'));

  // Cascade-aware ordered list: REQUIRED triggers first, then their dependent
  // disabled selects (which cascade enables), then remaining fields.
  const fillables = getCascadeOrderedFields(screenFields);

  // Partitioned field lists per modal context.
  // Falls back to fillables when no dedicated modal fields exist.
  const addFillablesRaw  = getCascadeOrderedFields(addFields);
  const editFillablesRaw = getCascadeOrderedFields(editFields);
  const addFillables  = addFillablesRaw.length  ? addFillablesRaw  : fillables;
  const editFillables = editFillablesRaw.length ? editFillablesRaw : fillables;

  // ── Identify unique field for tracking created record across tests ──
  // Preference: first fillable (non-select, non-auto-gen) field that has a `unique` constraint.
  // Fallback: any fillable text field.
  // If none: track by recency (first record in GET response sorted desc by created_at).
  const allPostConstraints  = postApis.flatMap(a => a.constraints || []);
  const uniqueConstraints   = allPostConstraints.filter(c => c.rule === 'unique');

  // Split into UI-testable vs auto-generated unique fields
  const fillableUniqCs = uniqueConstraints.filter(c => {
    const f = fillables.find(ff => ff.name === c.field);
    return f && f.componentType !== 'select' && f.componentType !== 'dropdown';
  });

  // Primary tracking field (fillable text/input with unique constraint)
  const primaryUniqueC     = fillableUniqCs[0] || null;
  const primaryUniqueName  = primaryUniqueC?.field || null;
  const primaryUniqueField = primaryUniqueName ? fillables.find(f => f.name === primaryUniqueName) : null;

  // Auto-generated unique fields (code-generator or not in fillables) — get from GET response
  const autoGenUniqCs = uniqueConstraints.filter(c => !fillableUniqCs.includes(c));

  // If any unique field is auto-generated (code-generator), we cannot safely re-create records
  // in the same session — the generator produces the same code every time (same state + serial reset).
  const hasAutoGenUniq = autoGenUniqCs.length > 0;

  const canTrackByField = !!primaryUniqueField;

  const routeQ        = q(route);
  const addTrigger    = q(ui.addTrigger);
  const addSubmit     = q(ui.addSubmit);
  const editSubmit    = q(ui.editSubmit);
  const deleteConfirm = q(ui.deleteConfirm);
  const tierLabel     = `Tier ${tier}`;

  // List path for fetching created record
  const listPath = getListApi ? getListApi.path : null;

  // Variable name for primary unique field (used in CONST declarations in test)
  const uniqueVarName = primaryUniqueName
    ? primaryUniqueName.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 12)
    : null;
  const uniqueVarExpr = primaryUniqueField ? fieldVarExpr(primaryUniqueField) : null;

  // ── UI Render ──
  // Use the actual h4/h3 heading text from the UI export if available, else fall back to screen name
  const headingText = pageHeading || name;
  const renderAssert = `    await expect(page.getByRole('heading', { name: '${q(headingText)}', exact: false }).first()).toBeVisible({ timeout: 25000 });`;

  // ── Helper: build fill lines, overriding the unique field with a given expression ──
  function buildFillLines(fieldList, varOverride) {
    // Sort by order_index so cascade parents come before dependents
    const sorted = [...fieldList].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    const lines = [];
    for (const f of sorted) {
      if (f.name === primaryUniqueName && varOverride) {
        lines.push(`    await page.getByLabel('${q(primaryUniqueField?.label || primaryUniqueName)}', { exact: false }).fill(${varOverride});`);
      } else {
        lines.push(...fieldFillLines(f));
      }
      // Cascade wait is handled inside fieldFillLines — no extra pause needed here
      if (false) {}
    }
    return lines.join('\n');
  }

  // Fill lines for the main create test (uses UNIQUE_VAR)
  const createFillLines = buildFillLines(addFillables, uniqueVarName);

  // Fill lines for self-contained update/delete setup (uses UPD_TRACK / DEL_TRACK)
  const updSetupFillLines = buildFillLines(addFillables, uniqueVarName ? 'UPD_TRACK' : null);
  const delSetupFillLines = buildFillLines(addFillables, uniqueVarName ? 'DEL_TRACK' : null);

  // ── writeCtx — cross-tier: store id + auto-gen fields for tier 2+ tests ──
  const ctxFields = [];
  if (canTrackByField && uniqueVarName && primaryUniqueName) {
    ctxFields.push(`'${primaryUniqueName}': ${uniqueVarName}`);
  }
  for (const c of autoGenUniqCs) {
    ctxFields.push(`'${c.field}': record?.['${c.field}'] ?? null`);
  }
  const ctxWriteData = `{ id: record?.id ?? null${ctxFields.length ? ', ' + ctxFields.join(', ') : ''} }`;
  const findRecordExpr = canTrackByField && primaryUniqueName && uniqueVarName
    ? `    const record = found.find(r => String(r['${primaryUniqueName}'] ?? '') === ${uniqueVarName});`
    : `    const record = found[0];`;

  // Screens whose add flow uses page navigation instead of a modal cannot be tested with the
  // standard modal pattern — skip all CRUD tests and leave a note for manual implementation.
  const navigateSkipTest = `
  test.skip('create / update / delete — navigate-based add flow', async () => {
    // The "Add" button on this screen navigates to a separate page instead of opening a modal.
    // CRUD tests require a custom implementation that follows that navigation flow.
  });`;

  // ── Create test ──
  const createTest = postApis.length === 0 ? '' : ui.addUsesNavigate ? navigateSkipTest : `
  test('create record with valid data', async ({ page }) => {
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
${createFillLines || '    // no fillable fields — form may be auto-populated'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
${listPath ? `    // Write ctx for cross-tier tests (tier 2+ may need this screen's id)
    const token = await page.evaluate(() => window.localStorage.getItem('access_token') || '');
    const resp = await page.request.get('${API_BASE}${listPath}', {
      headers: token ? { 'Authorization': \`Bearer \${token}\` } : {},
    });
    const list = await resp.json().catch(() => ({}));
    const rawData = list?.data?.data ?? list?.data ?? list;
    const found = Array.isArray(rawData) ? rawData : [];
${findRecordExpr}
    writeCtx('${mod}', ${ctxWriteData});` : `    writeCtx('${mod}', { id: null });`}
  });`;

  // ── POST constraint tests (pass uniqueVarName so they use module-level var, not ctx) ──
  const postConstraintTests = postApis.flatMap(api =>
    (api.constraints || []).map(c => constraintTest(c, screen, ui, addFillables, uniqueVarName))
  ).join('\n');

  // ── Update fill lines (non-unique fields get a _UPD_ suffix to prove the update happened) ──
  const updateFillLines = editFillables
    .filter(f => f.name !== primaryUniqueName)
    .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
    .flatMap(f => {
      const type   = f.inputType || 'text';
      const isDate = type === 'date' || /(_date$|^date_|_dt$)/i.test(f.name);
      if (!isDate && (type === 'text' || !type) && f.componentType !== 'select' && f.componentType !== 'dropdown') {
        return [`    await page.getByLabel('${q(f.label || f.name)}', { exact: false }).fill(\`1\`);`];
      }
      return fieldFillLines(f);
    })
    .join('\n');

  // ── Row finders use the in-test tracking var (UPD_TRACK / DEL_TRACK) ──
  // Search placeholder patterns to find the table search input
  const searchPattern = `/search|filter|find/i`;

  const updRowFinder = canTrackByField && primaryUniqueName
    ? `    await page.getByRole('textbox', { name: ${searchPattern} }).or(page.getByPlaceholder(${searchPattern})).first().fill(UPD_TRACK);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: UPD_TRACK }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());`
    : `    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());`;

  const delRowFinder = canTrackByField && primaryUniqueName
    ? `    await page.getByRole('textbox', { name: ${searchPattern} }).or(page.getByPlaceholder(${searchPattern})).first().fill(DEL_TRACK);
    await page.waitForTimeout(500);
    const delRow = page.getByRole('row').filter({ hasText: DEL_TRACK }).first();
    await delRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());`
    : `    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());`;

  // When auto-generated unique fields exist, reuse the record from the create test instead of
  // creating fresh setup records — the code-generator resets its serial each form open, so
  // re-creating within the same session always produces duplicate codes.
  const updRowFinderFromCtx = canTrackByField && primaryUniqueName
    ? `    const updCtx = readCtx();
    if (!updCtx['${mod}']?.['${primaryUniqueName}']) test.skip();
    const updSearch = updCtx['${mod}']['${primaryUniqueName}'];
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: ${searchPattern} }).or(page.getByPlaceholder(${searchPattern})).first().fill(updSearch);
    await page.waitForTimeout(500);
    const updRow = page.getByRole('row').filter({ hasText: updSearch }).first();
    await updRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());`
    : `    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /edit/i }).first().click()
      .catch(() => page.getByRole('button', { name: /edit/i }).first().click());`;

  const delRowFinderFromCtx = canTrackByField && primaryUniqueName
    ? `    const delCtx = readCtx();
    if (!delCtx['${mod}']?.['${primaryUniqueName}']) test.skip();
    const delSearch = delCtx['${mod}']['${primaryUniqueName}'];
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: ${searchPattern} }).or(page.getByPlaceholder(${searchPattern})).first().fill(delSearch);
    await page.waitForTimeout(500);
    const delRow = page.getByRole('row').filter({ hasText: delSearch }).first();
    await delRow.getByRole('button').last().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());`
    : `    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.locator('tr, [role="row"]').getByRole('button').last().first().click();
    await page.getByRole('menuitem', { name: /delete|remove/i }).first().click()
      .catch(() => page.getByRole('button', { name: /delete|remove/i }).first().click());`;

  // ── Update test — self-contained when no auto-gen unique fields; otherwise reuses create record ──
  const updTrackInit = uniqueVarName
    ? `    const UPD_TRACK = \`UPD_\${T}\`;`
    : '';
  const updateTest = putApis.length === 0 || postApis.length === 0 ? '' : hasAutoGenUniq ? `
  test('update record with valid data', async ({ page }) => {
${updRowFinderFromCtx}
${updateFillLines || '    // no editable non-unique fields'}
    await page.getByRole('button', { name: '${editSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });` : `
  test('update record with valid data', async ({ page }) => {
${updTrackInit}
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
${updSetupFillLines || '    // no fillable fields'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
${updRowFinder}
${updateFillLines || '    // no editable non-unique fields'}
    await page.getByRole('button', { name: '${editSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });`;

  // ── PUT constraint tests (need POST to create a record first for unique_except_self) ──
  const putConstraintTests = postApis.length > 0 ? putApis.flatMap(api =>
    (api.constraints || []).map(c => constraintTest(c, screen, ui, addFillables, uniqueVarName))
  ).join('\n') : '';

  // ── Delete test — self-contained when no auto-gen unique fields; otherwise reuses create record ──
  const delTrackInit = uniqueVarName
    ? `    const DEL_TRACK = \`DEL_\${T}\`;`
    : '';
  const deleteTest = deleteApis.length === 0 || postApis.length === 0 ? '' : hasAutoGenUniq ? `
  test('delete record', async ({ page }) => {
${delRowFinderFromCtx}
    await page.getByRole('button', { name: '${deleteConfirm}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });` : `
  test('delete record', async ({ page }) => {
${delTrackInit}
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: '${addTrigger}' }).click();
${delSetupFillLines || '    // no fillable fields'}
    await page.getByRole('button', { name: '${addSubmit}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
${delRowFinder}
    await page.getByRole('button', { name: '${deleteConfirm}', exact: true }).click();
    await expect(page.locator('[role="dialog"][data-slot="sheet-content"]')).toBeHidden({ timeout: 30000 });
  });`;

  return `import { test, expect } from '@playwright/test';
import { readCtx, writeCtx } from './helpers/context';

// ${tierLabel} — ${groupName} — ${name}
// Route: ${route}
// APIs: ${apis.map(a => `${a.method} ${a.name}`).join(', ')}

const T = String(Date.now()).slice(-6);${canTrackByField && uniqueVarName && uniqueVarExpr ? `
const ${uniqueVarName} = ${uniqueVarExpr};` : ''}

// ─── UI Render ────────────────────────────────────────────────────────────────

test.describe('${tierLabel} — ${groupName} — ${name} — UI renders', () => {
  test('UI renders', async ({ page }) => {
    await page.goto('${routeQ}', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
${renderAssert}
  });
});

// ─── Data Set ─────────────────────────────────────────────────────────────────

test.describe('${tierLabel} — ${groupName} — ${name} — Data Set', () => {
${createTest}
${postConstraintTests}
${updateTest}
${putConstraintTests}
${deleteTest}
});
`;
}

// ─── Collect ordered screens ──────────────────────────────────────────────────

const uiMeta = buildUIMeta(uiExport);

const screenByRoute = {};
const groupByRoute  = {};
for (const group of screenMap.groups) {
  for (const screen of group.screens) {
    screenByRoute[screen.route] = screen;
    groupByRoute[screen.route]  = group.group;
  }
}

const orderedScreens = (screenMap.screenDependencySummary || [])
  .map(entry => ({
    entry,
    screen: screenByRoute[entry.route],
    group:  groupByRoute[entry.route] || entry.group || 'Unknown',
  }))
  .filter(x => x.screen);

// ─── Write context helper ─────────────────────────────────────────────────────

const contextTs = `import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Context file lives at output/tests/context/test-context.json relative to CWD (project root)
const CTX_PATH = join(process.cwd(), 'output', 'tests', 'context', 'test-context.json');

export function readCtx(): Record<string, any> {
  if (!existsSync(CTX_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CTX_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

export function writeCtx(module: string, data: Record<string, any>): void {
  const ctx = readCtx();
  ctx[module] = { ...(ctx[module] || {}), ...data };
  mkdirSync(join(process.cwd(), 'output', 'tests', 'context'), { recursive: true });
  writeFileSync(CTX_PATH, JSON.stringify(ctx, null, 2), 'utf-8');
}
`;

// ─── Write global-setup.ts ────────────────────────────────────────────────────

const globalSetupTs = `import { chromium } from '@playwright/test';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const EMAIL    = process.env.EMAIL    || 'coffee@coffeeinc.in';
const PASSWORD = process.env.PASSWORD || 'Kafka@shore25';
const BASE_URL = '${APP_BASE}';
const STATE_PATH = join(process.cwd(), 'storageState.json');

export default async function globalSetup() {
  // Reuse an existing session if it's less than 1 hour old
  if (existsSync(STATE_PATH)) {
    const age = Date.now() - statSync(STATE_PATH).mtimeMs;
    if (age < 3_600_000) {
      console.log('  ✓ storageState.json is fresh — skipping login');
      return;
    }
  }

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  console.log('  → Logging in to ' + BASE_URL + ' ...');
  await page.goto(BASE_URL + '/login');
  await page.getByPlaceholder('you@example.com').fill(EMAIL);
  await page.getByPlaceholder('Enter your password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForSelector('text=Welcome back!', { timeout: 20000 });

  await page.context().storageState({ path: STATE_PATH });
  console.log('  ✓ Logged in — storageState.json saved');

  await browser.close();
}
`;

// ─── Write playwright.config.ts ───────────────────────────────────────────────

const playwrightConfig = `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 120000,
  reporter: [
    ['html', { outputFolder: '../../test-report', open: 'never' }],
    ['json', { outputFile: '../../test-report/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: '${APP_BASE}',
    storageState: '${STORAGE}',
    actionTimeout: 15000,
    navigationTimeout: 90000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
    },
  },
  outputDir: '../../test-results',
});
`;

// ─── Write all output files ───────────────────────────────────────────────────

write(join(OUT_DIR, 'helpers', 'context.ts'), contextTs);
write(join(OUT_DIR, 'global-setup.ts'), globalSetupTs);
write(join(OUT_DIR, 'playwright.config.ts'), playwrightConfig);
write(join(OUT_DIR, 'context', '.gitkeep'), '');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   Lumiere — Stage 2: Test Generator              ║');
console.log('╚══════════════════════════════════════════════════╝\n');

// Screens to skip (non-CRUD screens like document-intelligence have no datatable)
const SKIP_ROUTES = new Set(['/adeos_document_intelligence']);

let fileCount = 0;
let testCount = 0;
let screenIdx = 0;  // global counter — drives file sort order, preserving dependency ordering

for (const { entry, screen, group } of orderedScreens) {
  screenIdx++;
  if (SKIP_ROUTES.has(screen.route)) {
    console.log(`  - ${kebab(screen.name)}.spec.ts  (skipped — non-CRUD screen)`);
    continue;
  }
  const tier     = entry.tierRange?.min || 1;
  // Prefix with zero-padded global index so files sort in dependency order regardless
  // of alphabetical ordering within a tier (e.g. applicable-pgma must run after projects).
  const fileName = `${String(screenIdx).padStart(2, '0')}-tier${tier}-${kebab(screen.name)}.spec.ts`;
  const ui       = uiMeta[screen.route] || { addTrigger: 'Add', addSubmit: 'Add', editSubmit: 'Submit', deleteConfirm: 'Delete' };
  const content  = genSpec(screen, group, tier, ui);

  write(join(OUT_DIR, fileName), content);

  const postApis = (screen.apis || []).filter(a => a.method === 'POST');
  const putApis  = (screen.apis || []).filter(a => a.method === 'PUT');
  const delApis  = (screen.apis || []).filter(a => a.method === 'DELETE');
  // PUT & DELETE tests create a record first, so they need a POST API
  const hasPost = postApis.length > 0;
  const putConsts = hasPost ? putApis.flatMap(a => a.constraints || []) : [];
  const testsHere = 1 // UI render
    + (hasPost ? 1 : 0)   // create
    + (postApis.flatMap(a => a.constraints || []).length + putConsts.length) // constraint tests
    + (putApis.length && hasPost ? 1 : 0)    // update
    + (delApis.length && hasPost ? 1 : 0);   // delete
  testCount += testsHere;

  const enabledConsts = [...postApis.flatMap(a => a.constraints || []), ...putConsts];
  const constSummary = enabledConsts.length
    ? ` [${enabledConsts.map(c => c.rule).join(', ')}]`
    : '';
  console.log(`  ✓ ${fileName}  (${testsHere} tests${constSummary})`);
  fileCount++;
}

console.log(`\n  Helpers:`);
console.log(`    output/tests/global-setup.ts`);
console.log(`    output/tests/helpers/context.ts`);
console.log(`    output/tests/playwright.config.ts`);
console.log(`\n  Generated ${fileCount} spec files / ~${testCount} tests`);
console.log(`\n  Run tests:`);
console.log(`    npx playwright test --config output/tests/playwright.config.ts`);
console.log(`\n  Run single screen:`);
console.log(`    npx playwright test --config output/tests/playwright.config.ts output/tests/01-tier1-materials.spec.ts`);
console.log(`\n  List tests (no browser):`);
console.log(`    npx playwright test --config output/tests/playwright.config.ts --list\n`);
