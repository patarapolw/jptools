<script lang="ts" setup>
import { ref } from 'vue'
import IMEFuriganaSelect, { FuriganaOption } from './IMEFuriganaSelect.vue'

const furiFuncs: {
  [cat: string]: {
    [key: string]: FuriganaOption
  }
} = {
  'Plain Text': {
    tab: {
      name: 'Tab-separated'
    },
    space: {
      name: 'Space-separated'
    }
  },
  Markdown: {
    anki: {
      name: 'Anki Japanese Support',
      fn: (base, ruby) => ` ${base}[{${ruby}]`
    },
    furiganaMarkdownIt: {
      name: 'furigana-markdown-it',
      fn: (base, ruby) => `[${base}]{${ruby}}`
    },
    imeToFurigana: {
      name: 'IME2Furigana',
      fn: (base, ruby) => `<${base}>[${ruby}]`
    },
    imeToFuriganaSpoiler: {
      name: 'IME2Furigana spoiler',
      fn: (base, ruby) => `<${base}>{${ruby}}`
    }
  },
  HTML: {
    htmlSimple: {
      name: 'Simple HTML',
      fn: (base, ruby) => `<ruby>${base}<rt>${ruby}</rt></ruby>`
    },
    htmlFallback: {
      name: 'HTML with fallback',
      fn: (base, ruby) =>
        `<ruby><rp> </rp>${base}<rp>(</rp><rt>${ruby}</rt><rp>)</rp></ruby>`
    }
  }
}

const currentFuri = ref<FuriganaOption>(furiFuncs['Plain Text'].tab)
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
  let furi = furigana.value
  // Although replacement does work, it's not a good idea to replace after all.
  furi = furi.replace(/[ｎn]$/g, 'ん')
  // furi = furi.replace(/[ＮN]$/g, 'ン')

  let markup = `${data}\t${furi}`

  const rubyFunc = currentFuri.value.fn
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
    switch (currentFuri.value.name) {
      case 'Space-separated':
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
    <details class="options-collapse">
      <summary>
        <b> {{ `Mode: ` }} </b>
        <span> {{ currentFuri.name }} </span>
      </summary>

      <IMEFuriganaSelect
        :values="furiFuncs"
        :select="currentFuri.name"
        @change="(v) => currentFuri = v"
      >
        <template v-slot:tab="{ title }">
          <span> {{ `${title}. For pasting into Excel or similar.` }} </span>
          <span>{{' ('}}</span>
          <span lang="ja">{{'漢字\tふり'}}</span>
          <span>{{')'}}</span>
        </template>
        <template v-slot:space="{ title }">
          <span> {{ `${title}. Similar to above, but with space.` }} </span>
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
        <template v-slot:furiganaMarkdownIt="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://github.com/iltrof/furigana-markdown-it"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
        <template v-slot:imeToFurigana="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
        <template v-slot:imeToFuriganaSpoiler="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
      </IMEFuriganaSelect>
    </details>

    <textarea
      lang="ja"
      placeholder="Any Japanese typed with an IME here will retain its Furigana..."
      @compositionupdate="onTextAreaUpdate"
      @compositionend="(addFurigana as any)"
    ></textarea>
  </section>
</template>

<style lang="scss" scoped>
textarea {
  width: 100%;
  height: 300px;
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
  padding: 0.5em;
}

.options-collapse {
  margin-bottom: 1em;

  summary {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
