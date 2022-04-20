<script setup lang="ts">
import KanaKeyboard from '@/components/KanaKeyboard.vue'
import H from '@/components/H.vue'
</script>

<template>
  <section>
    <H :level="1"> Kana keyboard </H>

    <p>
      <span> {{ 'Powered by ' }} </span>
      <a href="https://wanakana.com/" target="_blank" rel="noopener noreferrer">
        wanakana.js
      </a>
    </p>

    <KanaKeyboard />
  </section>
</template>