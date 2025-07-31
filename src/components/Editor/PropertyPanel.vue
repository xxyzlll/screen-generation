<template>
  <div class="property-panel bg-gray-800 h-full flex flex-col">
    <!-- 标题 -->
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-white font-semibold">
        {{ selectedComponents.length > 0 ? '属性设置' : '未选择组件' }}
      </h2>
      <p v-if="selectedComponents.length > 1" class="text-gray-400 text-sm mt-1">
        已选择 {{ selectedComponents.length }} 个组件
      </p>
    </div>
    
    <!-- 属性内容 -->
    <div v-if="selectedComponents.length > 0" class="flex-1 overflow-y-auto">
      <!-- 基础属性 -->
      <div class="p-4 border-b border-gray-700">
        <h3 class="text-white font-medium mb-3">基础属性</h3>
        
        <!-- 位置和尺寸 -->
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-gray-400 text-xs mb-1">X 坐标</label>
              <input 
                v-model.number="basicProps.x"
                type="number"
                class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateBasicProps"
              >
            </div>
            <div>
              <label class="block text-gray-400 text-xs mb-1">Y 坐标</label>
              <input 
                v-model.number="basicProps.y"
                type="number"
                class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateBasicProps"
              >
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-gray-400 text-xs mb-1">宽度</label>
              <input 
                v-model.number="basicProps.width"
                type="number"
                min="1"
                class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateBasicProps"
              >
            </div>
            <div>
              <label class="block text-gray-400 text-xs mb-1">高度</label>
              <input 
                v-model.number="basicProps.height"
                type="number"
                min="1"
                class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateBasicProps"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs mb-1">层级</label>
            <input 
              v-model.number="basicProps.zIndex"
              type="number"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateBasicProps"
            >
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                v-model="basicProps.visible"
                type="checkbox"
                class="text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                @change="updateBasicProps"
              >
              <span class="text-gray-400 text-sm">可见</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input 
                v-model="basicProps.locked"
                type="checkbox"
                class="text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                @change="updateBasicProps"
              >
              <span class="text-gray-400 text-sm">锁定</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 样式属性 -->
      <div class="p-4 border-b border-gray-700">
        <h3 class="text-white font-medium mb-3">样式属性</h3>
        
        <div class="space-y-3">
          <!-- 背景颜色 -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">背景颜色</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="styleProps.backgroundColor"
                type="color"
                class="w-8 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                @change="updateStyleProps"
              >
              <input 
                v-model="styleProps.backgroundColor"
                type="text"
                class="flex-1 px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateStyleProps"
              >
            </div>
          </div>
          
          <!-- 透明度 -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">透明度</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model.number="styleProps.opacity"
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="flex-1"
                @input="updateStyleProps"
              >
              <span class="text-gray-400 text-sm w-8">{{ styleProps.opacity }}</span>
            </div>
          </div>
          
          <!-- 边框 -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">边框宽度</label>
            <input 
              v-model.number="styleProps.borderWidth"
              type="number"
              min="0"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateStyleProps"
            >
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs mb-1">边框颜色</label>
            <div class="flex items-center space-x-2">
              <input 
                v-model="styleProps.borderColor"
                type="color"
                class="w-8 h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                @change="updateStyleProps"
              >
              <input 
                v-model="styleProps.borderColor"
                type="text"
                class="flex-1 px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                @change="updateStyleProps"
              >
            </div>
          </div>
          
          <!-- 圆角 -->
          <div>
            <label class="block text-gray-400 text-xs mb-1">圆角</label>
            <input 
              v-model.number="styleProps.borderRadius"
              type="number"
              min="0"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateStyleProps"
            >
          </div>
        </div>
      </div>
      
      <!-- 组件特定属性 -->
      <div v-if="selectedComponent" class="p-4 border-b border-gray-700">
        <h3 class="text-white font-medium mb-3">组件属性</h3>
        
        <!-- 图表组件属性 -->
        <div v-if="isChartComponent" class="space-y-3">
          <div>
            <label class="block text-gray-400 text-xs mb-1">图表标题</label>
            <input 
              v-model="componentProps.title"
              type="text"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateComponentProps"
            >
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs mb-1">主题色彩</label>
            <select 
              v-model="componentProps.theme"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateComponentProps"
            >
              <option value="tech">科技蓝</option>
              <option value="purple">紫色渐变</option>
              <option value="green">绿色系</option>
              <option value="orange">橙色系</option>
            </select>
          </div>
          
          <div>
            <label class="flex items-center space-x-2">
              <input 
                v-model="componentProps.animation"
                type="checkbox"
                class="text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                @change="updateComponentProps"
              >
              <span class="text-gray-400 text-sm">启用动画</span>
            </label>
          </div>
        </div>
        
        <!-- 容器组件属性 -->
        <div v-else-if="isContainerComponent" class="space-y-3">
          <div>
            <label class="block text-gray-400 text-xs mb-1">容器类型</label>
            <select 
              v-model="componentProps.containerType"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateComponentProps"
            >
              <option value="normal">普通</option>
              <option value="tech">科技感</option>
              <option value="glass">玻璃质感</option>
              <option value="neon">霓虹效果</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs mb-1">内边距</label>
            <input 
              v-model.number="componentProps.padding"
              type="number"
              min="0"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateComponentProps"
            >
          </div>
        </div>
      </div>
      
      <!-- 数据配置 -->
      <div v-if="selectedComponent" class="p-4 border-b border-gray-700">
        <h3 class="text-white font-medium mb-3">数据配置</h3>
        
        <div class="space-y-3">
          <div>
            <label class="block text-gray-400 text-xs mb-1">数据源类型</label>
            <select 
              v-model="dataConfig.sourceType"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateDataConfig"
            >
              <option value="static">静态数据</option>
              <option value="api">API接口</option>
              <option value="websocket">WebSocket</option>
              <option value="file">文件导入</option>
            </select>
          </div>
          
          <div v-if="dataConfig.sourceType === 'api'">
            <label class="block text-gray-400 text-xs mb-1">API地址</label>
            <input 
              v-model="dataConfig.apiUrl"
              type="text"
              placeholder="https://api.example.com/data"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateDataConfig"
            >
          </div>
          
          <div v-if="dataConfig.sourceType === 'static'">
            <label class="block text-gray-400 text-xs mb-1">静态数据 (JSON)</label>
            <textarea 
              v-model="dataConfig.staticData"
              rows="4"
              placeholder='[{"name": "示例", "value": 100}]'
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              @change="updateDataConfig"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-gray-400 text-xs mb-1">刷新间隔 (秒)</label>
            <input 
              v-model.number="dataConfig.refreshInterval"
              type="number"
              min="0"
              class="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              @change="updateDataConfig"
            >
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <p>请选择一个组件</p>
        <p class="text-sm mt-1">在画布中点击组件来编辑其属性</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEditorStore } from '../../stores/editor'
