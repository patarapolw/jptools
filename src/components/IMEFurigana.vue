<script lang="ts" setup>
import { ref } from 'vue'
import RadioSelect from './RadioSelect.vue'

type MakeRubyFunc = (base: string, furi: string) => string

const furiFuncs: Record<string, MakeRubyFunc | null> = {
  tab: null,
  space: null,
  furiganaMarkdownIt: (base, ruby) => `[${base}]{${ruby}}`,
  IME2Furigana: (base, ruby) => `<${base}>[${ruby}]`,
  IME2FuriganaSpoiler: (base, ruby) => `<${base}>{${ruby}}`
}

const furiType = ref<keyof typeof furiFuncs>('tab')
const furigana = ref('')

function onTextAreaUpdate({ data }: { data: string }) {
  if (/^[\p{sc=Katakana}\p{sc=Hiragana}]+$/u.test(data)) {
    furigana.value = data
  }
}

function addFurigana({
  data,
  target
}: {
  data: string
  target: HTMLTextAreaElement
}) {
  let furi = furigana.value.replace(/ｎ/g, 'ん')
  let markup = `${data}\t${furi}`

  const rubyFunc = furiFuncs[furiType.value]
  if (rubyFunc) {
    let parts = data.split(/(\p{sc=Han}+)/gu)
    if (parts.length === 1) return
    let hiraganaParts = parts.map((p) => Array.from(p).join(''))
    let regex = new RegExp(
      '^' +
        hiraganaParts
          .map((p, idx) => '(' + (idx & 1 ? '.+' : p) + ')')
          .join('') +
        '$'
    )
    let rt = furi.match(regex) || []
    if (!rt.length) {
      parts = [data]
      rt = ['', furi]
    }
    rt.shift()
    markup = parts
      .map((p, idx) => (idx & 1 ? rubyFunc(p, rt[idx]) : p))
      .join('')
  } else {
    switch (furiType.value) {
      case 'space':
        markup = `${data} ${furi}`
    }
  }

  target.setRangeText(
    markup,
    target.selectionStart - data.length,
    target.selectionStart,
    'end'
  )
}
</script>

<template>
  <section>
    <RadioSelect
      :values="furiFuncs"
      :select="furiType"
      @change="(k) => furiType = k"
    >
      <template v-slot:tab>
        Tab-separated (<span lang="ja">漢字{{'\t'}}ふり</span>)
      </template>
      <template v-slot:space>
        Space-separated (<span lang="ja">漢字 ふり</span>, similar to above, but
        with space)
      </template>
      <template v-slot:furiganaMarkdownIt>
        <span lang="ja">[漢字]{ふり}</span> (
        <span class="close-margin">
          <a
            href="https://github.com/iltrof/furigana-markdown-it"
            target="_blank"
            rel="noopener noreferrer"
            >furigana-markdown-it</a
          >
        </span>
        )
      </template>
      <template v-slot:IME2Furigana>
        <span lang="ja">&lt;漢字&gt;[ふり]</span> (
        <span class="close-margin">
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
            >IME2Furigana</a
          >
        </span>
        )
      </template>
      <template v-slot:IME2FuriganaSpoiler>
        <span lang="ja">&lt;漢字&gt;{ふり}</span> (
        <span class="close-margin">
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
            >IME2Furigana spoiler</a
          >
        </span>
        )
      </template>
    </RadioSelect>
    <textarea
      lang="ja"
      placeholder="Any Japanese typed with an IME here will retain its Furigana..."
      @compositionupdate="onTextAreaUpdate"
      @compositionend="(addFurigana as any)"
    ></textarea>
  </section>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 300px;
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
}
</style>
