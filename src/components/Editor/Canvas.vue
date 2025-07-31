<template>
  <div class="canvas-container flex-1 bg-gray-900 relative overflow-hidden">
    <!-- 标尺 -->
    <div v-if="editorStore.showRuler" class="ruler-container absolute inset-0 pointer-events-none z-10">
      <!-- 水平标尺 -->
      <div class="ruler-horizontal absolute top-0 left-8 right-0 h-8 bg-gray-800 border-b border-gray-600">
        <div 
          v-for="mark in horizontalMarks" 
          :key="mark.position"
          class="absolute top-0 h-full flex items-end pb-1"
          :style="{ left: mark.position + 'px' }"
        >
          <div class="w-px bg-gray-500" :class="mark.major ? 'h-4' : 'h-2'"></div>
          <span v-if="mark.major" class="absolute top-1 left-1 text-xs text-gray-400">
            {{ mark.value }}
          </span>
        </div>
      </div>
      
      <!-- 垂直标尺 -->
      <div class="ruler-vertical absolute top-8 left-0 bottom-0 w-8 bg-gray-800 border-r border-gray-600">
        <div 
          v-for="mark in verticalMarks" 
          :key="mark.position"
          class="absolute left-0 w-full flex items-center pl-1"
          :style="{ top: mark.position + 'px' }"
        >
          <div class="h-px bg-gray-500" :class="mark.major ? 'w-4' : 'w-2'"></div>
          <span v-if="mark.major" class="absolute left-1 text-xs text-gray-400 transform -rotate-90 origin-left">
            {{ mark.value }}
          </span>
        </div>
      </div>
      
      <!-- 标尺交叉点 -->
      <div class="absolute top-0 left-0 w-8 h-8 bg-gray-800 border-r border-b border-gray-600"></div>
    </div>
    
    // 修改滚动容器样式，禁用滚动
    <!-- 画布滚动容器 -->
    <div 
      ref="scrollContainer"
      class="canvas-scroll-container absolute inset-0 overflow-hidden"
      :class="{ 'ml-8 mt-8': editorStore.showRuler }"
    >
      <!-- 画布背景 -->
      <div 
        class="canvas-background absolute inset-0 flex items-center justify-center"
        :style="canvasBackgroundStyle"
      >
        <!-- 网格 -->
        <div 
          v-if="editorStore.showGrid"
          class="canvas-grid absolute inset-0 pointer-events-none"
          :style="gridStyle"
        ></div>
        
        <!-- 主画布 -->
        <div 
          ref="canvas"
          class="canvas relative border border-gray-600 bg-gray-800"
          :style="canvasStyle"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <!-- 组件渲染 -->
          <!-- 组件渲染 -->
          <component
            v-for="comp in editorStore.components"
            :key="comp.id"
            :is="getComponentType(comp.type)"
            :component="comp"
            :config="comp.props"
            :data="comp.props.data || []"
            :selected="editorStore.selectedComponents.includes(comp.id)"
            :style="getComponentStyle(comp)"
            class="absolute"
            @mousedown="handleComponentMouseDown(comp.id, $event)"
            @click="handleComponentClick(comp.id, $event)"
          />
          
          <!-- 选择框 -->
          <div 
            v-if="selectionBox.visible"
            class="selection-box absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            :style="selectionBoxStyle"
          ></div>
          
          <!-- 变换控制器 -->
          <div 
            v-if="editorStore.selectedComponents.length === 1"
            class="transform-controls absolute pointer-events-none"
            :style="transformControlsStyle"
          >
            <!-- 缩放手柄 -->
            <div 
              v-for="handle in resizeHandles"
              :key="handle.position"
              class="resize-handle absolute w-2 h-2 bg-blue-500 border border-white pointer-events-auto cursor-pointer"
              :class="handle.cursor"
              :style="handle.style"
              @mousedown="handleResizeStart(handle.position, $event)"
            ></div>
            
            <!-- 旋转手柄 -->
            <div 
              class="rotate-handle absolute w-2 h-2 bg-green-500 border border-white rounded-full pointer-events-auto cursor-pointer"
              :style="rotateHandleStyle"
              @mousedown="handleRotateStart($event)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useComponentsStore } from '../../stores/components'
