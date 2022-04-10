<script lang="ts" setup>
import { FuriganaMode, furiganaModes, mode } from '@/shared/furigana'

const name = 'IMEFuriganaSelect'

function onSelect(m: FuriganaMode) {
  mode.value = m
}

function makeSample(m: FuriganaMode) {
  return m.fn?.('漢字', 'ふり') || m.sample
}
</script>

<template>
  <nav v-for="[cat, val] in Object.entries(furiganaModes)" :key="cat">
    <h3>{{ cat }}</h3>
    <div class="field" v-for="[k, v] in Object.entries(val)" :key="k">
      <input
        type="radio"
        :name="name"
        :checked="mode.name === v.name"
        @change="onSelect(v)"
      />
      <label>
        <span v-if="k === 'tab'">
          <span> {{ `${v.name}. For pasting into Excel or similar.` }} </span>
          <span>{{' ('}}</span>
          <span lang="ja">{{ makeSample(v) }}</span>
          <span>{{')'}}</span>
        </span>
        <span v-else-if="k === 'space'">
          <span> {{ `${v.name}. Similar to above, but with space.` }} </span>
          <span>{{' ('}}</span>
          <span lang="ja">{{ makeSample(v)}}</span>
          <span>{{')'}}</span>
        </span>
        <span v-else-if="k === 'anki'">
          <span lang="ja">{{ makeSample(v) }}</span>
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
        </span>
        <span v-else-if="k === 'furiganaMarkdownIt'">
          <span lang="ja">{{ makeSample(v) }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://github.com/iltrof/furigana-markdown-it"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ v.name }}
          </a>
          <span>{{')'}}</span>
        </span>
        <span v-else-if="k === 'imeToFurigana' || k === 'imeToFuriganaSpoiler'">
          <span lang="ja">{{ makeSample(v) }}</span>
          <span>{{' ('}}</span>
          <a
            href="https://community.wanikani.com/t/userscript-forum-ime2furigana/39109"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ v.name }}
          </a>
          <span>{{')'}}</span>
        </span>
        <span v-else>
          <span>{{ v.name }}</span>
          <span>{{' ('}}</span>
          <span lang="ja"> {{ makeSample(v) }} </span>
          <span>{{')'}}</span>
        </span>
      </label>
    </div>
  </nav>
</template>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>
