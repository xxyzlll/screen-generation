<template>
  <div 
    class="border-box-container relative"
    :style="containerStyle"
  >
    <!-- 科技感边框 -->
    <div class="border-decoration absolute inset-0 pointer-events-none">
      <!-- 四个角的装饰 -->
      <div class="corner corner-tl absolute top-0 left-0"></div>
      <div class="corner corner-tr absolute top-0 right-0"></div>
      <div class="corner corner-bl absolute bottom-0 left-0"></div>
      <div class="corner corner-br absolute bottom-0 right-0"></div>
      
      <!-- 边框线条 -->
      <div class="border-line border-top absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      <div class="border-line border-bottom absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      <div class="border-line border-left absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
      <div class="border-line border-right absolute right-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area relative z-10 p-4 h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentStyle } from '@/types/component'

interface Props {
  style?: ComponentStyle
  borderColor?: string
  glowEffect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  style: () => ({}),
  borderColor: '#00d4ff',
  glowEffect: true
})

const containerStyle = computed(() => ({
  width: props.style?.width ? `${props.style.width}px` : '100%',
  height: props.style?.height ? `${props.style.height}px` : '100%',
  backgroundColor: props.style?.backgroundColor || 'rgba(0, 20, 40, 0.3)',
  borderRadius: props.style?.borderRadius ? `${props.style.borderRadius}px` : '0'
}))
</script>

<style scoped>
.border-box-container {
  backdrop-filter: blur(5px);
}

.corner {
  width: 16px;
  height: 16px;
  border: 2px solid v-bind(borderColor);
}

.corner-tl {
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  border-right: none;
  border-top: none;
}

.corner-br {
  border-left: none;
  border-top: none;
}

.border-box-container.glow {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.border-line {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>