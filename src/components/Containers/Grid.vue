<template>
  <div 
    class="grid-container"
    :style="gridStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentStyle } from '@/types/component'

interface Props {
  columns?: number
  rows?: number
  gap?: number
  style?: ComponentStyle
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
  rows: 2,
  gap: 16,
  style: () => ({})
})

const gridStyle = computed(() => ({
  width: props.style?.width ? `${props.style.width}px` : '100%',
  height: props.style?.height ? `${props.style.height}px` : '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  gridTemplateRows: `repeat(${props.rows}, 1fr)`,
  gap: `${props.gap}px`,
  padding: props.style?.padding ? `${props.style.padding}px` : '0'
}))
</script>

<style scoped>
.grid-container {
  @apply w-full h-full;
}
</style>