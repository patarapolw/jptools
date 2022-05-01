import furigana from '@patarapolw/furigana-markdown-it'
import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'
import { ref, watch } from 'vue'

export type MakeRubyFunc = (base: string, furi: string) => string

export interface FuriganaMode {
  key: string
  name: string
  fn: MakeRubyFunc
}

const markdownIt = MarkdownIt({
  html: true,
}).use(furigana())

function md2html(md: string) {
  return DOMPurify.sanitize(
    markdownIt.render(
      md.replace(/<([^>]+)>\[([^\]]+?)\]/g, (_, base, ruby) => {
        return htmlModes.full.fn(base, ruby)
      }),
    ),
  )
}

export const markdownModes: {
  [key: string]: FuriganaMode & {
    html(s: string): string
  }
} = {
  anki: {
    key: '',
    name: 'Anki Japanese Support',
    fn: (base, ruby) => ` ${base}[${ruby}]`,
    html(s) {
      // Anki mode does not render Markdown, but HTML with additional syntaxes
      return s.replace(/ ([^ ]+)?\[(.+?)\]/g, (_, base, ruby) => {
        return htmlModes.full.fn(base, ruby)
      })
    },
  },
  furiganaMarkdownIt: {
    key: '',
    name: 'furigana-markdown-it',
    fn: (base, ruby) => `[${base}]{${ruby}}`,
    html: md2html,
  },
  imeToFurigana: {
    key: '',
    name: 'IME2Furigana',
    fn: (base, ruby) => `<${base}>[${ruby}]`,
    html: md2html,
  },
}

const MARKDOWN_MODE_KEY = 'MARKDOWN_MODE'
const markdownModeName =
  localStorage.getItem(MARKDOWN_MODE_KEY) || Object.keys(markdownModes)[0]

export const markdownMode = ref<FuriganaMode>({} as FuriganaMode)

Object.entries(markdownModes).map(([key, v]) => {
  v.key = key
  if (key === markdownModeName) {
    markdownMode.value = v
  }
})

watch(markdownMode, () => {
  localStorage.setItem(MARKDOWN_MODE_KEY, markdownMode.value.key)
})

export const htmlModes: {
  [key: string]: FuriganaMode
} = {
  simple: {
    key: '',
    name: 'Simple HTML',
    fn: (base, ruby) => `<ruby>${base}<rt>${ruby}</rt></ruby>`,
  },
  full: {
    key: '',
    name: 'HTML with fallback',
    fn: (base, ruby) =>
      `<ruby><rp> </rp>${base}<rp>【</rp><rt>${ruby}</rt><rp>】</rp></ruby>`,
  },
}

const HTML_MODE_KEY = 'HTML_MODE'
const htmlModeName =
  localStorage.getItem(HTML_MODE_KEY) || Object.keys(htmlModes)[0]

export const htmlMode = ref<FuriganaMode>({} as FuriganaMode)

Object.entries(htmlModes).map(([key, v]) => {
  v.key = key
  if (key === htmlModeName) {
    htmlMode.value = v
  }
})

export function furiganaSample(m: FuriganaMode) {
  return m.fn('漢字', 'ふり')
}

export function isKana(c: string) {
  if (/[ヵヶ]/.test(c)) return false

  return /^[\p{sc=Katakana}\p{sc=Hiragana}]+$/u.test(c)
}
