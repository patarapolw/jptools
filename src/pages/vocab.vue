<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { IpadicFeatures } from 'kuromoji';
import { toHiragana } from 'wanakana';
import H from '@/components/H.vue';

function tokenDictID(t: IpadicFeatures) {
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

type TokenCount = {
  token: IpadicFeatures;
  count: number;
};

const reJa = /[\p{sc=Han}\p{sc=Katakana}\p{sc=Hiragana}]/u;
const nonPOS = new Set(['助詞', '助動詞']);

const raw = ref('');
const loader = ref('');
const output = ref<TokenCount[]>([]);

async function onUpload(evt: Event) {
  if (
    evt.target instanceof HTMLInputElement &&
    evt.target.files &&
    evt.target.files.length
  ) {
    const { files } = evt.target;
    const fns: Parameters<typeof makeCount>[0] = [];

    for (let i = 0; i < files.length; i++) {
      fns.push({
        loader: `Loading ${files[i].name}...`,
        action: () => files[i].text(),
      });
    }

    raw.value = '';
    await makeCount(fns);
  }
}

function makePOS(t: IpadicFeatures) {
  return [t.pos, t.pos_detail_1, t.pos_detail_2, t.pos_detail_3]
    .filter((s) => s !== '*')
    .join('・');
}

async function makeCount(
  fns: {
    loader: string;
    action: () => Promise<string>;
  }[],
) {
  output.value = [];

  const map = new Map<
    string,
    {
      token: IpadicFeatures;
      count: number;
    }
  >();

  for (const f of fns) {
    loader.value = f.loader;
    const tokens: IpadicFeatures[] = await fetch(
      'https://empty-dew-3935.herokuapp.com/api/tokenizer/kuromoji',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          text: await f.action(),
        }),
      },
    )
      .then((r) => (r.ok ? r.json() : { tokens: null }))
      .then((r) => r.tokens);
    if (!tokens) {
      continue;
    }

    for (const t of tokens) {
      if (!reJa.test(t.basic_form)) {
        continue;
      }

      if (nonPOS.has(t.pos)) {
        continue;
      }

      const id = tokenDictID(t);
      const v = map.get(id);

      if (v) {
        v.count++;
        map.set(id, v);
      } else {
        map.set(id, { token: t, count: 1 });
      }
    }
  }

  output.value = Array.from(map)
    .sort(([, v1], [, v2]) => v2.count - v1.count)
    .map(([, v]) => v);

  loader.value = '';
}

watch(raw, () => {
  if (raw.value.trim() && reJa.test(raw.value)) {
    makeCount([
      {
        loader: 'Loading...',
        action: async () => raw.value,
      },
    ]);
  }
});
</script>


<template>
  <H :level="1"> Vocabulary extractor </H>

  <div class="VocabPage">
    <input
      type="file"
      name="file"
      placeholder="Upload a file"
      accept="*.txt,.srt,.ass,.md,.json,.yaml,.yml"
      multiple
      @change="onUpload"
    />
    <small v-if="loader" v-text="loader"> </small>

    <textarea
      lang="ja"
      v-model="raw"
      placeholder="Or text written here will be converted to a list of vocabularies."
    />

    <table lang="ja">
      <colgroup>
        <col span="2" style="width: 25%" />
        <col />
        <col style="width: 2.5em" />
      </colgroup>
      <thead>
        <tr>
          <th>Vocabulary</th>
          <th>Reading</th>
          <th>Part of Speech</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in output" :key="i">
          <td>
            {{ r.token.basic_form }}
          </td>
          <td>
            {{ toHiragana(r.token.reading || '') }}
          </td>
          <td>
            {{ makePOS(r.token) }}
          </td>
          <td>
            {{ r.count > 1 ? r.count.toLocaleString('en-US') : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.VocabPage {
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: 1em;
  }

  th {
    text-align: left;
  }
}
</style>
