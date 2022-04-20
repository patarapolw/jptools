<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  mini?: boolean
}>()

const modes = {
  tab: '\t',
  space: ' ',
}

const MODE_KEY = 'READING_KEYBOARD_MODE'

const furigana = ref('')
const elTextArea = ref<HTMLTextAreaElement>()
const currentMode = ref<keyof typeof modes>('tab')

onMounted(() => {
  currentMode.value =
    (localStorage.getItem(MODE_KEY) as any) || currentMode.value

  window.addEventListener('storage', function (e) {
    if (e.key === MODE_KEY) {
      currentMode.value = e.newValue as any
    }
  })

  if (!props.mini) {
    elTextArea.value?.focus?.()
  }
})

watch(currentMode, () => {
  localStorage.setItem(MODE_KEY, currentMode.value)
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

    if (output.length > 1) {
      let sep = '\t'
      switch (currentMode.value) {
        case 'space':
          sep = ' '
      }

      target.setRangeText(
        output.join(sep),
        target.selectionStart,
        target.selectionStart,
        'end',
      )
    }
  }
}
</script>

<template>
  <div :style="{ display: 'flex', 'flex-direction': 'column' }">
    <nav v-if="!mini">
      <label> Mode: </label>
      <div class="field flex-grow">
        <input
          type="radio"
          name="ReadingKeyboardMode"
          id="ReadingKeyboardMode-tab"
          :checked="currentMode === 'tab'"
          @change="currentMode = 'tab'"
        />
        <label for="ReadingKeyboardMode-tab">
          Tab (more suitable for Excel)
        </label>
      </div>
      <div class="field flex-grow">
        <input
          type="radio"
          name="ReadingKeyboardMode"
          id="ReadingKeyboardMode-space"
          :checked="currentMode === 'space'"
          @change="currentMode = 'space'"
        />
        <label for="ReadingKeyboardMode-space"> Space </label>
      </div>
    </nav>
    <textarea
      :ref="(el) => (elTextArea = el)"
      lang="ja"
      placeholder="Any Japanese typed with an IME here will output its Furigana..."
      @compositionupdate="onTextAreaUpdate"
      @compositionend="addFurigana"
      :style="{ height: mini ? '200px' : '300px' }"
    />
  </div>
</template>

<style lang="scss" scoped>
nav {
  display: flex;
  flex-direction: row;
  margin-bottom: 1em;

  > label {
    width: 4em;
  }
}
</style>
