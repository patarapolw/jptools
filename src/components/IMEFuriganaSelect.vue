<script lang="ts" setup>
export type MakeRubyFunc = (base: string, furi: string) => string

const props = defineProps<{
  values: {
    [category: string]: {
      [key: string]: MakeRubyFunc | null
    }
  }
  select: string
}>()

const emit = defineEmits<{
  (e: 'change', value: MakeRubyFunc | null): void
}>()

const name = 'RadioSelect-' + Math.random().toString(36).substring(2)
</script>

<template>
  <nav v-for="[cat, val] in Object.entries(values)" :key="cat">
    <h3>{{ cat }}</h3>
    <div class="field" v-for="[k, v] in Object.entries(val)" :key="k">
      <input
        type="radio"
        :name="name"
        :checked="select === k"
        @change="emit('change', v)"
      />
      <label>
        <slot :name="k" :fn="v" :sample="v?.('漢字', 'ふり')" lang="ja">
          <span v-if="v"> {{ v('漢字', 'ふり') }} </span>
          <span v-else> {{ k }} </span>
        </slot>
      </label>
    </div>
  </nav>
</template>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>
