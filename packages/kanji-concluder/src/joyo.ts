import { readFileSync, writeFileSync } from 'fs';

async function main() {
  const txt = readFileSync('tmp/2020-joyo.md', 'utf-8');

  let out = '';

  for (const gr of txt.split('===')) {
    const set: string[] = [];

    for (const ln of gr.split('\n')) {
      const m = ln.match(/^\d+\t(\p{sc=Han})/u);
      if (!m || !m[1]) {
        continue;
      }
      set.push(m[1]);
    }

    out += set.join('') + '\n\n';
  }

  writeFileSync('out/2020-joyo.md', out);
}

main();
