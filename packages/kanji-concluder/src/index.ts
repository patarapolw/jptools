import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const reJa = /\p{sc=Han}/gu;

async function main() {
  const txt = readFileSync('assets/Being Japanese Part 1 of 2.md', 'utf-8');

  const chars = new Map<string, number>();
  reJa.lastIndex = 0;
  while (true) {
    const m = reJa.exec(txt);
    if (!m) {
      break;
    }

    const c = m[0];
    if (!c) {
      break;
    }

    chars.set(c, (chars.get(c) || 0) + 1);
  }

  console.log(Array.from(chars).sort(([, i], [, j]) => j - i));
}

main();
