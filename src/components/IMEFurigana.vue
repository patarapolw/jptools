<script lang="ts" setup>
import { ref } from 'vue'
import IMEFuriganaSelect, { MakeRubyFunc } from './IMEFuriganaSelect.vue'

const furiFuncs: {
  [cat: string]: {
    [key: string]: MakeRubyFunc | null
  }
} = {
  'Plain Text': {
    tab: null,
    space: null
  },
  Markdown: {
    anki: (base, ruby) => ` ${base}[{${ruby}]`,
    furiganaMarkdownIt: (base, ruby) => `[${base}]{${ruby}}`,
    imeToFurigana: (base, ruby) => `<${base}>[${ruby}]`,
    imeToFuriganaSpoiler: (base, ruby) => `<${base}>{${ruby}}`
  },
  HTML: {
    htmlSimple: (base, ruby) => `<ruby>${base}<rt>${ruby}</rt></ruby>`,
    htmlFallback: (base, ruby) =>
      `<ruby><rp> </rp>${base}<rp>(</rp><rt>${ruby}</rt><rp>)</rp></ruby>`
  }
}

const furiType = ref('tab')
const furiFunc = ref<MakeRubyFunc | null>(furiFuncs['Plain Text'].tab)
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

  const rubyFunc = furiFunc.value
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
    markup = [
      markup,
      parts.map((p, idx) => (idx & 1 ? rubyFunc(p, rt[idx]) : p)).join('')
    ].join(' ')
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
    <IMEFuriganaSelect
      :values="furiFuncs"
      :select="furiType"
      @change="(fn) => furiFunc = fn"
    >
      <template v-slot:tab>
        <span>{{ 'Tab-separated, for pasting into Excel or similar.' }}</span>
        <span>{{' ('}}</span>
        <span lang="ja">{{'漢字\tふり'}}</span>
        <span>{{')'}}</span>
      </template>
      <template v-slot:space>
        <span>{{ 'Space-separated. Similar to above, but with space.' }}</span>
        <span>{{' ('}}</span>
        <span lang="ja">{{'漢字 ふり'}}</span>
        <span>{{')'}}</span>
      </template>
      <template v-slot:anki="{ sample }">
        <span lang="ja">{{ sample }}</span>
        <span>{{' ('}}</span>
        <a
          href="https://apps.ankiweb.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{'Anki'}}
        </a>
        <span> {{"'s "}} </span>
        <a
          href="https://ankiweb.net/shared/info/3918629684"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{'Japanese support'}}
        </a>
        <span>
          {{'. Text is already formatted without plugin installed, however.'}}
        </span>
        <span>{{')'}}</span>
      </template>
      <template v-slot:furiganaMarkdownIt="{ sample }">
        <span lang="ja">{{ sample }}</span>
        <span>{{' ('}}</span>
        <a
          href="https://github.com/iltrof/furigana-markdown-it"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{'furigana-markdown-it'}}
        </a>
        <span>{{')'}}</span>
      </template>
      <template v-slot:imeToFurigana="{ sample }">
        <span lang="ja">{{ sample }}</span>
        <span>{{' ('}}</span>
        <a
          href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{'IME2Furigana'}}
        </a>
        <span>{{')'}}</span>
      </template>
      <template v-slot:imeToFuriganaSpoiler="{ sample }">
        <span lang="ja">{{ sample }}</span>
        <span>{{' ('}}</span>
        <a
          href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{'IME2Furigana spoiler'}}
        </a>
        <span>{{')'}}</span>
      </template>
      <template v-slot:htmlSimple="{ sample }">
        <span>{{ 'Simple HTML' }}</span>
        <span>{{' ('}}</span>
        <span lang="ja">{{ sample }}</span>
        <span>{{')'}}</span>
      </template>
      <template v-slot:htmlFallback="{ sample }">
        <span>{{ 'HTML with fallback' }}</span>
        <span>{{' ('}}</span>
        <span lang="ja">{{ sample }}</span>
        <span>{{')'}}</span>
      </template>
    </IMEFuriganaSelect>
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
  padding: 0.5em;
}
</style>
