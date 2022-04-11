<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

import { toHiragana, toKatakana, isKana } from 'wanakana'

import { FuriganaMode, mode as defaultMode } from '@/shared/furigana'

const props = defineProps<{
  mode?: FuriganaMode
  height?: string
  autofocus?: boolean
}>()

const furigana = ref('')
const elTextArea = ref<HTMLTextAreaElement>()

onMounted(() => {
  if (props.autofocus) {
    elTextArea.value?.focus?.()
  }
})

watch(defaultMode, () => {
  elTextArea.value?.focus?.()
})

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
    furigana.value &&
    typeof data === 'string' &&
    data.trim() &&
    target instanceof HTMLTextAreaElement
  ) {
    // Although replacement does work, it's not a good idea to replace after all.
    const furi = furigana.value
      .replace(/[ｎn]$/g, 'ん')
      .replace(/[Ｎn]$/g, 'ん')
    const output = ['']
    if (furi !== data) {
      output.push(furi)
    }

    const mode = props.mode || defaultMode.value

    const rubyFunc = mode.fn
    if (rubyFunc) {
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

        output.push(
          parts.map((p, idx) => (idx & 1 ? rubyFunc(p, rt[idx]) : p)).join('')
        )
      }
    }

    if (output.length > 1) {
      let sep = '\t'
      switch (mode.key) {
        case 'space':
          sep = ' '
      }

      target.setRangeText(
        output.join(sep),
        target.selectionStart,
        target.selectionStart,
        'end'
      )
    }
  }
}
</script>

<template>
  <textarea
    :ref="(el) => elTextArea = el"
    lang="ja"
    placeholder="Any Japanese typed with an IME here will retain its Furigana..."
    @compositionupdate="onTextAreaUpdate"
    @compositionend="addFurigana"
    :style="{ height: height || '300px' }"
  ></textarea>
</template>

<style lang="scss" scoped>
textarea {
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
  padding: 0.5em;
}
</style>
