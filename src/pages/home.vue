<script setup lang="ts">
import { furiganaModes } from '@/shared/furigana'

import IMEFuriganaKeyboard from '@/components/IMEFuriganaKeyboard.vue'
import KanaKeyboard from '@/components/KanaKeyboard.vue'
import H from '@/components/H.vue'
</script>

<template>
  <section>
    <H :level="1">Some interesting JPTools</H>

    <ul>
      <li>
        <div class="description">
          <router-link to="/furigana"> IME2Furigana keyboard </router-link>
          <span> {{ ' (use this to paste into Excel or similar)' }} </span>
        </div>
        <IMEFuriganaKeyboard
          :mode="furiganaModes['Plain Text'].tab"
          height="200px"
        />
      </li>
      <li>
        <div class="description">
          <router-link to="/keyboard"> Kana keyboard </router-link>
          <span> {{ ' (powered by ' }} </span>
          <a
            href="https://wanakana.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ 'wanakana.js' }}
          </a>
          <span> {{ ')' }} </span>
        </div>
        <KanaKeyboard height="200px" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.description {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
