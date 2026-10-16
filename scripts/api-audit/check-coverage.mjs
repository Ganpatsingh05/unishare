// Completeness check for the audit doc: every path-shaped literal the extractor
// finds must be mentioned somewhere in the document, otherwise the tables are
// missing an endpoint. Both sides are normalized the same way (expressions and
// query strings collapsed), so `\${params}` and `{}` compare equal. Usage:
//
//   node scripts/api-audit/extract-fe.mjs src > /tmp/fe.tsv
//   node scripts/api-audit/check-coverage.mjs docs/API-WIRING-AUDIT.md /tmp/fe.tsv
import fs from 'fs';

const [docPath, tsvPath] = process.argv.slice(2);
if (!docPath || !tsvPath) {
  console.error('usage: node check-coverage.mjs <doc.md> <extract-fe output>');
  process.exit(2);
}

/** Collapse expressions, queries and trailing slashes so spellings compare equal. */
const shape = (p) =>
  p
    .replace(/\$\{[^}]*\}/g, '{}')
    .replace(/\{[^}]*\}/g, '{}')
    .replace(/\$\{.*$/, '') // an expression the literal scanner truncated
    .replace(/\?.*$/, '')
    .replace(/\/+$/, '');

const doc = fs.readFileSync(docPath, 'utf8');
const docPaths = new Set();
const docToken = /[/][A-Za-z][\w\-{}$/.]*/g;
for (const m of doc.matchAll(docToken)) docPaths.add(shape(m[0]));

const rows = fs
  .readFileSync(tsvPath, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.split('\t')[0]);

const covered = (p) => {
  if (docPaths.has(p)) return true;
  // Accept a parent mention: "/api/rooms/requests/{}/respond" is covered by
  // "/api/rooms/requests" only if that exact shorter path is written down.
  const parts = p.split('/').filter(Boolean);
  for (let i = parts.length - 1; i > 0; i--) {
    const shorter = '/' + parts.slice(0, i).join('/');
    if (docPaths.has(shorter)) return true;
  }
  return false;
};

const unmentioned = [...new Set(rows.map(shape))].filter((p) => !covered(p));

if (unmentioned.length === 0) {
  console.log(`All ${rows.length} extracted paths are mentioned in ${docPath}.`);
} else {
  console.log(`${unmentioned.length} distinct extracted paths are NOT mentioned in the doc:`);
  for (const m of unmentioned.sort()) console.log('  ' + m);
  process.exitCode = 1;
}
