// Collects every path-shaped string literal in the source tree and dedupes it,
// so nothing is missed when a path is assembled across lines or held in a
// variable. Commented-out code is ignored.
//
//   node scripts/api-audit/extract-fe.mjs src
import fs from 'fs';
import path from 'path';
import { maskComments } from './mask-comments.mjs';

const ROOT = process.argv[2];
if (!ROOT) {
  console.error('usage: node extract-fe.mjs <source root>');
  process.exit(2);
}
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(e.name)) continue;
      walk(p);
    } else if (/\.(js|jsx|mjs)$/.test(e.name)) files.push(p);
  }
};
walk(ROOT);

// Every literal (single, double or back-quoted) whose content starts with "/"
const LIT = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
const norm = (s) => s.replace(/\$\{[^}]*\}/g, '{}').replace(/\s+/g, '');

const rows = [];
for (const f of files.sort()) {
  const src = maskComments(fs.readFileSync(f, 'utf8'));
  for (const m of src.matchAll(LIT)) {
    const raw = m[2];
    if (!raw.startsWith('/')) continue;
    if (raw.length > 120) continue;
    // keep only things that look like API paths
    if (!/^\/[A-Za-z0-9_\-{}$\/.]/.test(raw)) continue;
    if (/\.(js|jsx|css|png|jpe?g|svg|webp|ico|json|mjs)$/.test(raw)) continue;
    const line = src.slice(0, m.index).split(/\r?\n/).length;
    rows.push({ file: path.relative(process.cwd(), f).replace(/\\/g, '/'), line, raw, norm: norm(raw) });
  }
}

const seen = new Map();
for (const r of rows) {
  const key = r.norm;
  if (!seen.has(key)) seen.set(key, { ...r, hits: [] });
  seen.get(key).hits.push(`${r.file}:${r.line}`);
}

const backendish = [...seen.values()].filter((r) =>
  /^\/(api|admin|auth|user-management|control-panel|health)\b/.test(r.norm)
);

backendish.sort((a, b) => a.norm.localeCompare(b.norm));
for (const r of backendish) {
  console.log(`${r.norm}\t${r.hits.length}\t${r.hits.slice(0, 3).join(' ')}`);
}
console.error(`\n${backendish.length} distinct backend-ish endpoints out of ${rows.length} literals in ${files.length} files`);
