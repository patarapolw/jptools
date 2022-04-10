<script lang="ts" setup>
import { ref } from 'vue'
import RadioSelect from './RadioSelect.vue'

const furiType = ref()
const furigana = ref('')
</script>

<template>
  <section>
    <RadioSelect :values="['Tab-separated', 'Space-separated', 'furigana-markdown-it', 'IME2Furigana']"
      @change="(v) => furiType = v">
      <template v-slot:furigana-markdown-it>
        <span lang="ja">[漢字]{ふり}</span> (
        <span class="close-margin">
          <a href="https://github.com/iltrof/furigana-markdown-it" target="_blank"
            rel="noopener noreferrer">furigana-markdown-it</a>
        </span> )
      </template>
      <template v-slot:IME2Furigana>
        <span lang="ja">&lt;漢字&gt;[ふり]</span> (
        <span class="close-margin">
          <a href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109" target="_blank"
            rel="noopener noreferrer">IME2Furigana</a>
        </span> )
      </template>
    </RadioSelect>
    <textarea lang="ja"></textarea>
    </section>
</template>

<style scoped>textarea {
  width: 100%;
  height: 300px;
  border-radius: 5px;
  border: 1px solid lightgray;
  font-size: 18px;
}</style>
