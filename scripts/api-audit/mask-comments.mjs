/**
 * Blank out `//` and comment characters while keeping every character's offset,
 * so a commented-out `apiCall(...)` is not reported as a live call site and line
 * numbers stay valid. Newlines are preserved, so line counting is unaffected.
 */
export function maskComments(src) {
  const out = src.split('');
  let i = 0;
  let state = null; // null | 'line' | 'block' | the quote character
  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];
    if (state === null) {
      if (ch === '/' && next === '/') state = 'line';
      else if (ch === '/' && next === '*') state = 'block';
      else if (ch === '"' || ch === "'" || ch === '`') state = ch;
      i += 1;
      continue;
    }
    if (state === 'line') {
      if (ch === '\n') state = null;
      else out[i] = ' ';
      i += 1;
      continue;
    }
    if (state === 'block') {
      if (ch === '*' && next === '/') {
        out[i] = ' ';
        out[i + 1] = ' ';
        i += 2;
        state = null;
        continue;
      }
      if (ch !== '\n') out[i] = ' ';
      i += 1;
      continue;
    }
    // inside a string or template literal
    if (ch === '\\') i += 2;
    else {
      if (ch === state) state = null;
      i += 1;
    }
  }
  return out.join('');
}
