<template>
  <div class="data-filter p-4 bg-gray-800 rounded-lg border border-gray-600">
    <h4 class="text-white text-sm font-medium mb-3">数据筛选</h4>
    
    <div class="space-y-3">
      <!-- 时间范围筛选 -->
      <div>
        <label class="block text-xs text-gray-300 mb-1">时间范围</label>
        <select 
          v-model="filters.timeRange" 
          class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
          @change="handleFilterChange"
        >
          <option value="1h">最近1小时</option>
          <option value="24h">最近24小时</option>
          <option value="7d">最近7天</option>
          <option value="30d">最近30天</option>
        </select>
      </div>
      
      <!-- 数据类型筛选 -->
      <div>
        <label class="block text-xs text-gray-300 mb-1">数据类型</label>
        <div class="space-y-1">
          <label v-for="type in dataTypes" :key="type.value" class="flex items-center text-xs text-gray-300">
            <input 
              type="checkbox" 
              :value="type.value" 
              v-model="filters.dataTypes"
              class="mr-2 text-cyan-500"
              @change="handleFilterChange"
            />
            {{ type.label }}
          </label>
        </div>
      </div>
      
      <!-- 数值范围筛选 -->
      <div>
        <label class="block text-xs text-gray-300 mb-1">数值范围</label>
        <div class="flex space-x-2">
          <input 
            type="number" 
            v-model="filters.minValue" 
            placeholder="最小值"
            class="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            @input="handleFilterChange"
          />
          <input 
            type="number" 
            v-model="filters.maxValue" 
            placeholder="最大值"
            class="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
            @input="handleFilterChange"
          />
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex space-x-2">
      <button 
        @click="applyFilters" 
        class="flex-1 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs rounded transition-colors"
      >
        应用筛选
      </button>
      <button 
        @click="resetFilters" 
        class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FilterData {
  timeRange: string
  dataTypes: string[]
  minValue: number | null
  maxValue: number | null
}

const emit = defineEmits<{
  filterChange: [filters: FilterData]
}>()

const dataTypes = [
  { label: '销售数据', value: 'sales' },
  { label: '用户数据', value: 'users' },
  { label: '流量数据', value: 'traffic' },
  { label: '性能数据', value: 'performance' }
]

const filters = reactive<FilterData>({
  timeRange: '24h',
  dataTypes: ['sales', 'users'],
  minValue: null,
  maxValue: null
})

const handleFilterChange = () => {
  emit('filterChange', { ...filters })
}

const applyFilters = () => {
  emit('filterChange', { ...filters })
}

const resetFilters = () => {
  filters.timeRange = '24h'
  filters.dataTypes = ['sales', 'users']
  filters.minValue = null
  filters.maxValue = null
  handleFilterChange()
}
</script>