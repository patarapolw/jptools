<script lang="ts" setup>
import { ref } from 'vue'
import RadioSelect from './RadioSelect.vue'

const furiTypes = {
  tab: 'Tab-separated',
  space: 'Space-separated',
  furiganaMarkdownIt: 'furigana-markdown-it',
  IME2Furigana: 'IME2Furigana',
  IME2FuriganaSpoiler: 'IME2Furigana spoiler'
}

const furiType = ref<keyof typeof furiTypes>('tab')
const furigana = ref('')
</script>

<template>
  <section>
    <RadioSelect
      :values="furiTypes"
      :select="furiType"
      @change="(k) => furiType = k"
    >
      <template v-slot:tab>
        Tab-separated (<span lang="ja">漢字{{'\t'}}ふり</span>)
      </template>
      <template v-slot:space>
        Space-separated (<span lang="ja">漢字 ふり</span>, similar to above, but
        with space)
      </template>
      <template v-slot:furiganaMarkdownIt>
        <span lang="ja">[漢字]{ふり}</span> (
        <span class="close-margin">
          <a
            href="https://github.com/iltrof/furigana-markdown-it"
            target="_blank"
            rel="noopener noreferrer"
            >furigana-markdown-it</a
          >
        </span>
        )
      </template>
      <template v-slot:IME2Furigana>
        <span lang="ja">&lt;漢字&gt;[ふり]</span> (
        <span class="close-margin">
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
            >IME2Furigana</a
          >
        </span>
        )
      </template>
      <template v-slot:IME2FuriganaSpoiler>
        <span lang="ja">&lt;漢字&gt;{ふり}</span> (
        <span class="close-margin">
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
            >IME2Furigana spoiler</a
          >
        </span>
        )
      </template>
    </RadioSelect>
    <textarea lang="ja"></textarea>
  </section>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 300px;
  border-radius: 6px;
  border: 1px solid lightgray;
  font-size: 18px;
}
</style>
