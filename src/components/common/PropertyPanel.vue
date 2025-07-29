<template>
  <div class="property-panel h-full flex flex-col">
    <!-- 标题 -->
    <div class="p-4 border-b border-dark-border">
      <h2 class="text-lg font-semibold text-white">属性面板</h2>
    </div>
    
    <div v-if="selectedComponent" class="flex-1 overflow-y-auto">
      <!-- 组件信息 -->
      <div class="p-4 border-b border-dark-border">
        <h3 class="text-sm font-medium text-tech-blue mb-3">组件信息</h3>
        <div class="text-xs text-gray-400">
          <p>类型: {{ selectedComponent.type }}</p>
          <p>ID: {{ selectedComponent.id }}</p>
        </div>
      </div>
      
      <!-- 基础属性 -->
      <div class="p-4 border-b border-dark-border">
        <h3 class="text-sm font-medium text-tech-blue mb-3">基础属性</h3>
        
        <!-- 位置 -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">X坐标</label>
            <input 
              v-model.number="position.x"
              type="number"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updatePosition"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">Y坐标</label>
            <input 
              v-model.number="position.y"
              type="number"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updatePosition"
            >
          </div>
        </div>
        
        <!-- 尺寸 -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">宽度</label>
            <input 
              v-model.number="size.width"
              type="number"
              min="10"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateSize"
            >
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">高度</label>
            <input 
              v-model.number="size.height"
              type="number"
              min="10"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateSize"
            >
          </div>
        </div>
        
        <!-- 层级 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">层级</label>
          <input 
            v-model.number="zIndex"
            type="number"
            min="0"
            class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
            @input="updateZIndex"
          >
        </div>
      </div>
      
      <!-- 样式属性 -->
      <div class="p-4 border-b border-dark-border">
        <h3 class="text-sm font-medium text-tech-blue mb-3">样式属性</h3>
        
        <!-- 背景颜色 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">背景颜色</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="style.backgroundColor"
              type="color"
              class="w-12 h-8 rounded border border-dark-border"
              @input="updateStyle"
            >
            <input 
              v-model="style.backgroundColor"
              type="text"
              placeholder="#ffffff"
              class="flex-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateStyle"
            >
          </div>
        </div>
        
        <!-- 文字颜色 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">文字颜色</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="style.color"
              type="color"
              class="w-12 h-8 rounded border border-dark-border"
              @input="updateStyle"
            >
            <input 
              v-model="style.color"
              type="text"
              placeholder="#000000"
              class="flex-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateStyle"
            >
          </div>
        </div>
        
        <!-- 透明度 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">透明度</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model.number="style.opacity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              class="flex-1"
              @input="updateStyle"
            >
            <span class="text-xs text-gray-400 w-8">{{ style.opacity }}</span>
          </div>
        </div>
        
        <!-- 边框 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">边框宽度</label>
          <input 
            v-model.number="style.borderWidth"
            type="number"
            min="0"
            class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
            @input="updateStyle"
          >
        </div>
        
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">边框颜色</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="style.borderColor"
              type="color"
              class="w-12 h-8 rounded border border-dark-border"
              @input="updateStyle"
            >
            <input 
              v-model="style.borderColor"
              type="text"
              placeholder="#cccccc"
              class="flex-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateStyle"
            >
          </div>
        </div>
        
        <!-- 圆角 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">圆角半径</label>
          <input 
            v-model.number="style.borderRadius"
            type="number"
            min="0"
            class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
            @input="updateStyle"
          >
        </div>
        
        <!-- 阴影 -->
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">阴影</label>
          <input 
            v-model="style.boxShadow"
            type="text"
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
            class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
            @input="updateStyle"
          >
        </div>
      </div>
      
      <!-- 数据配置 -->
      <div class="p-4 border-b border-dark-border">
        <h3 class="text-sm font-medium text-tech-blue mb-3">数据配置</h3>
        
        <div class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">数据源类型</label>
          <select 
            v-model="dataSource.type"
            class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
            @change="updateDataSource"
          >
            <option value="static">静态数据</option>
            <option value="api">API接口</option>
            <option value="websocket">WebSocket</option>
            <option value="csv">CSV文件</option>
          </select>
        </div>
        
        <div v-if="dataSource.type === 'api'" class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">API地址</label>
            <input 
              v-model="dataSource.url"
              type="text"
              placeholder="https://api.example.com/data"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateDataSource"
            >
          </div>
          
          <div>
            <label class="block text-xs text-gray-400 mb-1">刷新间隔(秒)</label>
            <input 
              v-model.number="dataSource.refreshInterval"
              type="number"
              min="1"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateDataSource"
            >
          </div>
          
          <div>
            <label class="block text-xs text-gray-400 mb-1">请求方法</label>
            <select 
              v-model="dataSource.method"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @change="updateDataSource"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>
        </div>
        
        <div v-if="dataSource.type === 'websocket'" class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">WebSocket地址</label>
            <input 
              v-model="dataSource.url"
              type="text"
              placeholder="ws://localhost:8080/ws"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateDataSource"
            >
          </div>
        </div>
        
        <div v-if="dataSource.type === 'static'" class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">静态数据 (JSON格式)</label>
            <textarea 
              v-model="dataSource.data"
              rows="4"
              placeholder='{"data": [1, 2, 3, 4, 5]}'
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateDataSource"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- 动画配置 -->
      <div class="p-4">
        <h3 class="text-sm font-medium text-tech-blue mb-3">动画配置</h3>
        
        <div class="mb-3">
          <label class="flex items-center space-x-2">
            <input 
              v-model="animation.enabled"
              type="checkbox"
              class="rounded border-dark-border"
              @change="updateAnimation"
            >
            <span class="text-sm text-white">启用动画</span>
          </label>
        </div>
        
        <div v-if="animation.enabled" class="space-y-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">动画类型</label>
            <select 
              v-model="animation.type"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @change="updateAnimation"
            >
              <option value="fadeIn">淡入</option>
              <option value="slideIn">滑入</option>
              <option value="zoomIn">缩放</option>
              <option value="bounce">弹跳</option>
              <option value="rotateIn">旋转</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs text-gray-400 mb-1">动画时长(ms)</label>
            <input 
              v-model.number="animation.duration"
              type="number"
              min="100"
              max="5000"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateAnimation"
            >
          </div>
          
          <div>
            <label class="block text-xs text-gray-400 mb-1">延迟时间(ms)</label>
            <input 
              v-model.number="animation.delay"
              type="number"
              min="0"
              class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-sm"
              @input="updateAnimation"
            >
          </div>
        </div>
      </div>
    </div>
    
    <!-- 未选中状态 --> 
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm">选择一个组件</p>
        <p class="text-xs mt-1">在画布中点击组件来编辑属性</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCanvasStore } from '@stores/canvas' // 修复导入路径

