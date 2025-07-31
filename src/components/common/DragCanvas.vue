<template>
  <div class="canvas-container relative w-full h-full overflow-hidden">
    <!-- 画布背景 -->
    <div 
      ref="canvasRef"
      class="canvas-workspace absolute inset-0 grid-background"
      :style="canvasStyle"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @click="handleCanvasClick"
    >
      <!-- 画布内容区域 -->
      <div 
        class="canvas-content relative bg-dark-surface border border-dark-border"
        :style="contentStyle"
      >
        <!-- 组件渲染 -->
        <div 
          v-for="component in canvasStore.components"
          :key="component.id"
          :class="{
            'selected': canvasStore.selectedComponent === component.id,
            'component-item': true,
            'dragging': isDragging && dragComponent?.id === component.id
          }"
          :style="getComponentStyle(component)"
          @click.native="selectComponent(component.id)"  
          @mousedown="startDrag($event, component)"
        >
          <!-- 调试信息 -->
          <div v-if="!getComponentType(component.type)" class="debug-info absolute top-0 left-0 bg-red-500 text-white text-xs p-1 z-50">
            Missing: {{ component.type }}
          </div>
          
          <!-- 组件内容 -->
          <component 
            :is="getComponentType(component.type)"
            :config="component"
            :data="component.data"
            @error="(err) => console.error('Component error:', err)"
          />
          
          <!-- 选中状态的控制点 -->
          <div v-if="canvasStore.selectedComponent === component.id && !isDragging" class="resize-handles">
            <div class="resize-handle resize-handle-nw"></div>
            <div class="resize-handle resize-handle-ne"></div>
            <div class="resize-handle resize-handle-sw"></div>
            <div class="resize-handle resize-handle-se"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 缩放控制 -->
    <div class="absolute bottom-4 right-4 flex items-center space-x-2 bg-dark-surface border border-dark-border rounded-lg p-2">
      <button @click="zoomOut" class="p-1 hover:bg-dark-bg rounded">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      <span class="text-sm text-gray-400 min-w-12 text-center">{{ Math.round(canvasStore.scale * 100) }}%</span>
      <button @click="zoomIn" class="p-1 hover:bg-dark-bg rounded">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCanvasStore } from '@stores/canvas'

// 导入组件类型
// 修改导入方式为同步导入
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import ScatterChart from '@/components/charts/ScatterChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'
import MapChart from '@/components/charts/MapChart.vue'
import Chart3D from '@/components/charts/Chart3D.vue'

// 容器组件 - 需要检查这些文件是否存在
// import CardContainer from '@/components/containers/CardContainer.vue'
// import SectionContainer from '@/components/containers/SectionContainer.vue'
// import ModalContainer from '@/components/containers/ModalContainer.vue'

// 控制组件 - 只导入存在的文件
import FilterControl from '@/components/controls/FilterControl.vue'
import DropdownControl from '@/components/controls/DropdownControl.vue'
import DatePicker from '@/components/controls/DatePicker.vue'
import SwitchControl from '@/components/controls/SwitchControl.vue'

// 修改组件类型映射 - 暂时注释掉不存在的组件
import { defineAsyncComponent } from 'vue'

