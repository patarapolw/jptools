<script lang="ts" setup>
export type MakeRubyFunc = (base: string, furi: string) => string

export type FuriganaOption = {
  name: string
  fn?: MakeRubyFunc
}

defineProps<{
  values: {
    [category: string]: {
      [key: string]: FuriganaOption
    }
  }
  select: string
}>()

const emit = defineEmits<{
  (e: 'change', value: FuriganaOption): void
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
        :checked="select === v.name"
        @change="emit('change', v)"
      />
      <label>
        <slot
          :name="k"
          :title="v.name"
          :fn="v"
          :sample="v.fn?.('漢字', 'ふり')"
          lang="ja"
        >
          <span>{{ v.name }}</span>
          <span v-if="v.fn">{{' ('}}</span>
          <span v-if="v.fn" lang="ja"> {{ v.fn('漢字', 'ふり') }} </span>
          <span v-if="v.fn">{{')'}}</span>
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
