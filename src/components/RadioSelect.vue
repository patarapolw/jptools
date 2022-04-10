<script lang="ts" setup>
const props = defineProps<{
  values: Record<string, any>
  select: string
}>()

const emit = defineEmits<{
  (e: 'change', value: keyof typeof props.values): void
}>()

const name = 'RadioSelect-' + Math.random().toString(36).substring(2)
</script>

<template>
  <nav>
    <div class="field" v-for="[k, v] in Object.entries(values)" :key="k">
      <input
        type="radio"
        :name="name"
        :checked="select === k"
        @change="emit('change', k)"
      />
      <label>
        <slot :name="k">{{ v }}</slot>
      </label>
    </div>
  </nav>
</template>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>