// 使用 defineAsyncComponent 包装动态导入，并添加错误处理
const componentTypes = {
  // 图表组件
  'line-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/LineChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'bar-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/BarChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'pie-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/PieChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'scatter-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/ScatterChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'heatmap-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/HeatmapChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'map-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/MapChart.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  '3d-chart': defineAsyncComponent({
    loader: () => import('@/components/charts/Chart3D.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  
  // 控制组件
  'filter-control': defineAsyncComponent({
    loader: () => import('@/components/controls/FilterControl.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'dropdown-control': defineAsyncComponent({
    loader: () => import('@/components/controls/DropdownControl.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'date-picker': defineAsyncComponent({
    loader: () => import('@/components/controls/DatePicker.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  }),
  'switch-control': defineAsyncComponent({
    loader: () => import('@/components/controls/SwitchControl.vue'),
    errorComponent: { template: '<div class="p-4 text-red-500">组件加载失败</div>' }
  })
}

const canvasStore = useCanvasStore()
const canvasRef = ref(null)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const dragComponent = ref(null)
const dragOffset = ref({ x: 0, y: 0 }) // 新增：拖拽偏移量

// 节流函数
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

const canvasStyle = computed(() => ({
  transform: `scale(${canvasStore.scale}) translate(${canvasStore.position.x}px, ${canvasStore.position.y}px)`,
  transformOrigin: 'center center'
}))

const contentStyle = computed(() => ({
  width: `${canvasStore.size.width}px`,
  height: `${canvasStore.size.height}px`,
  margin: '50px auto',
  position: 'relative'
}))

const getComponentType = (type) => {
  const component = componentTypes[type]
  if (!component) {
    console.warn(`Component type '${type}' not found, using fallback`)
    // 返回一个简单的占位组件
    return {
      template: `
        <div class="fallback-component p-4 bg-red-900 border border-red-500 rounded text-white text-center">
          <p>组件类型 '${type}' 未找到</p>
          <p class="text-sm text-red-300 mt-2">请检查组件是否存在</p>
        </div>
      `
    }
  }
  return component
}

const getComponentStyle = (component) => {
  // 如果是正在拖拽的组件，使用本地偏移量
  if (isDragging.value && dragComponent.value && dragComponent.value.id === component.id) {
    return {
      position: 'absolute',
      left: `${component.position.x + dragOffset.value.x}px`,
      top: `${component.position.y + dragOffset.value.y}px`,
      width: `${component.size.width}px`,
      height: `${component.size.height}px`,
      zIndex: component.zIndex || 1,
      transform: 'translateZ(0)', // 启用硬件加速
      willChange: 'transform' // 优化重绘性能
    }
  }
  
  return {
    position: 'absolute',
    left: `${component.position.x}px`,
    top: `${component.position.y}px`,
    width: `${component.size.width}px`,
    height: `${component.size.height}px`,
    zIndex: component.zIndex || 1
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  
  try {
    const componentData = JSON.parse(event.dataTransfer.getData('application/json'))
    
    const rect = canvasRef.value.querySelector('.canvas-content').getBoundingClientRect()
    const x = (event.clientX - rect.left) / canvasStore.scale
    const y = (event.clientY - rect.top) / canvasStore.scale
    
    // 确保位置参数正确传递
    const componentToAdd = {
      ...componentData,
      position: { 
        x: Math.max(0, x - 150), 
        y: Math.max(0, y - 100) 
      },
      size: componentData.size || { width: 300, height: 200 }
    }
    
    console.log('Dropping component:', componentToAdd)
    canvasStore.addComponent(componentToAdd)
    
  } catch (error) {
    console.error('Error handling drop:', error)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const handleCanvasClick = () => {
  canvasStore.selectComponent(null)
}

const selectComponent = (id) => {
  console.log('Selecting component:', id);
  // 添加更多日志，确认函数被调用
  console.log('Current selected component:', canvasStore.selectedComponent);
  canvasStore.selectComponent(id);
  console.log('After selection, selected component:', canvasStore.selectedComponent);
}

const startDrag = (event, component) => {
  if (event.target.closest('.resize-handle')) return
  
  isDragging.value = true
  dragComponent.value = component
  dragOffset.value = { x: 0, y: 0 }
  dragStart.value = {
    x: event.clientX,
    y: event.clientY
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  // 防止文本选择
  event.preventDefault()
}

// 优化的鼠标移动处理 - 只更新本地状态
const handleMouseMove = (event) => {
  if (!isDragging.value || !dragComponent.value) return
  
  const deltaX = (event.clientX - dragStart.value.x) / canvasStore.scale
  const deltaY = (event.clientY - dragStart.value.y) / canvasStore.scale
  
  dragOffset.value = {
    x: deltaX,
    y: deltaY
  }
}

// 节流更新store状态
const throttledUpdateStore = throttle((component, offset) => {
  const newX = Math.max(0, component.position.x + offset.x)
  const newY = Math.max(0, component.position.y + offset.y)
  
  canvasStore.updateComponent(component.id, {
    position: { x: newX, y: newY }
  })
}, 16) // 约60FPS

const handleMouseUp = () => {
  if (isDragging.value && dragComponent.value) {
    // 最终更新store状态
    const newX = Math.max(0, dragComponent.value.position.x + dragOffset.value.x)
    const newY = Math.max(0, dragComponent.value.position.y + dragOffset.value.y)
    
    canvasStore.updateComponent(dragComponent.value.id, {
      position: { x: newX, y: newY }
    })
  }
  
  isDragging.value = false
  dragComponent.value = null
  dragOffset.value = { x: 0, y: 0 }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const zoomIn = () => {
  canvasStore.setScale(canvasStore.scale * 1.1)
}

const zoomOut = () => {
  canvasStore.setScale(canvasStore.scale * 0.9)
}

onMounted(() => {
  // 键盘快捷键
  const handleKeyDown = (event) => {
    if (event.key === 'Delete' && canvasStore.selectedComponent) {
      canvasStore.deleteComponent(canvasStore.selectedComponent)
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.canvas-container {
  /* 启用硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
}

.component-item {
  /* 优化拖拽性能 */
  will-change: transform;
  backface-visibility: hidden;
}

.component-item.dragging {
  /* 拖拽时的优化 */
  pointer-events: none;
  z-index: 1000;
}

.canvas-content {
  /* 减少重绘 */
  contain: layout style paint;
}

.grid-background {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  /* 固定背景，避免重绘 */
  background-attachment: local;
}

.resize-handles {
  /* 控制点优化 */
  pointer-events: auto;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border: 1px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.resize-handle-nw { top: 0; left: 0; cursor: nw-resize; }
.resize-handle-ne { top: 0; right: 0; cursor: ne-resize; }
.resize-handle-sw { bottom: 0; left: 0; cursor: sw-resize; }
.resize-handle-se { bottom: 0; right: 0; cursor: se-resize; }

.selected {
  outline: 2px solid #00d4ff;
  outline-offset: -2px;
}
</style>