const canvasStore = useCanvasStore()

// 获取选中的组件
const selectedComponent = computed(() => {
  return canvasStore.selectedComponent ? canvasStore.components.find(c => c.id === canvasStore.selectedComponent) : null
})

// 默认值定义
const defaultPosition = { x: 0, y: 0 }
const defaultSize = { width: 200, height: 150 }
const defaultStyle = {
  backgroundColor: '#ffffff',
  color: '#000000',
  opacity: 1,
  borderWidth: 0,
  borderColor: '#cccccc',
  borderRadius: 0,
  boxShadow: ''
}
const defaultDataSource = {
  type: 'static',
  url: '',
  refreshInterval: 30,
  method: 'GET',
  data: '{}'
}
const defaultAnimation = {
  enabled: false,
  type: 'fadeIn',
  duration: 1000,
  delay: 0
}

// 响应式属性
const position = ref({ ...defaultPosition })
const size = ref({ ...defaultSize })
const zIndex = ref(1)
const style = ref({ ...defaultStyle })
const dataSource = ref({ ...defaultDataSource })
const animation = ref({ ...defaultAnimation })

// 监听选中组件变化，更新本地数据
watch(selectedComponent, (newComponent) => {
  if (newComponent) {
    // 更新位置
    position.value = { ...defaultPosition, ...newComponent.position }
    
    // 更新尺寸
    size.value = { ...defaultSize, ...newComponent.size }
    
    // 更新层级
    zIndex.value = newComponent.zIndex || 1
    
    // 更新样式
    style.value = { ...defaultStyle, ...newComponent.style }
    
    // 更新数据源
    dataSource.value = { ...defaultDataSource, ...newComponent.dataSource }
    
    // 更新动画
    animation.value = { ...defaultAnimation, ...newComponent.animation }
  }
}, { immediate: true })

// 更新组件的通用方法
const updateComponent = (updates) => {
  if (selectedComponent.value) {
    canvasStore.updateComponent(selectedComponent.value.id, updates)
  }
}

// 更新位置
const updatePosition = () => {
  updateComponent({ position: { ...position.value } })
}

// 更新尺寸
const updateSize = () => {
  updateComponent({ size: { ...size.value } })
}

// 更新层级
const updateZIndex = () => {
  updateComponent({ zIndex: zIndex.value })
}

// 更新样式
const updateStyle = () => {
  updateComponent({ style: { ...style.value } })
}

// 更新数据源
const updateDataSource = () => {
  updateComponent({ dataSource: { ...dataSource.value } })
}

// 更新动画
const updateAnimation = () => {
  updateComponent({ animation: { ...animation.value } })
}
</script>

<style scoped>
.property-panel {
  background: var(--dark-surface);
  border-left: 1px solid var(--dark-border);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--tech-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--dark-border);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--tech-blue);
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--tech-blue);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>