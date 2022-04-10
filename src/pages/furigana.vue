<script setup lang="ts">
import { mode } from '@/shared/furigana'

import IMEFuriganaSelect from '@/components/IMEFuriganaSelect.vue'
import IMEFuriganaKeyboard from '@/components/IMEFuriganaKeyboard.vue'
import H from '@/components/H.vue'
</script>

<template>
  <section>
    <H :level="1">IME2Furigana</H>
    <details class="options-collapse">
      <summary>
        <b> {{ `Mode: ` }} </b>
        <span> {{ mode.name }} </span>
      </summary>

      <IMEFuriganaSelect />
    </details>

    <IMEFuriganaKeyboard />
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
