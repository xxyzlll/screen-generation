<template>
  <div class="filter-control p-4 bg-dark-surface rounded-lg border border-dark-border">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-white">数据筛选</h3>
      <button @click="resetFilters" class="text-xs text-tech-coral hover:text-white">
        重置
      </button>
    </div>
    
    <div class="space-y-3">
      <!-- 时间范围筛选 -->>
      <div>
        <label class="block text-xs text-gray-400 mb-1">时间范围</label>
        <select v-model="filters.timeRange" class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs">
          <option value="1h">最近1小时</option>
          <option value="24h">最近24小时</option>
          <option value="7d">最近7天</option>
          <option value="30d">最近30天</option>
        </select>
      </div>
      
      <!-- 数据类型筛选 -->
      <div>
        <label class="block text-xs text-gray-400 mb-1">数据类型</label>
        <div class="space-y-1">
          <label v-for="type in dataTypes" :key="type.value" class="flex items-center text-xs">
            <input 
              type="checkbox" 
              :value="type.value" 
              v-model="filters.dataTypes"
              class="mr-2 rounded border-dark-border bg-dark-bg"
            >
            <span class="text-white">{{ type.label }}</span>
          </label>
        </div>
      </div>
      
      <!-- 数值范围 -->
      <div>
        <label class="block text-xs text-gray-400 mb-1">数值范围</label>
        <div class="flex space-x-2">
          <input 
            v-model.number="filters.valueRange.min"
            type="number"
            placeholder="最小值"
            class="flex-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs"
          >
          <input 
            v-model.number="filters.valueRange.max"
            type="number"
            placeholder="最大值"
            class="flex-1 px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['filter-change'])

const filters = ref({
  timeRange: '24h',
  dataTypes: [],
  valueRange: { min: null, max: null }
})

const dataTypes = [
  { value: 'sales', label: '销售数据' },
  { value: 'traffic', label: '流量数据' },
  { value: 'user', label: '用户数据' },
  { value: 'system', label: '系统数据' }
]

const resetFilters = () => {
  filters.value = {
    timeRange: '24h',
    dataTypes: [],
    valueRange: { min: null, max: null }
  }
}

watch(filters, (newFilters) => {
  emit('filter-change', newFilters)
}, { deep: true })
</script>