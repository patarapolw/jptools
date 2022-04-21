<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import { toHiragana, toKatakana, isKana } from 'wanakana'

import {
  markdownMode,
  htmlMode,
  markdownModes,
  furiganaSample,
  htmlModes,
} from '@/shared/furigana'

import type { WritingModeProperty } from 'csstype'

const props = defineProps<{
  mini?: boolean
}>()

const modes = {
  Markdown: markdownModes,
  HTML: htmlModes,
}

const placeholder =
  'Any Japanese typed with an IME here will retain its Furigana...'

const raw = ref('')
const html = ref('')

const furigana = ref('')
const elTextArea = ref<HTMLTextAreaElement | HTMLInputElement>()
const renderMode = ref(markdownMode.value)
const writingMode = ref<WritingModeProperty>('horizontal-tb')

onMounted(() => {
  if (!props.mini) {
    elTextArea.value?.focus?.()
  }
  renderHTML()
})

watch(renderMode, () => {
  console.log(markdownModes[renderMode.value.key])
  if (markdownModes[renderMode.value.key]) {
    markdownMode.value = renderMode.value
  } else {
    htmlMode.value = renderMode.value
  }

  elTextArea.value?.focus?.()
  renderHTML()
})

watch(raw, () => {
  renderHTML()
})

function renderHTML() {
  const md = markdownModes[renderMode.value.key]
  html.value = md ? md.html(raw.value) : raw.value
}

function onTextAreaUpdate({ data }: { data: string }) {
  if (/^[\p{sc=Katakana}\p{sc=Hiragana}]+$/u.test(data)) {
    furigana.value = data
  }
}

function addFurigana(ev: Event) {
  const { data } = ev as unknown as {
    data: string
  }

  const { value: target } = elTextArea

  if (furigana.value && typeof data === 'string' && data.trim() && target) {
    // Although replacement does work, it's not a good idea to replace after all.
    const furi = furigana.value
      .replace(/[ｎn]$/g, 'ん')
      .replace(/[Ｎn]$/g, 'ん')

    let parts = data.split(/([\p{N}\p{sc=Han}]+)/gu)

    if (parts.length > 1) {
      const regex = new RegExp(
        '^' +
          parts
            .map((p, idx) =>
              [
                '(',
                idx & 1
                  ? '.+'
                  : Array.from(p)
                      .map((c) =>
                        isKana(c) ? `[${toKatakana(c)}${toHiragana(c)}]` : c,
                      )
                      .join(''),
                ')',
              ].join(''),
            )
            .join('') +
          '$',
      )
      let rt = furi.match(regex) || []
      if (!rt.length) {
        parts = [data]
        rt = ['', furi]
      }
      rt.shift()

      const { selectionStart } = target
      let from = (selectionStart || 0) - data.length
      if (from < 0) {
        from = 0
      }
      let to = from + data.length

      target.setRangeText(
        parts
          .map((p, idx) => (idx & 1 ? renderMode.value.fn(p, rt[idx]) : p))
          .join(''),
        from,
        to,
        'end',
      )
    }
  }
}
</script>

<template>
  <div :style="{ display: 'flex', 'flex-direction': 'column' }">
    <details v-if="!mini" class="options-collapse">
      <summary>
        <b> {{ 'Mode: ' }} </b>
        <span> {{ renderMode.name }} </span>
        <span> {{ ' (' }} </span>
        <span lang="ja"> {{ furiganaSample(renderMode) }} </span>
        <span> {{ ')' }} </span>
      </summary>

      <section v-for="[cat, val] in Object.entries(modes)" :key="cat">
        <h3>{{ cat }}</h3>
        <div class="field" v-for="[k, v] in Object.entries(val)" :key="k">
          <input
            :id="k"
            type="radio"
            name="IMEFuriganaSelect"
            :checked="renderMode.name === v.name"
            @change="renderMode = v"
          />
          <label :for="k">
            <span v-if="k === 'anki'">
              <a
                href="https://apps.ankiweb.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ 'Anki' }}
              </a>
              <span> {{ "'s " }} </span>
              <a
                href="https://ankiweb.net/shared/info/3918629684"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ 'Japanese support' }}
              </a>
            </span>
            <span v-else-if="k === 'furiganaMarkdownIt'">
              <a
                href="https://github.com/iltrof/furigana-markdown-it"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ v.name }}
              </a>
            </span>
            <span v-else-if="k === 'furiganaMarkdownIt'">
              <a
                href="https://github.com/iltrof/furigana-markdown-it"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ v.name }}
              </a>
            </span>
            <span
              v-else-if="k === 'imeToFurigana' || k === 'imeToFuriganaSpoiler'"
            >
              <a
                href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ v.name }}
              </a>
            </span>

            <span v-else> {{ v.name }} </span>

            <span> {{ ' (' }} </span>
            <span lang="ja"> {{ furiganaSample(v) }} </span>
            <span> {{ ')' }} </span>
          </label>
        </div>
      </section>
    </details>
    <input
      v-if="mini"
      type="text"
      :ref="(el) => (elTextArea = el)"
      lang="ja"
      v-model="raw"
      :placeholder="placeholder"
      @compositionupdate="onTextAreaUpdate"
      @compositionend="addFurigana"
    />
    <textarea
      v-else
      :ref="(el) => (elTextArea = el)"
      lang="ja"
      v-model="raw"
      :placeholder="placeholder"
      @compositionupdate="onTextAreaUpdate"
      @compositionend="addFurigana"
    />

    <nav v-if="!mini">
      <div class="flex-grow"></div>
      <select v-model="writingMode">
        <option value="horizontal-tb" lang="ja">Horizontal</option>
        <option value="vertical-rl" lang="ja">
          Standard vertical (縦書き)
        </option>
        <option value="vertical-lr" lang="ja">Vertical Left-to-right</option>
      </select>
    </nav>

    <div
      :class="{ output: true, mini }"
      :style="{ writingMode }"
      v-html="html"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.options-collapse {
  margin-bottom: 1em;

  summary {
    font-size: 18px;
    cursor: pointer;
  }

  section {
    margin-bottom: 1em;
  }
}

textarea {
  height: 300px;
}

.output {
  margin-top: 1em;
}

.output.mini {
  height: 60px;
}

nav {
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;

  * + & {
    margin-top: 1em;
  }
}
</style>
