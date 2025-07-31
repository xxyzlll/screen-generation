<template>
  <div class="toolbar h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
    <!-- 左侧工具 -->
    <div class="flex items-center space-x-4">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
          <span class="text-white font-bold text-sm">DS</span>
        </div>
        <span class="text-white font-semibold">大屏生成器</span>
      </div>
      
      <!-- 分隔线 -->
      <div class="w-px h-6 bg-gray-600"></div>
      
      <!-- 操作按钮 -->
      <div class="flex items-center space-x-2">
        <button 
          @click="undo"
          :disabled="!canUndo"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="撤销 (Ctrl+Z)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="redo"
          :disabled="!canRedo"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="重做 (Ctrl+Shift+Z)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div class="w-px h-6 bg-gray-600"></div>
        
        <button 
          @click="copy"
          :disabled="!hasSelection"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="复制 (Ctrl+C)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        </button>
        
        <button 
          @click="paste"
          :disabled="!canPaste"
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="粘贴 (Ctrl+V)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h4a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L14.586 13H19v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11.586V13a1 1 0 11-2 0v-1.586l.293.293a1 1 0 001.414 0l.293-.293z" />
          </svg>
        </button>
        
        <button 
          @click="deleteSelected"
          :disabled="!hasSelection"
          class="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="删除 (Delete)"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 中间工具 -->
    <div class="flex items-center space-x-4">
      <!-- 画布缩放 -->
      <div class="flex items-center space-x-2">
        <button 
          @click="zoomOut"
          class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <span class="text-gray-300 text-sm min-w-12 text-center">
          {{ Math.round(editorStore.canvas.scale * 100) }}%
        </span>
        
        <button 
          @click="zoomIn"
          class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          @click="resetZoom"
          class="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        >
          重置
        </button>
      </div>
      
      <!-- 画布尺寸 -->
      <div class="flex items-center space-x-2">
        <select 
          v-model="selectedResolution" 
          @change="changeResolution"
          class="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600"
        >
          <option value="1920x1080">1920×1080</option>
          <option value="1366x768">1366×768</option>
          <option value="3840x2160">4K (3840×2160)</option>
          <option value="2560x1440">2K (2560×1440)</option>
        </select>
      </div>
    </div>
    
    <!-- 右侧工具 -->
    <div class="flex items-center space-x-4">
      <!-- 视图控制 -->
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleGrid"
          :class="[
            'p-2 rounded transition-colors',
            editorStore.showGrid 
              ? 'text-blue-400 bg-blue-400/20' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          ]"
          title="显示网格"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        
        <button 
          @click="toggleRuler"
          :class="[
            'p-2 rounded transition-colors',
            editorStore.showRuler 
              ? 'text-blue-400 bg-blue-400/20' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          ]"
          title="显示标尺"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div class="w-px h-6 bg-gray-600"></div>
      
      <!-- 预览和导出 -->
      <div class="flex items-center space-x-2">
        <button 
          @click="preview"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          预览
        </button>
        
        <button 
          @click="exportProject"
          class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          导出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '../../stores/editor'

const router = useRouter()
const editorStore = useEditorStore()

const selectedResolution = ref('1920x1080')

// 计算属性
const canUndo = computed(() => false) // TODO: 实现历史记录
const canRedo = computed(() => false) // TODO: 实现历史记录
const hasSelection = computed(() => editorStore.selectedComponents.length > 0)
const canPaste = computed(() => false) // TODO: 实现剪贴板

// 操作方法
const undo = () => {
  // TODO: 实现撤销
  console.log('撤销')
}

const redo = () => {
  // TODO: 实现重做
  console.log('重做')
}

const copy = () => {
  // TODO: 实现复制
  console.log('复制')
}

const paste = () => {
  // TODO: 实现粘贴
  console.log('粘贴')
}

const deleteSelected = () => {
  editorStore.selectedComponents.forEach(id => {
    editorStore.removeComponent(id)
  })
}

// 缩放控制
const zoomIn = () => {
  editorStore.setCanvasScale(editorStore.canvas.scale + 0.1)
}

const zoomOut = () => {
  editorStore.setCanvasScale(editorStore.canvas.scale - 0.1)
}

const resetZoom = () => {
  editorStore.setCanvasScale(1)
}

// 改变分辨率
const changeResolution = () => {
  const [width, height] = selectedResolution.value.split('x').map(Number)
  editorStore.setCanvasSize(width, height)
}

// 切换网格
const toggleGrid = () => {
  editorStore.showGrid = !editorStore.showGrid
}

// 切换标尺
const toggleRuler = () => {
  editorStore.showRuler = !editorStore.showRuler
}

// 预览
const preview = () => {
  // 将当前编辑器状态保存到localStorage或sessionStorage
  const previewData = {
    canvas: editorStore.canvas,
    components: editorStore.components
  }
  sessionStorage.setItem('previewData', JSON.stringify(previewData))
  
  // 在新标签页中打开预览页面
  const previewUrl = router.resolve('/preview').href
  window.open(previewUrl, '_blank')
}

// 导出
const exportProject = () => {
  // TODO: 实现导出功能
  console.log('导出项目')
}
</script>