<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { toKana } from 'wanakana'

const props = defineProps<{
  mini?: boolean
}>()

const elTextArea = ref<HTMLTextAreaElement>()

onMounted(() => {
  if (!props.mini) {
    elTextArea.value?.focus?.()
  }
})

function makeKanaFromInput(ev: Event) {
  const { target } = ev
  // @ts-ignore
  const { inputType } = ev as {
    inputType: 'insertFromPaste' | 'insertText' | 'deleteContentBackward'
  }

  if (target instanceof HTMLTextAreaElement) {
    if (!inputType.startsWith('insert')) return

    const kana = toKana(target.value, {
      IMEMode: inputType !== 'insertFromPaste',
      useObsoleteKana: true,
    })
    if (target.value.replace(/[a-z]+/gi, '') !== kana.replace(/[a-z]+/gi, '')) {
      let { selectionEnd } = target
      if (selectionEnd < target.value.length) {
        selectionEnd = kana.length - (target.value.length - selectionEnd)
      } else {
        selectionEnd = kana.length
      }

      target.value = kana
      target.setSelectionRange(selectionEnd, selectionEnd)
    }
  }
}
</script>

<template>
  <div :style="{ display: 'flex', 'flex-direction': 'column' }">
    <textarea
      :ref="(el) => (elTextArea = el as HTMLTextAreaElement)"
      lang="ja"
      placeholder="English alphabets will conveniently converted to Kana. (Hiragana for lowercase, Katakana for uppercase.)"
      @input="makeKanaFromInput"
      :style="{ height: mini ? '200px' : '300px' }"
    />
  </div>
</template>
