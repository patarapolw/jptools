<script setup lang="ts">
import IMEFuriganaSelect from '@/components/IMEFuriganaSelect.vue'
import IMEFuriganaKeyboard from '@/components/IMEFuriganaKeyboard.vue'
import H from '@/components/H.vue'
</script>

<template>
  <section>
    <H :level="1">IME2Furigana</H>
    <IMEFuriganaSelect />
    <IMEFuriganaKeyboard autofocus />
  </section>
</template>
