<template>
  <teleport to="body">
    <div 
      v-if="visible"
      class="modal-overlay"
      :class="{ 'fade-in': visible }"
      @click="handleOverlayClick"
    >
      <div 
        class="modal-container"
        :class="[
          `size-${size}`,
          { 'dragging': isDragging, 'fullscreen': isFullscreen }
        ]"
        :style="modalStyle"
        @click.stop
        @mousedown="handleMouseDown"
      >
        <!-- 模态框头部 -->
        <div class="modal-header" v-if="showHeader">
          <div class="modal-title">
            <slot name="title">
              <h3>{{ title }}</h3>
            </slot>
          </div>
          <div class="modal-actions">
            <button 
              v-if="maximizable" 
              @click="toggleFullscreen" 
              class="action-btn"
              :title="isFullscreen ? '还原' : '最大化'"
            >
              {{ isFullscreen ? '🗗' : '🗖' }}
            </button>
            <button 
              v-if="closable" 
              @click="handleClose" 
              class="action-btn close-btn"
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>
        
        <!-- 模态框内容 -->
        <div class="modal-content" :style="contentStyle">
          <slot></slot>
        </div>
        
        <!-- 模态框底部 -->
        <div class="modal-footer" v-if="showFooter">
          <slot name="footer">
            <div class="footer-actions">
              <button @click="handleCancel" class="btn btn-secondary">
                {{ cancelText }}
              </button>
              <button @click="handleConfirm" class="btn btn-primary">
                {{ confirmText }}
              </button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '弹窗标题'
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large, auto
    validator: (value) => ['small', 'medium', 'large', 'auto'].includes(value)
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  position: {
    type: Object,
    default: () => ({ x: null, y: null })
  },
  draggable: {
    type: Boolean,
    default: true
  },
  maximizable: {
    type: Boolean,
    default: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  zIndex: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'close'])

const isDragging = ref(false)
const isFullscreen = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const modalPosition = ref({ x: null, y: null })

const modalStyle = computed(() => {
  const style = {
    zIndex: props.zIndex
  }
  
  if (isFullscreen.value) {
    return {
      ...style,
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      transform: 'none'
    }
  }
  
  // 自定义尺寸
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  // 自定义位置
  if (modalPosition.value.x !== null && modalPosition.value.y !== null) {
    style.position = 'fixed'
    style.left = `${modalPosition.value.x}px`
    style.top = `${modalPosition.value.y}px`
    style.transform = 'none'
  } else if (props.position.x !== null && props.position.y !== null) {
    style.position = 'fixed'
    style.left = `${props.position.x}px`
    style.top = `${props.position.y}px`
    style.transform = 'none'
  }
  
  return style
})

const contentStyle = computed(() => ({
  height: props.showHeader && props.showFooter 
    ? 'calc(100% - 120px)' 
    : props.showHeader || props.showFooter 
    ? 'calc(100% - 60px)' 
    : '100%',
  overflow: 'auto'
}))

const handleOverlayClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const handleMouseDown = (e) => {
  if (!props.draggable || !props.showHeader || isFullscreen.value) return
  if (!e.target.closest('.modal-header')) return
  if (e.target.closest('.action-btn')) return
  
  isDragging.value = true
  const rect = e.currentTarget.getBoundingClientRect()
  dragStart.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (isDragging.value) {
    modalPosition.value = {
      x: e.clientX - dragStart.value.x,
      y: e.clientY - dragStart.value.y
    }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 监听 ESC 键关闭弹窗
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.visible && props.closable) {
    handleClose()
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      document.addEventListener('keydown', handleKeydown)
    })
  } else {
    document.removeEventListener('keydown', handleKeydown)
    modalPosition.value = { x: null, y: null }
    isFullscreen.value = false
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-overlay.fade-in {
  opacity: 1;
}

.modal-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.9));
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.modal-overlay.fade-in .modal-container {
  transform: scale(1);
}

.modal-container.dragging {
  cursor: move;
  user-select: none;
}

.modal-container.fullscreen {
  max-width: none;
  max-height: none;
  border-radius: 0;
}

.modal-container.size-small {
  width: 400px;
  min-height: 200px;
}

.modal-container.size-medium {
  width: 600px;
  min-height: 300px;
}

.modal-container.size-large {
  width: 800px;
  min-height: 400px;
}

.modal-container.size-auto {
  width: auto;
  height: auto;
  min-width: 300px;
  min-height: 150px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  cursor: move;
}

.modal-title h3 {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(139, 92, 246, 0.4);
  border-color: #8b5cf6;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.4);
  border-color: #ef4444;
}

.modal-content {
  padding: 20px;
  color: #ffffff;
}

.modal-footer {
  padding: 16px 20px;
  background: rgba(42, 42, 42, 0.5);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #ffffff;
  border-color: #8b5cf6;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #7c3aed, #db2777);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-secondary {
  background: rgba(139, 92, 246, 0.1);
  color: #ffffff;
  border-color: rgba(139, 92, 246, 0.4);
}

.btn-secondary:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
}
</style>