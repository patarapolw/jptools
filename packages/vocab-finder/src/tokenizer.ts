import kuromoji from 'kuromoji';

export let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

export async function makeTokenizer(dicPath = 'dict') {
  tokenizer = await new Promise((resolve, reject) => {
    kuromoji
      .builder({
        dicPath, // Default path value
      })
      .build((e, t) => (e ? reject(e) : resolve(t)));
  });
  return tokenizer;
}
