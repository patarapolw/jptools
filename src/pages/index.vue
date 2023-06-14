<script setup lang="ts">
import H from '@/components/H.vue';
</script>

<template>
  <section>
    <H :level="1"> Some interesting JPTools </H>

    <ul>
      <li>
        <router-link to="/kana"> Kana keyboard </router-link>
        <span> {{ ' (powered by ' }} </span>
        <a href="https://wanakana.com/" target="_blank" rel="noopener noreferrer">
          {{ 'wanakana.js' }}
        </a>
        <span> {{ ')' }} </span>
      </li>
      <li>
        <router-link to="/reading">
          Auto-insert reading keyboard
        </router-link>
        <span> {{ ' (use this to paste into Excel or similar)' }} </span>
      </li>
      <li>
        <router-link to="/furigana"> Auto-Furigana keyboard </router-link>
        <span> {{ ' (use this to generate Markdown or HTML)' }} </span>
      </li>
      <li>
        <router-link to="/preprocess"> Pre-process keyboard </router-link>
        <span>
          {{ ' (use this to normalize additional Markdown syntaxes)' }}
        </span>
      </li>
      <li>
        <router-link to="/vocab"> Vocabulary extractor </router-link>
      </li>
    </ul>
  </section>
</template>
