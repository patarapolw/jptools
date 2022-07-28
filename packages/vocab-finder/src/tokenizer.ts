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

export function tokenDictID(t: kuromoji.IpadicFeatures) {
  return [
    t.basic_form,
    t.reading || '',
    t.pronunciation || '',
    t.pos,
    t.pos_detail_1,
    t.pos_detail_2,
    t.pos_detail_3,
  ].join('\t');
}
