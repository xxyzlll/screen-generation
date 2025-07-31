<template>
  <div class="preview-container h-screen bg-gray-900 overflow-hidden">
    <!-- 预览工具栏 -->
    <div class="preview-toolbar h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div class="flex items-center space-x-4">
        <button 
          @click="$router.push('/editor')"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          返回编辑
        </button>
        <span class="text-gray-300">预览模式</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 分辨率选择 -->
        <select 
          v-model="selectedResolution" 
          @change="changeResolution"
          class="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
        >
          <option value="1920x1080">1920×1080</option>
          <option value="1366x768">1366×768</option>
          <option value="3840x2160">3840×2160</option>
          <option value="2560x1440">2560×1440</option>
        </select>
        
        <!-- 全屏按钮 -->
        <button 
          @click="toggleFullscreen"
          class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>
    
    <!-- 预览画布 -->
    <div 
      ref="previewContainer"
      class="preview-canvas-container flex-1 flex items-start justify-start p-4 overflow-auto"
    >
      <div 
        ref="previewCanvas"
        class="preview-canvas relative"
        :style="canvasStyle"
      >
        <!-- 渲染所有组件 -->
        <component
          v-for="comp in components"
          :key="comp.id"
          :is="getComponentType(comp.type)"
          :component="comp"
          :config="comp.config || {}"
          :data="comp.data || []"
          :style="getComponentStyle(comp)"
          class="absolute"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore } from '../stores/editor'
// 修正导入路径（Charts -> charts）
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'
import MapChart from '../components/charts/MapChart.vue'
import BorderBox from '../components/Containers/BorderBox.vue'
import CardContainer from '../components/Containers/CardContainer.vue'
import DataFilter from '../components/Controls/DataFilter.vue'
import TimeSelector from '../components/Controls/TimeSelector.vue'

const route = useRoute()
const editorStore = useEditorStore()

const previewContainer = ref<HTMLElement>()
const previewCanvas = ref<HTMLElement>()
const selectedResolution = ref('1920x1080')
const isFullscreen = ref(false)

// 组件映射
const componentMap = {
  'line-chart': LineChart,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'map-chart': MapChart,
  'border-box': BorderBox,
  'card-container': CardContainer,
  'data-filter': DataFilter,
  'time-selector': TimeSelector
}

// 获取组件类型
const getComponentType = (type: string) => {
  return componentMap[type as keyof typeof componentMap] || 'div'
}

// 获取组件样式（考虑缩放的版本）
const getComponentStyle = (comp: any) => {
  const scale = getScale() // 如果使用缩放
  return {
    left: `${comp.x}px`,
    top: `${comp.y}px`,
    width: `${comp.width}px`,
    height: `${comp.height}px`,
    zIndex: comp.zIndex,
    transform: comp.style?.transform || '',
    opacity: comp.style?.opacity || 1,
    ...comp.style
  }
}

// 画布样式 - 移除缩放
const canvasStyle = computed(() => {
  const [width, height] = selectedResolution.value.split('x').map(Number)
  return {
    width: `${width}px`,
    height: `${height}px`,
    background: editorStore.canvas.background,
    // 移除 transform 和 transformOrigin
    // transform: `scale(${getScale()})`,
    // transformOrigin: 'center center'
  }
})

// 获取缩放比例
const getScale = () => {
  if (!previewContainer.value) return 1
  
  const [width, height] = selectedResolution.value.split('x').map(Number)
  const containerRect = previewContainer.value.getBoundingClientRect()
  
  const scaleX = (containerRect.width - 32) / width
  const scaleY = (containerRect.height - 32) / height
  
  return Math.min(scaleX, scaleY, 1)
}

// 组件列表
const components = computed(() => editorStore.components)

// 改变分辨率
const changeResolution = () => {
  const [width, height] = selectedResolution.value.split('x').map(Number)
  editorStore.setCanvasSize(width, height)
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    previewContainer.value?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 在onMounted中添加数据加载逻辑
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  
  // 从sessionStorage加载预览数据
  const previewData = sessionStorage.getItem('previewData')
  if (previewData) {
    try {
      const data = JSON.parse(previewData)
      // 恢复画布和组件数据
      editorStore.canvas = data.canvas
      editorStore.components = data.components
    } catch (error) {
      console.error('Failed to load preview data:', error)
    }
  }
  
  // 设置预览模式
  editorStore.setMode('preview')
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  // 恢复编辑模式
  editorStore.setMode('edit')
})
</script>

<style scoped>
.preview-canvas {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 1px solid #374151;
}
</style>