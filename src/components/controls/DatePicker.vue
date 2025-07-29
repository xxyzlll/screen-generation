<template>
  <div class="date-picker p-3 bg-dark-surface rounded-lg border border-dark-border">
    <div class="mb-2">
      <label class="block text-xs text-gray-400 mb-1">{{ config.label || '选择日期' }}</label>
      <div class="flex space-x-2">
        <input 
          v-model="startDate" 
          type="date"
          @change="handleDateChange"
          class="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm focus:border-tech-coral focus:outline-none"
        >
        <span v-if="config.range" class="text-gray-400 self-center">至</span>
        <input 
          v-if="config.range"
          v-model="endDate" 
          type="date"
          @change="handleDateChange"
          class="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm focus:border-tech-coral focus:outline-none"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:data'])

const startDate = ref(props.data?.startDate || '')
const endDate = ref(props.data?.endDate || '')

const handleDateChange = () => {
  const dateData = {
    ...props.data,
    startDate: startDate.value
  }
  
  if (props.config.range) {
    dateData.endDate = endDate.value
  }
  
  emit('update:data', dateData)
}

watch(() => props.data, (newData) => {
  if (newData) {
    startDate.value = newData.startDate || ''
    endDate.value = newData.endDate || ''
  }
}, { deep: true })
</script>