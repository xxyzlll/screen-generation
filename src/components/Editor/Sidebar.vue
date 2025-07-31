<template>
  <div class="sidebar bg-gray-800 h-full flex flex-col">
    <!-- 标题 -->
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-white font-semibold">组件库</h2>
    </div>
    
    <!-- 搜索框 -->
    <div class="p-4 border-b border-gray-700">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="搜索组件..."
        class="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
      >
    </div>
    
    <!-- 组件分类 -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="category in filteredCategories" 
        :key="category.key"
        class="border-b border-gray-700 last:border-b-0"
      >
        <!-- 分类标题 -->
        <button 
          @click="toggleCategory(category.key)"
          class="w-full p-4 text-left text-white hover:bg-gray-700 transition-colors flex items-center justify-between"
        >
          <span class="font-medium">{{ category.label }}</span>
          <svg 
            :class="[
              'w-4 h-4 transition-transform',
              expandedCategories.includes(category.key) ? 'rotate-90' : ''
            ]"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- 组件列表 -->
        <div 
          v-show="expandedCategories.includes(category.key)"
          class="pb-2"
        >
          <div 
            v-for="component in getFilteredComponents(category.key)" 
            :key="component.id"
            :draggable="true"
            @dragstart="handleDragStart(component, $event)"
            @dragend="handleDragEnd"
            class="mx-2 mb-2 p-3 bg-gray-700 rounded cursor-move hover:bg-gray-600 transition-colors group"
          >
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{{ component.icon }}</span>
              <div class="flex-1 min-w-0">
                <div class="text-white font-medium text-sm">{{ component.name }}</div>
                <div class="text-gray-400 text-xs truncate">{{ component.description }}</div>
              </div>
            </div>
            
            <!-- 拖拽提示 -->
            <div class="mt-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              拖拽到画布添加组件
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useComponentsStore } from '../../stores/components'
import type { ComponentLibraryItem } from '../../types/component'

const componentsStore = useComponentsStore()

const searchQuery = ref('')
const expandedCategories = ref<string[]>(['charts']) // 默认展开图表分类

// 过滤后的分类
const filteredCategories = computed(() => {
  return componentsStore.getCategories.filter(category => {
    const components = getFilteredComponents(category.key)
    return components.length > 0
  })
})

// 获取过滤后的组件
const getFilteredComponents = (category: string) => {
  const components = componentsStore.getComponentsByCategory(category)
  if (!searchQuery.value) return components
  
  return components.filter(comp => 
    comp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

// 切换分类展开状态
const toggleCategory = (category: string) => {
  const index = expandedCategories.value.indexOf(category)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(category)
  }
}

// 拖拽开始
const handleDragStart = (component: ComponentLibraryItem, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(component))
    event.dataTransfer.effectAllowed = 'copy'
  }
  
  componentsStore.setDraggingComponent(component)
  
  // 添加拖拽样式
  const target = event.target as HTMLElement
  target.style.opacity = '0.5'
}

// 拖拽结束
const handleDragEnd = (event: DragEvent) => {
  componentsStore.setDraggingComponent(null)
  
  // 恢复样式
  const target = event.target as HTMLElement
  target.style.opacity = '1'
}

onMounted(() => {
  // 默认展开所有分类
  expandedCategories.value = componentsStore.getCategories.map(cat => cat.key)
})
</script>

<style scoped>
.sidebar {
  min-width: 256px;
}
</style>