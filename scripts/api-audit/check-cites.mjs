// Checks every markdown link of the form [label](../path/to/file.js#L12) in the
// audit doc: the file must exist and the cited line is printed so the claim can
// be eyeballed. Run from the repo root:
//
//   node scripts/api-audit/check-cites.mjs
import fs from 'fs';

const DOC = process.argv[2] || 'docs/API-WIRING-AUDIT.md';
const doc = fs.readFileSync(DOC, 'utf8');
const re = /\[([^\]]*)\]\((\.\.\/([^)#]+)#L(\d+)(?:-L(\d+))?)\)/g;

const seen = new Set();
let bad = 0;
for (const m of doc.matchAll(re)) {
  const [, , , rel, start, end] = m;
  const key = `${rel}#L${start}`;
  if (seen.has(key)) continue;
  seen.add(key);

  if (!fs.existsSync(rel)) {
    console.log(`MISSING FILE  ${rel}`);
    bad += 1;
    continue;
  }

  const lines = fs.readFileSync(rel, 'utf8').split(/\r?\n/);
  const from = Number(start);
  const to = end ? Number(end) : from;
  const slice = lines.slice(from - 1, to).map((l) => l.trim()).join(' / ');
  if (!slice.trim()) {
    console.log(`BLANK LINE    ${rel}:${start}`);
    bad += 1;
    continue;
  }
  console.log(`${rel}:${start}${end ? `-${end}` : ''}  |  ${slice.slice(0, 150)}`);
}

console.log(`\n${seen.size} distinct citations checked, ${bad} bad`);
