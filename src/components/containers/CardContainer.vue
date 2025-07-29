<template>
  <div 
    class="card-container"
    :class="{
      'selected': isSelected,
      'dragging': isDragging,
      'resizing': isResizing
    }"
    :style="containerStyle"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <!-- 卡片头部 -->
    <div v-if="showHeader" class="card-header">
      <div class="card-title">
        <slot name="title">
          <h3>{{ title }}</h3>
        </slot>
      </div>
      <div class="card-actions">
        <slot name="actions">
          <button v-if="collapsible" @click="toggleCollapse" class="action-btn">
            {{ collapsed ? '展开' : '收起' }}
          </button>
          <button v-if="closable" @click="handleClose" class="action-btn close-btn">
            ✕
          </button>
        </slot>
      </div>
    </div>
    
    <!-- 卡片内容 -->
    <div 
      v-show="!collapsed"
      class="card-content"
      :style="contentStyle"
    >
      <slot></slot>
    </div>
    
    <!-- 调整大小手柄 -->
    <div v-if="resizable && isSelected" class="resize-handles">
      <div class="resize-handle resize-handle-nw" @mousedown="startResize('nw')"></div>
      <div class="resize-handle resize-handle-ne" @mousedown="startResize('ne')"></div>
      <div class="resize-handle resize-handle-sw" @mousedown="startResize('sw')"></div>
      <div class="resize-handle resize-handle-se" @mousedown="startResize('se')"></div>
      <div class="resize-handle resize-handle-n" @mousedown="startResize('n')"></div>
      <div class="resize-handle resize-handle-s" @mousedown="startResize('s')"></div>
      <div class="resize-handle resize-handle-w" @mousedown="startResize('w')"></div>
      <div class="resize-handle resize-handle-e" @mousedown="startResize('e')"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '卡片标题'
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  size: {
    type: Object,
    default: () => ({ width: 300, height: 200 })
  },
  style: {
    type: Object,
    default: () => ({})
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  collapsible: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: false
  },
  resizable: {
    type: Boolean,
    default: true
  },
  draggable: {
    type: Boolean,
    default: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:position', 'update:size', 'select', 'close', 'collapse'])

const collapsed = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })
const resizeDirection = ref('')

const containerStyle = computed(() => ({
  position: 'absolute',
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  width: `${props.size.width}px`,
  height: collapsed.value ? 'auto' : `${props.size.height}px`,
  zIndex: props.isSelected ? 1000 : 1,
  ...props.style
}))

const contentStyle = computed(() => ({
  height: props.showHeader ? `calc(100% - 40px)` : '100%',
  overflow: 'auto'
}))

const handleClick = (e) => {
  e.stopPropagation()
  emit('select', props.id)
}

const handleClose = () => {
  emit('close', props.id)
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  emit('collapse', { id: props.id, collapsed: collapsed.value })
}

const handleMouseDown = (e) => {
  if (!props.draggable || e.target.classList.contains('resize-handle')) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - props.position.x,
    y: e.clientY - props.position.y
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (isDragging.value) {
    const newPosition = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    }
    emit('update:position', newPosition)
  } else if (isResizing.value) {
    handleResize(e)
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const startResize = (direction) => {
  isResizing.value = true
  resizeDirection.value = direction
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: props.size.width,
    height: props.size.height
  }
  event.stopPropagation()
}

const handleResize = (e) => {
  const deltaX = e.clientX - resizeStart.value.x
  const deltaY = e.clientY - resizeStart.value.y
  
  let newWidth = resizeStart.value.width
  let newHeight = resizeStart.value.height
  let newX = props.position.x
  let newY = props.position.y
  
  const direction = resizeDirection.value
  
  if (direction.includes('e')) {
    newWidth = Math.max(100, resizeStart.value.width + deltaX)
  }
  if (direction.includes('w')) {
    newWidth = Math.max(100, resizeStart.value.width - deltaX)
    newX = props.position.x + deltaX
  }
  if (direction.includes('s')) {
    newHeight = Math.max(80, resizeStart.value.height + deltaY)
  }
  if (direction.includes('n')) {
    newHeight = Math.max(80, resizeStart.value.height - deltaY)
    newY = props.position.y + deltaY
  }
  
  emit('update:size', { width: newWidth, height: newHeight })
  if (newX !== props.position.x || newY !== props.position.y) {
    emit('update:position', { x: newX, y: newY })
  }
}
</script>

<style scoped>
.card-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: move;
  overflow: hidden;
}

.card-container:hover {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
}

.card-container.selected {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.card-container.dragging {
  opacity: 0.8;
  transform: rotate(2deg);
  z-index: 1001;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  min-height: 40px;
}

.card-title h3 {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(139, 92, 246, 0.4);
  border-color: #8b5cf6;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.4);
  border-color: #ef4444;
}

.card-content {
  padding: 16px;
  color: #ffffff;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  background: #8b5cf6;
  border: 1px solid #ffffff;
  pointer-events: all;
  opacity: 0.8;
}

.resize-handle-nw {
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}

.resize-handle-ne {
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}

.resize-handle-sw {
  bottom: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}

.resize-handle-se {
  bottom: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}

.resize-handle-n {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  cursor: n-resize;
}

.resize-handle-s {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  cursor: s-resize;
}

.resize-handle-w {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  cursor: w-resize;
}

.resize-handle-e {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  cursor: e-resize;
}
</style>