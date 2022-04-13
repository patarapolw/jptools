<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { toKana } from 'wanakana'

const props = defineProps<{
  mini?: boolean
}>()

const currentText = ref('')
const elTextArea = ref<HTMLTextAreaElement>()

onMounted(() => {
  if (!props.mini) {
    elTextArea.value?.focus?.()
  }
})

function makeKanaFromInput(ev: Event) {
  const { target } = ev
  // @ts-ignore
  const { inputType } = ev

  if (target instanceof HTMLTextAreaElement) {
    currentText.value = toKana(target.value, {
      IMEMode: inputType !== 'insertFromPaste',
      useObsoleteKana: true
    })
  }
}
</script>

<template>
  <div :style="{ display: 'flex', 'flex-direction': 'column' }">
    <textarea
      :ref="(el) => elTextArea = el"
      lang="ja"
      placeholder="English alphabets will conveniently converted to Kana. (Hiragana for lowercase, Katakana for uppercase.)"
      :value="currentText"
      @input="makeKanaFromInput"
      :style="{ height: mini ? '200px' : '300px' }"
    />
  </div>
</template>
