<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { toKana } from 'wanakana'

const props = defineProps<{
  height?: string
  autofocus?: boolean
}>()

const currentText = ref('')
const elTextArea = ref<HTMLTextAreaElement>()

onMounted(() => {
  if (props.autofocus) {
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
  <div class="KanaKeyboard">
    <textarea
      :ref="(el) => elTextArea = el"
      lang="ja"
      placeholder="English alphabets will conveniently converted to Kana. (Hiragana for lowercase, Katakana for uppercase.)"
      :value="currentText"
      @input="makeKanaFromInput"
      :style="{ height: height || '300px' }"
    ></textarea>
    <div class="output"></div>
  </div>
</template>

<style lang="scss" scoped>
.KanaKeyboard {
  display: flex;
  flex-direction: column;
}

textarea {
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
  padding: 0.5em;
}
</style>
