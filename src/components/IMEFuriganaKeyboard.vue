<script lang="ts" setup>
import { ref } from 'vue'

import { FuriganaMode } from '@/shared/furigana'

const props = defineProps<{
  mode: FuriganaMode
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
    let furi = furigana.value
    if (!furi) return

    // Although replacement does work, it's not a good idea to replace after all.
    furi = furi.replace(/[ｎn]$/g, 'ん')
    // furi = furi.replace(/[ＮN]$/g, 'ン')

    let markup = `${data}\t${furi}`

    const rubyFunc = props.mode.fn
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
      switch (props.mode.key) {
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
