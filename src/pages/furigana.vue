<script setup lang="ts">
import { ref } from 'vue'

import { FuriganaMode, furiganaModes } from '@/shared/furigana'

import IMEFuriganaSelect from '@/components/IMEFuriganaSelect.vue'
import IMEFuriganaKeyboard from '@/components/IMEFuriganaKeyboard.vue'
import H from '@/components/H.vue'

const mode = ref<FuriganaMode>(furiganaModes['Plain Text'].tab)
</script>

<template>
  <section>
    <H :level="1">IME2Furigana</H>
    <details class="options-collapse">
      <summary>
        <b> {{ `Mode: ` }} </b>
        <span> {{ mode.name }} </span>
      </summary>

      <IMEFuriganaSelect
        :values="furiganaModes"
        :select="mode.name"
        @change="(v) => mode = v"
      >
        <template v-slot:tab="{ title, sample }">
          <span> {{ `${title}. For pasting into Excel or similar.` }} </span>
          <span>{{' ('}}</span>
          <span lang="ja">{{ sample }}</span>
          <span>{{')'}}</span>
        </template>
        <template v-slot:space="{ title, sample }">
          <span> {{ `${title}. Similar to above, but with space.` }} </span>
          <span>{{' ('}}</span>
          <span lang="ja">{{ sample }}</span>
          <span>{{')'}}</span>
        </template>
        <template v-slot:anki="{ sample }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://apps.ankiweb.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{'Anki'}}
          </a>
          <span> {{"'s "}} </span>
          <a
            href="https://ankiweb.net/shared/info/3918629684"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{'Japanese support'}}
          </a>
          <span>
            {{'. Text is already formatted without plugin installed, however.'}}
          </span>
          <span>{{')'}}</span>
        </template>
        <template v-slot:furiganaMarkdownIt="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://github.com/iltrof/furigana-markdown-it"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
        <template v-slot:imeToFurigana="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
        <template v-slot:imeToFuriganaSpoiler="{ sample, title }">
          <span lang="ja">{{ sample }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ title }}
          </a>
          <span>{{')'}}</span>
        </template>
      </IMEFuriganaSelect>
    </details>

    <IMEFuriganaKeyboard :mode="mode" />
  </section>
</template>

<style lang="scss" scoped>
.options-collapse {
  margin-bottom: 1em;

  summary {
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
