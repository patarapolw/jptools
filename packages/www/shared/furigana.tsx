import furigana from 'furigana-markdown-it'
import MarkdownIt from 'markdown-it'

export type MakeRubyFunc = (base: string, furi: string) => string

export interface FuriganaMode {
  key: string
  name: string
  fn: MakeRubyFunc
}

const markdownIt = MarkdownIt().use(furigana())

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
      return s.replace(/ ([^ ]+)?\[(.+?)\]/g, (_, base, ruby) => {
        return htmlModes.full.fn(base, ruby)
      })
    }
  },
  furiganaMarkdownIt: {
    key: '',
    name: 'furigana-markdown-it',
    fn: (base, ruby) => `[${base}]{${ruby}}`,
    html(s) {
      return markdownIt.render(s)
    }
  },
  imeToFurigana: {
    key: '',
    name: 'IME2Furigana',
    fn: (base, ruby) => `<${base}>[${ruby}]`,
    html(s) {
      return markdownIt.render(
        s.replace(/<(.+?)>\[(.+?)\]/g, (_, base, ruby) => {
          return htmlModes.full.fn(base, ruby)
        })
      )
    }
  }
}

const MARKDOWN_MODE_KEY = 'MARKDOWN_MODE'
const markdownModeName =
  localStorage.getItem(MARKDOWN_MODE_KEY) || Object.keys(markdownModes)[0]

export interface FuriganaState {
  mode: {
    markdown: FuriganaMode
    html: FuriganaMode
  }
}

export interface FuriganaAction {
  type: keyof FuriganaState['mode']
  payload: FuriganaMode
}

export const furiganaReducer = (
  state: FuriganaState,
  action: FuriganaAction
) => {
  return {
    ...state,
    mode: {
      ...state.mode,
      [action.type]: action.payload
    }
  }
}

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
    fn: (base, ruby) => `<ruby>${base}<rt>${ruby}</rt></ruby>`
  },
  full: {
    key: '',
    name: 'HTML with fallback',
    fn: (base, ruby) =>
      `<ruby><rp> </rp>${base}<rp>【</rp><rt>${ruby}</rt><rp>】</rp></ruby>`
  }
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
