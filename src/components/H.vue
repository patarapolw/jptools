<script lang="ts" setup>
const props = defineProps<{
  level: number
}>()

const lv = Math.floor(props.level)
const componentName = lv < 1 ? 'h1' : lv > 6 ? 'h6' : `h${lv}`
</script>

<template>
  <component :is="componentName">
    <slot />
  </component>
</template>

<style scoped>
h1 {
  font-size: 200%;
}
</style>
