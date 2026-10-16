// Extracts every apiCall / apiCallFormData / apiCallWithProgress / batchAPICall
// call site in the source tree, with its HTTP method and endpoint, so the call
// sites can be diffed against the backend's route annotations.
//
//   node scripts/api-audit/extract-calls.mjs src
//
// Endpoints built from a local `const endpoint = …` are resolved one level;
// commented-out calls are ignored (1 was in this tree). Endpoints assembled from
// a runtime value outside the file still print as-is, so those files need a
// human read.
import fs from 'fs';
import path from 'path';
import { maskComments } from './mask-comments.mjs';

const ROOT = process.argv[2];
if (!ROOT) {
  console.error('usage: node extract-calls.mjs <source root>');
  process.exit(2);
}

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      walk(p);
    } else if (/\.(js|jsx|mjs)$/.test(entry.name)) files.push(p);
  }
};
walk(ROOT);

const CALLEE = /\b(apiCall|apiCallFormData|apiCallWithProgress|batchAPICall)\s*\(/g;

/** Grab the balanced argument list starting at the "(" index. */
function args(src, openIdx) {
  let depth = 0;
  let i = openIdx;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch;
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') i++;
        i++;
      }
      continue;
    }
    if (ch === '(' || ch === '{' || ch === '[') depth++;
    else if (ch === ')' || ch === '}' || ch === ']') {
      depth--;
      if (depth === 0) return src.slice(openIdx + 1, i);
    }
  }
  return src.slice(openIdx + 1);
}

const norm = (s) =>
  s
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/"(\$\{[^}]*\}[^"]*)"/g, '$1')
    .replace(/'(\$\{[^}]*\}[^']*)'/g, '$1');

const lineOf = (src, idx) => src.slice(0, idx).split(/\r?\n/).length;
const countIn = (text) =>
  (text.match(/\b(apiCall|apiCallFormData|apiCallWithProgress|batchAPICall)\s*\(/g) || []).length;

const out = [];
let commentedOut = 0;

for (const f of files.sort()) {
  const source = fs.readFileSync(f, 'utf8');
  const src = maskComments(source);
  commentedOut += countIn(source) - countIn(src);
  if (!/\b(apiCall|apiCallFormData|apiCallWithProgress|batchAPICall)\b/.test(src)) continue;

  const localConsts = new Map();
  for (const m of src.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(`[^`]*`|'[^']*'|"[^"]*")\s*;/g)) {
    localConsts.set(m[1], m[2].replace(/^['"`]|['"`]$/g, ''));
  }

  const rows = [];
  for (const m of src.matchAll(CALLEE)) {
    const a = args(src, m.index + m[0].length - 1);
    // First argument only: split on the first comma that is not inside a quote.
    const first = a.split(/,(?![^`'"]*[`'"])/)[0].trim();
    const method = (a.match(/method\s*:\s*['"](\w+)['"]/) || [, null])[1];

    let endpoint = first;
    const varOnly = first.match(/^([A-Za-z_$][\w$]*)$/);
    let resolvedFrom = null;
    if (varOnly && localConsts.has(varOnly[1])) {
      endpoint = localConsts.get(varOnly[1]);
      resolvedFrom = varOnly[1];
    }

    rows.push({
      line: lineOf(src, m.index),
      callee: m[1],
      method: method || 'GET',
      endpoint: norm(endpoint),
      resolvedFrom,
    });
  }
  if (rows.length) out.push({ file: f.replace(/\\/g, '/'), rows });
}

for (const { file, rows } of out) {
  console.log(`\n===== ${file}`);
  for (const r of rows) {
    console.log(
      `  ${String(r.line).padStart(4)}  ${r.method.padEnd(6)} ${r.endpoint}` +
        `${r.resolvedFrom ? `   (var ${r.resolvedFrom})` : ''}`
    );
  }
}

const total = out.reduce((n, f) => n + f.rows.length, 0);
console.error(`\n${total} live call sites in ${out.length} files, ${commentedOut} commented-out call(s) ignored`);