import type { Component } from '../../types/component'
import type { SelectionBox, DragState } from '../../types/canvas'

// 导入组件
// 修改导入路径
import LineChart from '../charts/LineChart.vue'
import BarChart from '../charts/BarChart.vue'
import PieChart from '../charts/PieChart.vue'
import MapChart from '../charts/MapChart.vue'
import BorderBox from '../Containers/BorderBox.vue'
import CardContainer from '../Containers/CardContainer.vue'
import DataFilter from '../Controls/DataFilter.vue'
import TimeSelector from '../Controls/TimeSelector.vue'

const editorStore = useEditorStore()
const componentsStore = useComponentsStore()

// 在 script setup 部分添加
const scrollContainer = ref<HTMLElement>()
const canvas = ref<HTMLElement>()

// 计算自适应缩放比例
const calculateAutoScale = () => {
  if (!scrollContainer.value) return 1
  
  const containerRect = scrollContainer.value.getBoundingClientRect()
  const padding = 100 // 留一些边距
  
  const availableWidth = containerRect.width - padding * 2
  const availableHeight = containerRect.height - padding * 2
  
  const scaleX = availableWidth / editorStore.canvas.width
  const scaleY = availableHeight / editorStore.canvas.height
  
  // 取较小的缩放比例，确保画布完全可见
  return Math.min(scaleX, scaleY, 1) // 最大不超过100%
}

// 修改画布背景样式
const canvasBackgroundStyle = computed(() => {
  return {
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 50% 50%, #1f2937 0%, #111827 100%)'
  }
})

// 修改主画布样式，移除transform，直接居中
const canvasStyle = computed(() => {
  const autoScale = calculateAutoScale()
  return {
    width: `${editorStore.canvas.width}px`,
    height: `${editorStore.canvas.height}px`,
    transform: `scale(${autoScale})`,
    transformOrigin: 'center center',
    background: editorStore.canvas.background,
    flexShrink: 0
  }
})

// 移除滚动处理函数
// const handleScroll = () => {
//   // 不再需要滚动处理
// }

// 监听窗口大小变化
const handleResize = () => {
  // 触发重新计算
  nextTick(() => {
    // 强制更新计算属性
  })
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeyDown)
})

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

// 选择框状态
const selectionBox = ref<SelectionBox>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false
})

// 拖拽状态
const dragState = ref<DragState>({
  isDragging: false,
  dragType: 'component',
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0
})



