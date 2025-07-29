<template>
  <div 
    class="section-container"
    :class="{
      'selected': isSelected,
      'dragging': isDragging,
      [`layout-${layout}`]: true
    }"
    :style="containerStyle"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <!-- 分区头部 -->
    <div v-if="showHeader" class="section-header">
      <div class="section-title">
        <slot name="title">
          <h2>{{ title }}</h2>
        </slot>
      </div>
      <div class="section-controls">
        <button @click="toggleLayout" class="control-btn">
          {{ layout === 'horizontal' ? '垂直布局' : '水平布局' }}
        </button>
      </div>
    </div>
    
    <!-- 分区内容 -->
    <div class="section-content" :style="contentStyle">
      <div 
        v-for="(section, index) in sections"
        :key="index"
        class="section-item"
        :class="{ 'active': activeSection === index }"
        :style="getSectionStyle(index)"
        @click="setActiveSection(index)"
      >
        <div class="section-item-header" v-if="section.title">
          <h4>{{ section.title }}</h4>
          <button @click="removeSection(index)" class="remove-btn">✕</button>
        </div>
        <div class="section-item-content">
          <slot :name="`section-${index}`" :section="section" :index="index">
            <div class="drop-zone" @drop="handleDrop($event, index)" @dragover.prevent>
              <p>拖拽组件到此区域</p>
            </div>
          </slot>
        </div>
        
        <!-- 分割线 -->
        <div 
          v-if="index < sections.length - 1"
          class="section-divider"
          :class="{ 'horizontal': layout === 'horizontal', 'vertical': layout === 'vertical' }"
          @mousedown="startResize(index)"
        ></div>
      </div>
    </div>
    
    <!-- 添加分区按钮 -->
    <div class="add-section-btn" @click="addSection">
      <span>+ 添加分区</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: '分区容器'
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  size: {
    type: Object,
    default: () => ({ width: 600, height: 400 })
  },
  style: {
    type: Object,
    default: () => ({})
  },
  layout: {
    type: String,
    default: 'horizontal', // horizontal, vertical
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  sections: {
    type: Array,
    default: () => [
      { title: '分区 1', flex: 1 },
      { title: '分区 2', flex: 1 }
    ]
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:position', 
  'update:size', 
  'update:layout', 
  'update:sections',
  'select', 
  'section-drop'
])

const isDragging = ref(false)
const activeSection = ref(0)
const dragStart = ref({ x: 0, y: 0 })

const containerStyle = computed(() => ({
  position: 'absolute',
  left: `${props.position.x}px`,
  top: `${props.position.y}px`,
  width: `${props.size.width}px`,
  height: `${props.size.height}px`,
  zIndex: props.isSelected ? 1000 : 1,
  ...props.style
}))

const contentStyle = computed(() => ({
  display: 'flex',
  flexDirection: props.layout === 'horizontal' ? 'row' : 'column',
  height: props.showHeader ? 'calc(100% - 60px)' : 'calc(100% - 40px)',
  gap: '2px'
}))

const getSectionStyle = (index) => {
  const section = props.sections[index]
  return {
    flex: section.flex || 1,
    minWidth: props.layout === 'horizontal' ? '100px' : 'auto',
    minHeight: props.layout === 'vertical' ? '80px' : 'auto'
  }
}

const handleClick = (e) => {
  e.stopPropagation()
  emit('select', props.id)
}

const handleMouseDown = (e) => {
  if (e.target.classList.contains('section-divider')) return
  
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
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const toggleLayout = () => {
  const newLayout = props.layout === 'horizontal' ? 'vertical' : 'horizontal'
  emit('update:layout', newLayout)
}

const addSection = () => {
  const newSections = [...props.sections, {
    title: `分区 ${props.sections.length + 1}`,
    flex: 1
  }]
  emit('update:sections', newSections)
}

const removeSection = (index) => {
  if (props.sections.length <= 1) return
  
  const newSections = props.sections.filter((_, i) => i !== index)
  emit('update:sections', newSections)
  
  if (activeSection.value >= newSections.length) {
    activeSection.value = newSections.length - 1
  }
}

const setActiveSection = (index) => {
  activeSection.value = index
}

const handleDrop = (e, sectionIndex) => {
  e.preventDefault()
  const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
  emit('section-drop', { sectionIndex, componentData })
}

const startResize = (index) => {
  // 实现分区大小调整逻辑
  console.log('开始调整分区大小:', index)
}
</script>

<style scoped>
.section-container {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: move;
  overflow: hidden;
}

.section-container:hover {
  border-color: rgba(139, 92, 246, 0.6);
}

.section-container.selected {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}

.section-container.dragging {
  opacity: 0.8;
  transform: rotate(1deg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.section-title h2 {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.control-btn {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(139, 92, 246, 0.4);
}

.section-content {
  padding: 8px;
}

.section-item {
  position: relative;
  background: rgba(42, 42, 42, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.section-item:hover {
  border-color: rgba(139, 92, 246, 0.4);
}

.section-item.active {
  border-color: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

.section-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(139, 92, 246, 0.1);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.section-item-header h4 {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.remove-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.4);
}

.section-item-content {
  padding: 12px;
  height: calc(100% - 40px);
}

.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 80px;
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
}

.drop-zone:hover {
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(139, 92, 246, 0.05);
}

.section-divider {
  position: absolute;
  background: #8b5cf6;
  cursor: col-resize;
  z-index: 10;
}

.section-divider.horizontal {
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
}

.section-divider.vertical {
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  cursor: row-resize;
}

.add-section-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-section-btn:hover {
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
}
</style>