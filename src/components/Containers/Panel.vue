<template>
  <div 
    class="panel-container"
    :style="containerStyle"
  >
    <div v-if="title" class="panel-header">
      <h3 class="panel-title">{{ title }}</h3>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentStyle } from '@/types/component'

interface Props {
  title?: string
  style?: ComponentStyle
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  style: () => ({})
})

const containerStyle = computed(() => ({
  width: props.style?.width ? `${props.style.width}px` : '100%',
  height: props.style?.height ? `${props.style.height}px` : '100%',
  backgroundColor: props.style?.backgroundColor || 'rgba(0, 20, 40, 0.8)',
  border: props.style?.border || '1px solid #00d4ff',
  borderRadius: props.style?.borderRadius ? `${props.style.borderRadius}px` : '4px',
  padding: props.style?.padding ? `${props.style.padding}px` : '16px'
}))
</script>

<style scoped>
.panel-container {
  @apply relative overflow-hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
}

.panel-header {
  @apply mb-4 pb-2 border-b border-cyan-400/30;
}

.panel-title {
  @apply text-white text-lg font-semibold;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.panel-content {
  @apply h-full;
}
</style>