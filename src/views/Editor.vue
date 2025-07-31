<template>
  <div class="editor-container h-screen flex flex-col bg-gray-900">
    <!-- 顶部工具栏 -->
    <Toolbar />
    
    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧组件库 -->
      <Sidebar class="w-64 border-r border-gray-700" />
      
      <!-- 中心画布区域 -->
      <div class="flex-1 flex flex-col">
        <Canvas />
      </div>
      
      <!-- 右侧属性面板 -->
      <PropertyPanel class="w-80 border-l border-gray-700" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Toolbar from '../components/Editor/Toolbar.vue'
import Sidebar from '../components/Editor/Sidebar.vue'
import Canvas from '../components/Editor/Canvas.vue'
import PropertyPanel from '../components/Editor/PropertyPanel.vue'
import { useEditorStore } from '../stores/editor'

const editorStore = useEditorStore()

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl+Z 撤销
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    // TODO: 实现撤销功能
  }
  // Ctrl+Shift+Z 重做
  if (e.ctrlKey && e.key === 'z' && e.shiftKey) {
    e.preventDefault()
    // TODO: 实现重做功能
  }
  // Delete 删除选中组件
  if (e.key === 'Delete') {
    e.preventDefault()
    editorStore.selectedComponents.forEach(id => {
      editorStore.removeComponent(id)
    })
  }
  // Escape 清空选择
  if (e.key === 'Escape') {
    e.preventDefault()
    editorStore.clearSelection()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.editor-container {
  user-select: none;
}
</style>