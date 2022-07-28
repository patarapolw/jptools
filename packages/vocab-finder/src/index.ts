import glob from 'fast-glob';
import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

import { dbToken, initDB } from './db';
import { makeTokenizer } from './tokenizer';

async function dumpFolder(folderName: string) {
  const tokenizer = await makeTokenizer();

  await Promise.all(
    glob
      .sync('*.srt', {
        cwd: folderName,
      })
      .map((f) => {
        const filename = joinPath(folderName, f);
        const raw = readFileSync(filename, 'utf-8');

        const tokens = tokenizer.tokenize(raw);
        console.log(f);

        return dbToken.insertMany(tokens.map((t) => ({ ...t, filename })));
      }),
  );
}

async function main() {
  const client = await initDB();
  await dumpFolder('M:\\Downloads\\DEATH.NOTE.-デスノート-(netflix)');
  await client.close();
}

main();
