<script lang="ts" setup>
defineProps<{
  values: string[]
}>()

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
</script>

<template>
  <nav>
    <div class="field" v-for="v in values" :key="v">
      <input type="radio" @select="emit('change', v)" />
      <label>
        <slot :name="v">{{ v }}</slot>
      </label>
    </div>
  </nav>
</template>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>
