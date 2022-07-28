import { makeTokenizer } from './tokenizer';

async function main() {
  const tokenizer = await makeTokenizer();
  console.log(tokenizer.tokenize('すもももももももものうち'));
}

main();
