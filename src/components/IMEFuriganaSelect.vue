<script lang="ts" setup>
import { FuriganaMode } from '@/shared/furigana'

defineProps<{
  values: {
    [category: string]: {
      [key: string]: FuriganaMode
    }
  }
  select: string
}>()

const emit = defineEmits<{
  (e: 'change', value: FuriganaMode): void
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
          :sample="v.fn?.('漢字', 'ふり') || v.sample"
          lang="ja"
        >
          <span>{{ v.name }}</span>
          <span v-if="v.fn || v.sample">
            <span>{{' ('}}</span>
            <span v-if="v.fn" lang="ja"> {{ v.fn('漢字', 'ふり') }} </span>
            <span> {{ v.sample }} </span>
            <span>{{')'}}</span>
          </span>
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