// 网格样式
const gridStyle = computed(() => {
  const size = 20 * editorStore.canvas.scale
  return {
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${size}px ${size}px`
  }
})

// 选择框样式
const selectionBoxStyle = computed(() => ({
  left: `${Math.min(selectionBox.value.x, selectionBox.value.x + selectionBox.value.width)}px`,
  top: `${Math.min(selectionBox.value.y, selectionBox.value.y + selectionBox.value.height)}px`,
  width: `${Math.abs(selectionBox.value.width)}px`,
  height: `${Math.abs(selectionBox.value.height)}px`
}))

// 变换控制器样式
const transformControlsStyle = computed(() => {
  const selectedComponent = editorStore.getSelectedComponents[0]
  if (!selectedComponent) return {}
  
  return {
    left: `${selectedComponent.x - 4}px`,
    top: `${selectedComponent.y - 4}px`,
    width: `${selectedComponent.width + 8}px`,
    height: `${selectedComponent.height + 8}px`
  }
})

// 缩放手柄
const resizeHandles = computed(() => {
  const selectedComponent = editorStore.getSelectedComponents[0]
  if (!selectedComponent) return []
  
  const { width, height } = selectedComponent
  
  return [
    { position: 'nw', cursor: 'cursor-nw-resize', style: { left: '-4px', top: '-4px' } },
    { position: 'n', cursor: 'cursor-n-resize', style: { left: `${width / 2 - 4}px`, top: '-4px' } },
    { position: 'ne', cursor: 'cursor-ne-resize', style: { right: '-4px', top: '-4px' } },
    { position: 'e', cursor: 'cursor-e-resize', style: { right: '-4px', top: `${height / 2 - 4}px` } },
    { position: 'se', cursor: 'cursor-se-resize', style: { right: '-4px', bottom: '-4px' } },
    { position: 's', cursor: 'cursor-s-resize', style: { left: `${width / 2 - 4}px`, bottom: '-4px' } },
    { position: 'sw', cursor: 'cursor-sw-resize', style: { left: '-4px', bottom: '-4px' } },
    { position: 'w', cursor: 'cursor-w-resize', style: { left: '-4px', top: `${height / 2 - 4}px` } }
  ]
})

// 旋转手柄样式
const rotateHandleStyle = computed(() => {
  const selectedComponent = editorStore.getSelectedComponents[0]
  if (!selectedComponent) return {}
  
  return {
    left: `${selectedComponent.width / 2 - 4}px`,
    top: '-20px'
  }
})


// 获取组件类型
const getComponentType = (type: string) => {
  return componentMap[type as keyof typeof componentMap] || 'div'
}

// 获取组件样式
const getComponentStyle = (comp: Component) => ({
  left: `${comp.x}px`,
  top: `${comp.y}px`,
  width: `${comp.width}px`,
  height: `${comp.height}px`,
  zIndex: comp.zIndex,
  transform: comp.style?.transform || '',
  opacity: comp.visible ? (comp.style?.opacity || 1) : 0.5,
  pointerEvents: comp.locked ? 'none' : 'auto',
  ...comp.style
})

// 获取鼠标在画布中的位置
// 修正获取鼠标在画布中的位置函数
const getCanvasPosition = (event: MouseEvent) => {
  if (!canvas.value || !scrollContainer.value) return { x: 0, y: 0 }
  
  const canvasRect = canvas.value.getBoundingClientRect()
  const containerRect = scrollContainer.value.getBoundingClientRect()
  const autoScale = calculateAutoScale()
  
  // 计算鼠标相对于画布的位置
  const x = (event.clientX - canvasRect.left) / autoScale
  const y = (event.clientY - canvasRect.top) / autoScale
  
  return { x, y }
}

// 同时需要修正标尺刻度计算
const horizontalMarks = computed(() => {
  const marks = []
  const step = 50
  const maxWidth = editorStore.canvas.width
  const autoScale = calculateAutoScale()
  
  for (let i = 0; i <= maxWidth; i += step) {
    marks.push({
      position: i * autoScale,
      value: i,
      major: i % 100 === 0
    })
  }
  
  return marks
})

const verticalMarks = computed(() => {
  const marks = []
  const step = 50
  const maxHeight = editorStore.canvas.height
  const autoScale = calculateAutoScale()
  
  for (let i = 0; i <= maxHeight; i += step) {
    marks.push({
      position: i * autoScale,
      value: i,
      major: i % 100 === 0
    })
  }
  
  return marks
})

const handleCanvasMouseDown = (event: MouseEvent) => {
  if (event.target !== canvas.value) return
  
  const pos = getCanvasPosition(event)
  
  // 开始选择框
  selectionBox.value = {
    x: pos.x,
    y: pos.y,
    width: 0,
    height: 0,
    visible: true
  }
  
  dragState.value = {
    isDragging: true,
    dragType: 'selection',
    startX: pos.x,
    startY: pos.y,
    currentX: pos.x,
    currentY: pos.y
  }
  
  // 清空选择
  if (!event.ctrlKey) {
    editorStore.clearSelection()
  }
}


// 修改鼠标移动事件，添加缩放逻辑
const handleCanvasMouseMove = (event: MouseEvent) => {
  if (!dragState.value.isDragging) return
  
  const pos = getCanvasPosition(event)
  dragState.value.currentX = pos.x
  dragState.value.currentY = pos.y
  
  if (dragState.value.dragType === 'selection') {
    // 更新选择框
    selectionBox.value.width = pos.x - selectionBox.value.x
    selectionBox.value.height = pos.y - selectionBox.value.y
  } else if (dragState.value.dragType === 'component') {
    // 移动选中的组件
    const deltaX = pos.x - dragState.value.startX
    const deltaY = pos.y - dragState.value.startY
    
    editorStore.selectedComponents.forEach(id => {
      const component = editorStore.components.find(comp => comp.id === id)
      if (component) {
        editorStore.updateComponent(id, {
          x: (dragState.value.componentStartX || component.x) + deltaX,
          y: (dragState.value.componentStartY || component.y) + deltaY
        })
      }
    })
  } else if (dragState.value.dragType === 'resize') {
    // 缩放组件
    const selectedComponent = editorStore.getSelectedComponents[0]
    if (!selectedComponent) return
    
    const deltaX = pos.x - dragState.value.startX
    const deltaY = pos.y - dragState.value.startY
    const position = dragState.value.resizePosition
    
    let newX = dragState.value.componentStartX || selectedComponent.x
    let newY = dragState.value.componentStartY || selectedComponent.y
    let newWidth = dragState.value.originalWidth || selectedComponent.width
    let newHeight = dragState.value.originalHeight || selectedComponent.height
    
    // 根据缩放手柄位置计算新的尺寸和位置
    switch (position) {
      case 'nw': // 左上角
        newX += deltaX
        newY += deltaY
        newWidth -= deltaX
        newHeight -= deltaY
        break
      case 'n': // 上边
        newY += deltaY
        newHeight -= deltaY
        break
      case 'ne': // 右上角
        newY += deltaY
        newWidth += deltaX
        newHeight -= deltaY
        break
      case 'e': // 右边
        newWidth += deltaX
        break
      case 'se': // 右下角
        newWidth += deltaX
        newHeight += deltaY
        break
      case 's': // 下边
        newHeight += deltaY
        break
      case 'sw': // 左下角
        newX += deltaX
        newWidth -= deltaX
        newHeight += deltaY
        break
      case 'w': // 左边
        newX += deltaX
        newWidth -= deltaX
        break
    }
    
    // 确保最小尺寸
    const minSize = 20
    if (newWidth < minSize) {
      if (position.includes('w')) newX -= minSize - newWidth
      newWidth = minSize
    }
    if (newHeight < minSize) {
      if (position.includes('n')) newY -= minSize - newHeight
      newHeight = minSize
    }
    
    // 更新组件
    editorStore.updateComponent(selectedComponent.id, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight
    })
  }
}

const handleCanvasMouseUp = () => {
  if (dragState.value.dragType === 'selection' && selectionBox.value.visible) {
    // 选择框内的组件
    const box = selectionBox.value
    const left = Math.min(box.x, box.x + box.width)
    const top = Math.min(box.y, box.y + box.height)
    const right = Math.max(box.x, box.x + box.width)
    const bottom = Math.max(box.y, box.y + box.height)
    
    editorStore.components.forEach(comp => {
      if (comp.x >= left && comp.y >= top && 
          comp.x + comp.width <= right && comp.y + comp.height <= bottom) {
        editorStore.selectComponent(comp.id, true)
      }
    })
  }
  
  // 重置状态
  dragState.value.isDragging = false
  selectionBox.value.visible = false
}

// 组件事件
const handleComponentMouseDown = (id: string, event: MouseEvent) => {
  event.stopPropagation()
  
  if (!editorStore.selectedComponents.includes(id)) {
    editorStore.selectComponent(id, event.ctrlKey)
  }
  
  // 开始拖拽组件
  const pos = getCanvasPosition(event)
  const component = editorStore.components.find(comp => comp.id === id)
  if (component) {
    dragState.value = {
      isDragging: true,
      dragType: 'component',
      startX: pos.x,
      startY: pos.y,
      currentX: pos.x,
      currentY: pos.y,
      componentStartX: component.x,
      componentStartY: component.y
    }
  }
}

const handleComponentClick = (id: string, event: MouseEvent) => {
  event.stopPropagation()
  
  // 添加组件选择逻辑
  if (!editorStore.selectedComponents.includes(id)) {
    editorStore.selectComponent(id, event.ctrlKey)
  }
}

// 拖放事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  
  try {
    const componentData = JSON.parse(event.dataTransfer!.getData('application/json'))
    const pos = getCanvasPosition(event)
    
    // 确保 componentData 有效
    if (!componentData || !componentData.id) {
      console.error('Invalid component data:', componentData)
      return
    }
    
    // 创建新组件
    const newComponent: Component = {
      id: `${componentData.id}_${Date.now()}`,
      type: componentData.id,
      name: componentData.name || 'Unknown Component',
      x: pos.x - (componentData.defaultProps?.width || 100) / 2,
      y: pos.y - (componentData.defaultProps?.height || 100) / 2,
      width: componentData.defaultProps?.width || 100,
      height: componentData.defaultProps?.height || 100,
      zIndex: editorStore.components.length + 1,
      locked: false,
      visible: true,
      props: { ...componentData.defaultProps } || {},
      style: {}
    }
    
    // 使用 nextTick 确保 DOM 更新完成
    nextTick(() => {
      editorStore.addComponent(newComponent)
      editorStore.selectComponent(newComponent.id)
    })
  } catch (error) {
    console.error('Failed to parse dropped component:', error)
  }
}

// 缩放事件
// 修改缩放事件处理函数
const handleResizeStart = (position: string, event: MouseEvent) => {
  event.stopPropagation()
  
  const selectedComponent = editorStore.getSelectedComponents[0]
  if (!selectedComponent) return
  
  const pos = getCanvasPosition(event)
  
  // 设置拖拽状态为缩放
  dragState.value = {
    isDragging: true,
    dragType: 'resize',
    startX: pos.x,
    startY: pos.y,
    currentX: pos.x,
    currentY: pos.y,
    componentStartX: selectedComponent.x,
    componentStartY: selectedComponent.y,
    resizePosition: position,
    originalWidth: selectedComponent.width,
    originalHeight: selectedComponent.height
  }
}

// 旋转事件
const handleRotateStart = (event: MouseEvent) => {
  event.stopPropagation()
  // TODO: 实现旋转功能
  console.log('开始旋转')
}

// 滚动事件
const handleScroll = () => {
  // TODO: 更新标尺位置
}

// 键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  // 方向键移动组件
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
    
    const step = event.shiftKey ? 10 : 1
    const deltaX = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
    const deltaY = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
    
    editorStore.selectedComponents.forEach(id => {
      const component = editorStore.components.find(comp => comp.id === id)
      if (component) {
        editorStore.updateComponent(id, {
          x: component.x + deltaX,
          y: component.y + deltaY
        })
      }
    })
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.canvas-container {
  background: radial-gradient(circle at 50% 50%, #1f2937 0%, #111827 100%);
}

.selection-box {
  border-style: dashed;
}

.resize-handle {
  border-radius: 1px;
}

.cursor-nw-resize { cursor: nw-resize; }
.cursor-n-resize { cursor: n-resize; }
.cursor-ne-resize { cursor: ne-resize; }
.cursor-e-resize { cursor: e-resize; }
.cursor-se-resize { cursor: se-resize; }
.cursor-s-resize { cursor: s-resize; }
.cursor-sw-resize { cursor: sw-resize; }
.cursor-w-resize { cursor: w-resize; }
</style>

// 提供编辑器模式给子组件
import { provide } from 'vue'

provide('editorMode', computed(() => editorStore.mode))

// 修改DragState类型定义，添加缩放相关属性
// 在types/canvas.ts中添加：
export interface DragState {
  isDragging: boolean
  dragType: 'component' | 'selection' | 'resize' | 'rotate'
  startX: number
  startY: number
  currentX: number
  currentY: number
  componentStartX?: number
  componentStartY?: number
  resizePosition?: string  // 添加缩放位置
  originalWidth?: number   // 添加原始宽度
  originalHeight?: number  // 添加原始高度
}