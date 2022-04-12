<script setup lang="ts">
import IMEFuriganaKeyboard from '@/components/IMEFuriganaKeyboard.vue'
import KanaKeyboard from '@/components/KanaKeyboard.vue'
import H from '@/components/H.vue'
import ReadingKeyboard from '@/components/ReadingKeyboard.vue'
</script>

<template>
  <section>
    <H :level="1"> Some interesting JPTools </H>

    <ul>
      <li>
        <div class="flex flex-column w-100">
          <div class="description">
            <router-link to="/kana"> Kana keyboard </router-link>
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
          <KanaKeyboard mini />
        </div>
      </li>
      <li>
        <div class="flex flex-column w-100">
          <div class="description">
            <router-link to="/reading">
              Auto-insert reading keyboard
            </router-link>
            <span> {{ ' (use this to paste into Excel or similar)' }} </span>
          </div>
          <ReadingKeyboard mini />
        </div>
      </li>
      <li>
        <div class="flex flex-column w-100">
          <div class="description">
            <router-link to="/furigana"> Auto-Furigana keyboard </router-link>
            <span> {{ ' (use this to generate Markdown or HTML)' }} </span>
          </div>
          <IMEFuriganaKeyboard mini />
        </div>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.description {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
