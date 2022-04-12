<script lang="ts" setup>
import {
  FuriganaMode,
  furiganaSample,
  htmlMode,
  htmlModes,
  markdownMode,
  markdownModes
} from '@/shared/furigana'
import { ref, watch } from 'vue'

const props = defineProps<{
  mode: FuriganaMode
}>()

const name = 'IMEFuriganaSelect'
const modes = {
  Markdown: markdownModes,
  HTML: htmlModes
}

const currentMode = ref<FuriganaMode>(props.mode)

watch(currentMode, () => {
  if (markdownModes[currentMode.value.key]) {
    markdownMode.value = currentMode.value
  } else {
    htmlMode.value = currentMode.value
  }
})
</script>

<template>
  <details class="options-collapse">
    <summary>
      <b> {{ 'Mode: ' }} </b>
      <span> {{ currentMode.name }} </span>
      <span> {{ ' (' }} </span>
      <span lang="ja"> {{ furiganaSample(currentMode) }} </span>
      <span> {{ ')' }} </span>
    </summary>

    <nav v-for="[cat, val] in Object.entries(modes)" :key="cat">
      <h3>{{ cat }}</h3>
      <div class="field" v-for="[k, v] in Object.entries(val)" :key="k">
        <input
          :id="k"
          type="radio"
          :name="name"
          :checked="mode.name === v.name"
          @change="currentMode = v"
        />
        <label :for="k">
          <span v-if="k === 'anki'">
            <a
              href="https://apps.ankiweb.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ 'Anki' }}
            </a>
            <span> {{ "'s " }} </span>
            <a
              href="https://ankiweb.net/shared/info/3918629684"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ 'Japanese support' }}
            </a>
          </span>
          <span v-else-if="k === 'furiganaMarkdownIt'">
            <a
              href="https://github.com/iltrof/furigana-markdown-it"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ v.name }}
            </a>
          </span>
          <span v-else-if="k === 'furiganaMarkdownIt'">
            <a
              href="https://github.com/iltrof/furigana-markdown-it"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ v.name }}
            </a>
          </span>
          <span
            v-else-if="k === 'imeToFurigana' || k === 'imeToFuriganaSpoiler'"
          >
            <a
              href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ v.name }}
            </a>
          </span>

          <span v-else> {{ v.name }} </span>

          <span> {{ ' (' }} </span>
          <span lang="ja"> {{ furiganaSample(v) }} </span>
          <span> {{ ')' }} </span>
        </label>
      </div>
    </nav>
  </details>
</template>

<style lang="scss" scoped>
.options-collapse {
  margin-bottom: 1em;

  summary {
    font-size: 18px;
    cursor: pointer;
  }
}

nav {
  margin-bottom: 1em;
}
</style>
