export type MakeRubyFunc = (base: string, furi: string) => string

export interface FuriganaMode {
  key: string
  name: string
  fn?: MakeRubyFunc
  sample?: string
}

export const furiganaModes: {
  [cat: string]: {
    [key: string]: FuriganaMode
  }
} = {
  'Plain Text': {
    tab: {
      key: '',
      name: 'Tab-separated',
      sample: '漢字\tふり'
    },
    space: {
      key: '',
      name: 'Space-separated',
      sample: '漢字 ふり'
    }
  },
  Markdown: {
    anki: {
      key: '',
      name: 'Anki Japanese Support',
      fn: (base, ruby) => ` ${base}[${ruby}]`
    },
    furiganaMarkdownIt: {
      key: '',
      name: 'furigana-markdown-it',
      fn: (base, ruby) => `[${base}]{${ruby}}`
    },
    imeToFurigana: {
      key: '',
      name: 'IME2Furigana',
      fn: (base, ruby) => `<${base}>[${ruby}]`
    },
    imeToFuriganaSpoiler: {
      key: '',
      name: 'IME2Furigana spoiler',
      fn: (base, ruby) => `<${base}>{${ruby}}`
    }
  },
  HTML: {
    htmlSimple: {
      key: '',
      name: 'Simple HTML',
      fn: (base, ruby) => `<ruby>${base}<rt>${ruby}</rt></ruby>`
    },
    htmlFallback: {
      key: '',
      name: 'HTML with fallback',
      fn: (base, ruby) =>
        `<ruby><rp> </rp>${base}<rp>(</rp><rt>${ruby}</rt><rp>)</rp></ruby>`
    }
  }
}

Object.values(furiganaModes).map((o) =>
  Object.entries(o).map(([key, v]) => {
    v.key = key
  })
)
