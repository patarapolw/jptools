<script lang="ts" setup>
import { md2html } from '@/shared/furigana'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  mini?: boolean
}>()

const placeholder = 'Any custom Markdown with converted to standard Markdown'

const raw = ref('')
const html = ref('')

const elTextArea = ref<HTMLTextAreaElement>()

onMounted(() => {
  if (!props.mini) {
    elTextArea.value?.focus?.()
  }
  renderHTML()
})

watch(raw, () => {
  renderHTML()
})

function matchFurigana(body: string, toptext: string) {
  function makeRuby(p1: string, p2: string) {
    if (!p2) {
      result += p1
      return p1
    }

    const seg = `<${p1}>{${p2}}`
    result += seg
    return seg
  }

  const kanaRegex = /[\u3040-\u3096\u30a1-\u30fa\uff66-\uff9fー]/
  const kanjiRegex = /[\u3400-\u9fafカヶ々〆0-9０-９]/

  function bodyToRegex(body: string) {
    let regexStr = '^'
    let lastType = 'other'

    const combinatorOrSeparatorGroup = '([+.]?)'
    const combinatorOrSeparator = '[+.]?'
    const combinatorOnly = '\\.?'
    const furiganaGroup = '([^+.]+)'

    for (let i = 0; i < body.length; i++) {
      const c = body.charAt(i)
      if (kanjiRegex.test(c)) {
        if (lastType === 'kanji') {
          regexStr += combinatorOrSeparatorGroup
        } else if (lastType === 'kana') {
          regexStr += combinatorOrSeparator
        }

        regexStr += furiganaGroup
        lastType = 'kanji'
      } else if (kanaRegex.test(c)) {
        if (lastType == 'kanji') {
          regexStr += combinatorOrSeparator
        }
        regexStr += c
        lastType = 'kana'
      } else {
        if (lastType !== 'other') {
          regexStr += combinatorOnly
        }
        lastType = 'other'
      }
    }

    if (regexStr === '') {
      return null
    }
    return new RegExp(regexStr + '$')
  }

  let result = ''

  if (/^[=＝]/.test(toptext)) {
    return makeRuby(body, toptext.slice(1))
  }

  const bodyRegex = bodyToRegex(body)
  if (bodyRegex === null) {
    return makeRuby(body, toptext)
  }

  const match = bodyRegex.exec(toptext)
  if (match === null) {
    return makeRuby(body, toptext)
  }

  let curBodyPart = ''
  let curToptextPart = ''
  let matchIndex = 1
  let lastType = 'other'
  for (let i = 0; i < body.length; i++) {
    const c = body.charAt(i)

    if (kanjiRegex.test(c)) {
      if (lastType === 'kana' || lastType === 'other') {
        if (curBodyPart !== '') {
          makeRuby(curBodyPart, curToptextPart)
        }
        curBodyPart = c
        curToptextPart = match[matchIndex++]
        lastType = 'kanji'
        continue
      }

      const connection = match[matchIndex++]
      if (connection === '+' || connection === '') {
        curBodyPart += c
        curToptextPart += match[matchIndex++]
      } else {
        makeRuby(curBodyPart, curToptextPart)
        curBodyPart = c
        curToptextPart = match[matchIndex++]
      }
    } else {
      if (lastType !== 'kanji') {
        curBodyPart += c
        continue
      }

      makeRuby(curBodyPart, curToptextPart)
      curBodyPart = c
      curToptextPart = ''

      if (kanaRegex.test(c)) {
        lastType = 'kana'
      } else {
        lastType = 'other'
      }
    }
  }

  makeRuby(curBodyPart, curToptextPart)
  return result
}

function renderHTML() {
  html.value = raw.value.replace(
    /\[([^\[\]]+?)\]\{([^\{\}]+?)\}/g,
    (...m: string[]) => {
      return matchFurigana(m[1], m[2])
    },
  )
}
</script>

<template>
  <div :style="{ display: 'flex', 'flex-direction': 'column' }">
    <textarea
      :ref="(el) => (elTextArea = el as HTMLTextAreaElement)"
      lang="ja"
      v-model="raw"
      :placeholder="placeholder"
    />

    <pre class="output" v-text="html"></pre>
    <div class="output" v-html="md2html(html)"></div>
  </div>
</template>

<style lang="scss" scoped>
textarea {
  height: 300px;
}

.output {
  margin-top: 1em;
  max-height: 300px;
  overflow: auto;
}
</style>
