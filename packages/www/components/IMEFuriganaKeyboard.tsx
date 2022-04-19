import MarkdownItFurigana from 'furigana-markdown-it'
import MarkdownIt from 'markdown-it'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isKana, toHiragana, toKatakana } from 'wanakana'

export type MakeRubyFunc = (base: string, furi: string) => string

export interface FuriganaMode {
  key: string
  name: string
  fn: MakeRubyFunc
}

export type HTMLMode = 'simple' | 'full'
export type MarkdownMode = 'anki' | 'furiganaMarkdownIt' | 'imeToFurigana'

const IMEFuriganaKeyboard = (props: { mini?: boolean }) => {
  const htmlModes: {
    [key in HTMLMode]: FuriganaMode
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

  const markdownIt = MarkdownIt().use(MarkdownItFurigana())

  const markdownModes: {
    [key in MarkdownMode]: FuriganaMode & {
      html(s: string): string
    }
  } = {
    anki: {
      key: '',
      name: 'Anki Japanese Support',
      fn: useCallback((base, ruby) => ` ${base}[${ruby}]`, []),
      html: useCallback(
        (s) => {
          return s.replace(/ ([^ ]+)?\[(.+?)\]/g, (_, base, ruby) => {
            return htmlModes.full.fn(base, ruby)
          })
        },
        [htmlModes]
      )
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

  const modes = {
    Markdown: markdownModes,
    HTML: htmlModes
  }

  const placeholder =
    'Any Japanese typed with an IME here will retain its Furigana...'

  const [raw, setRaw] = useState('')
  const [html, setHTML] = useState('')

  const [furigana, setFurigana] = useState('')
  const elTextArea = useRef<HTMLTextAreaElement | HTMLInputElement>()
  const [renderMode, setRenderMode] = useState<MarkdownMode>('anki')
  const writingMode = useState('horizontal-tb')

  useEffect(() => {
    if (!props.mini) {
      elTextArea.current?.focus?.()
    }
    renderHTML()
  })

  useEffect(() => {
    console.log(markdownModes[renderMode.value.key])
    if (markdownModes[renderMode.value.key]) {
      markdownMode.value = renderMode.value
    } else {
      htmlMode.value = renderMode.value
    }

    elTextArea.value?.focus?.()
    renderHTML()
  }, [renderMode, markdownModes, renderHTML])

  watch(raw, () => {
    renderHTML()
  })

  const renderHTML = useCallback(() => {
    const md = markdownModes[renderMode.key]
    html.value = md ? md.html(raw.value) : raw.value
  }, [markdownModes])
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
              .map(
                (p, idx) =>
                  '(' +
                  (idx & 1
                    ? '.+'
                    : Array.from(p)
                        .map((c) =>
                          isKana(c) ? `[${toKatakana(c)}${toHiragana(c)}]` : c
                        )
                        .join('')) +
                  ')'
              )
              .join('') +
            '$'
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
          'end'
        )
      }
    }
  }

  return null
}

export default IMEFuriganaKeyboard
