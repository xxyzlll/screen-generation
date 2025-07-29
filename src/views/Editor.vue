<template>
  <div class="editor-layout h-screen flex">
    <!-- 左侧组件库 -->
    <div class="w-80 bg-dark-surface border-r border-dark-border">
      <ComponentLibrary />
    </div>
    
    <!-- 中心画布区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部工具栏 -->
      <div class="h-16 bg-dark-surface border-b border-dark-border flex items-center px-4">
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-tech-purple rounded-lg hover:bg-opacity-80 transition-all">
            保存
          </button>
          <button class="px-4 py-2 bg-tech-blue rounded-lg hover:bg-opacity-80 transition-all">
            预览
          </button>
          <button class="px-4 py-2 bg-tech-orange rounded-lg hover:bg-opacity-80 transition-all">
            导出
          </button>
        </div>
        
        <div class="ml-auto flex items-center space-x-4">
          <span class="text-sm text-gray-400">缩放: {{ canvasScale }}%</span>
          <button @click="resetCanvas" class="text-tech-coral hover:text-white transition-colors">
            重置画布
          </button>
        </div>
      </div>
      
      <!-- 画布 -->
      <div class="flex-1 relative overflow-hidden">
        <DragCanvas />
      </div>
    </div>
    
    <!-- 右侧属性面板 -->
    <div class="w-80 bg-dark-surface border-l border-dark-border">
      <PropertyPanel />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCanvasStore } from '@stores/canvas'
import ComponentLibrary from '@components/common/ComponentLibrary.vue'
import DragCanvas from '@components/common/DragCanvas.vue'
import PropertyPanel from '@components/common/PropertyPanel.vue'

const canvasStore = useCanvasStore()
const canvasScale = computed(() => Math.round(canvasStore.scale * 100))

const resetCanvas = () => {
  canvasStore.resetCanvas()
}
</script>

<style scoped>
.editor-layout {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}
</style>