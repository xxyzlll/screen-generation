<template>
  <div class="time-selector p-4 bg-gray-800 rounded-lg border border-gray-600">
    <h4 class="text-white text-sm font-medium mb-3">时间选择器</h4>
    
    <div class="space-y-3">
      <!-- 快速选择 -->
      <div>
        <label class="block text-xs text-gray-300 mb-2">快速选择</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="preset in timePresets" 
            :key="preset.value"
            @click="selectPreset(preset)"
            :class="[
              'px-2 py-1 text-xs rounded transition-colors',
              selectedPreset === preset.value 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
      
      <!-- 自定义时间范围 -->
      <div>
        <label class="block text-xs text-gray-300 mb-2">自定义时间范围</label>
        <div class="space-y-2">
          <div>
            <label class="block text-xs text-gray-400 mb-1">开始时间</label>
            <input 
              type="datetime-local" 
              v-model="customRange.start"
              class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              @change="handleCustomRangeChange"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">结束时间</label>
            <input 
              type="datetime-local" 
              v-model="customRange.end"
              class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              @change="handleCustomRangeChange"
            />
          </div>
        </div>
      </div>
      
      <!-- 实时更新开关 -->
      <div class="flex items-center justify-between">
        <label class="text-xs text-gray-300">实时更新</label>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            v-model="realTimeUpdate"
            class="sr-only peer"
            @change="handleRealTimeToggle"
          />
          <div class="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface TimeRange {
  start: string
  end: string
}

interface TimePreset {
  label: string
  value: string
  range: () => TimeRange
}

const emit = defineEmits<{
  timeChange: [range: TimeRange, realTime: boolean]
}>()

const selectedPreset = ref('1h')
const realTimeUpdate = ref(true)

const customRange = reactive<TimeRange>({
  start: '',
  end: ''
})

const timePresets: TimePreset[] = [
  {
    label: '最近1小时',
    value: '1h',
    range: () => ({
      start: new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16)
    })
  },
  {
    label: '最近6小时',
    value: '6h',
    range: () => ({
      start: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16)
    })
  },
  {
    label: '最近24小时',
    value: '24h',
    range: () => ({
      start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16)
    })
  },
  {
    label: '最近7天',
    value: '7d',
    range: () => ({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16)
    })
  }
]

const selectPreset = (preset: TimePreset) => {
  selectedPreset.value = preset.value
  const range = preset.range()
  customRange.start = range.start
  customRange.end = range.end
  emit('timeChange', range, realTimeUpdate.value)
}

const handleCustomRangeChange = () => {
  selectedPreset.value = ''
  emit('timeChange', { ...customRange }, realTimeUpdate.value)
}

const handleRealTimeToggle = () => {
  emit('timeChange', { ...customRange }, realTimeUpdate.value)
}

// 初始化
selectPreset(timePresets[0])
</script>