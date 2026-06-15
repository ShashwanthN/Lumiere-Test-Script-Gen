import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
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
