<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { MecabWorker, UNIDIC3, UnidicFeature29 } from 'mecab-web-worker';
import { toHiragana } from 'wanakana';
import H from '@/components/H.vue';

let excludedList = new Set<string>();
let worker = ref<MecabWorker<UnidicFeature29>>()

onMounted(() => {
  const exluded = import.meta.glob('../../assets/excluded/vocab/*.txt', {
    as: 'raw', eager: true
  });

  excludedList = new Set(
    Object.values(exluded).flatMap((v) => {
      if (/^#\r?\n/.test(v)) {
        return '';
      }

      return v.split('\n').map((r) => {
        if (r[0] === '#') {
          return '';
        }

        const cols = r.trimEnd().split('\t');
        return [cols[0], cols[2]].join('\t');
      });
    }),
  );

  MecabWorker.create(UNIDIC3).then((w) => {
    console.log(w)
    worker.value = w
  });
});

function tokenDictID(t: UnidicFeature29) {
  return [t.basic_form, makePOS(t)].join('\t');
}

type TokenCount = {
  token: UnidicFeature29;
  count: number;
};

const reJa = /[\p{sc=Han}\p{sc=Katakana}\p{sc=Hiragana}]/u;
const nonPOS = new Set(['助詞', '助動詞']);

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

    await makeCount(fns);
  }
}

function onPaste(evt: ClipboardEvent) {
  const { target } = evt;
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement
  ) {
    setTimeout(() => {
      const { value } = target;
      if (value.trim() && reJa.test(value)) {
        makeCount([
          {
            loader: 'Loading...',
            action: async () => value,
          },
        ]);
      }
    }, 10);
  }
}

function makePOS(t: UnidicFeature29) {
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
      token: UnidicFeature29;
      count: number;
    }
  >();

  while (!worker.value) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  for (const f of fns) {
    loader.value = f.loader;
    const tokens: UnidicFeature29[] = (await worker.value.parseToNodes(await f.action())).map((n) => n.feature)

    for (const t of tokens) {
      if (!reJa.test(t.basic_form)) {
        continue;
      }

      if (nonPOS.has(t.pos)) {
        continue;
      }

      const id = tokenDictID(t);
      if (excludedList.has(id)) {
        continue;
      }

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
</script>


<template>
  <H :level="1"> Vocabulary extractor </H>

  <div class="VocabPage">
    <input type="file" name="file" placeholder="Upload a file" accept="*.txt,.srt,.ass,.md,.json,.yaml,.yml" multiple
      @change="onUpload" />
    <small v-if="loader" v-text="loader"> </small>

    <textarea lang="ja" placeholder="Or paste (Ctrl+V) some text here to convert to a list of vocabularies."
      @paste="onPaste" />

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

  >*+* {
    margin-top: 1em;
  }

  th {
    text-align: left;
  }
}
</style>
