<template>
  <div 
    class="card-container relative overflow-hidden"
    :style="containerStyle"
  >
    <!-- 卡片头部 -->
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-content">
      <slot></slot>
    </div>
    
    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentStyle } from '@/types/component'

interface Props {
  title?: string
  style?: ComponentStyle
  shadow?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  style: () => ({}),
  shadow: true,
  bordered: true
})

const containerStyle = computed(() => ({
  width: props.style?.width ? `${props.style.width}px` : '100%',
  height: props.style?.height ? `${props.style.height}px` : 'auto',
  backgroundColor: props.style?.backgroundColor || 'rgba(0, 20, 40, 0.8)',
  border: props.bordered ? (props.style?.border || '1px solid #00d4ff') : 'none',
  borderRadius: props.style?.borderRadius ? `${props.style.borderRadius}px` : '8px',
  padding: '0'
}))
</script>

<style scoped>
.card-container {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card-container.shadow {
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
}

.card-container:hover {
  box-shadow: 0 6px 30px rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
}

.card-header {
  @apply px-4 py-3 border-b border-cyan-400/30;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%);
}

.card-title {
  @apply text-white text-lg font-semibold m-0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.card-content {
  @apply p-4 flex-1;
}

.card-footer {
  @apply px-4 py-3 border-t border-cyan-400/30;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.1) 100%);
}
</style>