import type { Component } from '../../types/component'

const editorStore = useEditorStore()

// 选中的组件
const selectedComponents = computed(() => editorStore.getSelectedComponents)
const selectedComponent = computed(() => selectedComponents.value[0])

// 组件类型判断
const isChartComponent = computed(() => {
  return selectedComponent.value?.type.includes('chart')
})

const isContainerComponent = computed(() => {
  return selectedComponent.value?.type.includes('container') || selectedComponent.value?.type.includes('box')
})

// 基础属性
const basicProps = ref({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  zIndex: 1,
  visible: true,
  locked: false
})

// 样式属性
const styleProps = ref({
  backgroundColor: '#ffffff',
  opacity: 1,
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 0
})

// 组件属性
const componentProps = ref({
  title: '',
  theme: 'tech',
  animation: true,
  containerType: 'normal',
  padding: 16
})

// 数据配置
const dataConfig = ref({
  sourceType: 'static',
  apiUrl: '',
  staticData: '',
  refreshInterval: 0
})

// 监听选中组件变化
watch(selectedComponent, (newComponent) => {
  if (newComponent) {
    // 更新基础属性
    basicProps.value = {
      x: newComponent.x,
      y: newComponent.y,
      width: newComponent.width,
      height: newComponent.height,
      zIndex: newComponent.zIndex,
      visible: newComponent.visible,
      locked: newComponent.locked
    }
    
    // 更新样式属性
    styleProps.value = {
      backgroundColor: newComponent.style?.backgroundColor || '#ffffff',
      opacity: newComponent.style?.opacity || 1,
      borderWidth: newComponent.style?.borderWidth || 0,
      borderColor: newComponent.style?.borderColor || '#000000',
      borderRadius: newComponent.style?.borderRadius || 0
    }
    
    // 更新组件属性
    componentProps.value = {
      title: newComponent.props?.title || '',
      theme: newComponent.props?.theme || 'tech',
      animation: newComponent.props?.animation !== false,
      containerType: newComponent.props?.containerType || 'normal',
      padding: newComponent.props?.padding || 16
    }
    
    // 更新数据配置
    dataConfig.value = {
      sourceType: newComponent.data?.sourceType || 'static',
      apiUrl: newComponent.data?.source?.url || '',
      staticData: JSON.stringify(newComponent.data?.source?.data || [], null, 2),
      refreshInterval: newComponent.data?.refreshInterval || 0
    }
  }
}, { immediate: true })

// 更新基础属性
const updateBasicProps = () => {
  if (!selectedComponent.value) return
  
  editorStore.updateComponent(selectedComponent.value.id, {
    x: basicProps.value.x,
    y: basicProps.value.y,
    width: basicProps.value.width,
    height: basicProps.value.height,
    zIndex: basicProps.value.zIndex,
    visible: basicProps.value.visible,
    locked: basicProps.value.locked
  })
}

// 更新样式属性
const updateStyleProps = () => {
  if (!selectedComponent.value) return
  
  const style = {
    ...selectedComponent.value.style,
    backgroundColor: styleProps.value.backgroundColor,
    opacity: styleProps.value.opacity,
    border: styleProps.value.borderWidth > 0 
      ? `${styleProps.value.borderWidth}px solid ${styleProps.value.borderColor}`
      : undefined,
    borderRadius: styleProps.value.borderRadius > 0 
      ? `${styleProps.value.borderRadius}px` 
      : undefined
  }
  
  editorStore.updateComponent(selectedComponent.value.id, { style })
}

// 更新组件属性
const updateComponentProps = () => {
  if (!selectedComponent.value) return
  
  const props = {
    ...selectedComponent.value.props,
    title: componentProps.value.title,
    theme: componentProps.value.theme,
    animation: componentProps.value.animation,
    containerType: componentProps.value.containerType,
    padding: componentProps.value.padding
  }
  
  editorStore.updateComponent(selectedComponent.value.id, { props })
}

// 更新数据配置
const updateDataConfig = () => {
  if (!selectedComponent.value) return
  
  let staticData
  try {
    staticData = dataConfig.value.staticData ? JSON.parse(dataConfig.value.staticData) : []
  } catch {
    staticData = []
  }
  
  const data = {
    sourceType: dataConfig.value.sourceType as any,
    source: {
      url: dataConfig.value.apiUrl,
      data: staticData
    },
    refreshInterval: dataConfig.value.refreshInterval
  }
  
  editorStore.updateComponent(selectedComponent.value.id, { data })
}
</script>

<style scoped>
.property-panel {
  min-width: 320px;
}
</style>