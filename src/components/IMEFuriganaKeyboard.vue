<script lang="ts" setup>
import { ref } from 'vue'

import { toHiragana, toKatakana, isKana } from 'wanakana'

import { FuriganaMode, mode as defaultMode } from '@/shared/furigana'

const props = defineProps<{
  mode?: FuriganaMode
  height?: string
}>()

const furigana = ref('')

function onTextAreaUpdate({ data }: { data: string }) {
  if (/^[\p{sc=Katakana}\p{sc=Hiragana}]+$/u.test(data)) {
    furigana.value = data
  }
}

function addFurigana(ev: Event) {
  const { target } = ev
  const { data } = ev as unknown as {
    data: string
  }

  if (
    typeof data === 'string' &&
    data.trim() &&
    target instanceof HTMLTextAreaElement
  ) {
    let output = furigana.value
    if (!output) return

    // Although replacement does work, it's not a good idea to replace after all.
    output = output.replace(/[ｎn]$/g, 'ん')
    // output = output.replace(/[ＮN]$/g, 'ン')

    const mode = props.mode || defaultMode.value

    const rubyFunc = mode.fn
    if (rubyFunc) {
      output =
        (() => {
          let parts = data.split(/([\p{N}\p{sc=Han}]+)/gu)
          if (parts.length === 1) return
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
          let rt = output.match(regex) || []
          if (!rt.length) {
            parts = [data]
            rt = ['', output]
          }
          rt.shift()

          return parts
            .map((p, idx) => (idx & 1 ? rubyFunc(p, rt[idx]) : p))
            .join('')
        })() || output
    }

    let markup = `${data}\t${output}`
    switch (mode.key) {
      case 'space':
        markup = `${data} ${output}`
    }

    target.setRangeText(
      markup,
      target.selectionStart - data.length,
      target.selectionStart,
      'end'
    )
  }
}
</script>

<template>
  <textarea
    lang="ja"
    placeholder="Any Japanese typed with an IME here will retain its Furigana..."
    @compositionupdate="onTextAreaUpdate"
    @compositionend="addFurigana"
    :style="{ height: height || '300px' }"
  ></textarea>
</template>

<style lang="scss" scoped>
textarea {
  width: 100%;
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
  padding: 0.5em;
}
</style>
