<script lang="ts" setup>
const props = defineProps<{
  level: number;
}>();

const lv = Math.floor(props.level);
const componentName = lv < 1 ? 'h1' : lv > 6 ? 'h6' : `h${lv}`;
</script>

<template>
  <component :is="componentName">
    <slot />
  </component>
</template>

<style scoped>
h1 {
  font-size: 175%;
}

h2 {
  font-size: 140%;
}

h3 {
  font-size: 120%;
}
</style>
