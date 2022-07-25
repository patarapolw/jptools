import { readFileSync, writeFileSync } from 'fs';

function getKanji(s: string) {
  const out: string[] = [];

  const reJa = /\p{sc=Han}/gu;
  for (const m of s.matchAll(reJa)) {
    if (!m[0]) continue;
    out.push(m[0]);
  }

  return out;
}

async function main() {
  const txt =
    readFileSync('assets/Being Japanese Part 1 of 2.md', 'utf-8') +
    readFileSync('assets/Being Japanese Part 2 of 2.md', 'utf-8');
  const joyoMap = new Map<string, number>();

  readFileSync('out/2020-joyo.md', 'utf-8')
    .split('\n\n')
    .map((ln, lv) => {
      getKanji(ln).map((c) => {
        joyoMap.set(c, lv + 1);
      });
    });

  const chars = new Map<string, number>();

  getKanji(txt).map((c) => {
    const lv = joyoMap.get(c);
    if (!lv || lv <= 6) {
      return;
    }

    chars.set(c, (chars.get(c) || 0) + 1);
  });

  writeFileSync(
    'out/Being Japanese.tsv',
    Array.from(chars)
      .sort(([, i], [, j]) => j - i)
      .map((ln) => ln.join('\t'))
      .join('\n'),
  );
}

main();
