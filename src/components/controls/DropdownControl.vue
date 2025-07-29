<template>
  <div class="dropdown-control p-3 bg-dark-surface rounded-lg border border-dark-border">
    <div class="mb-2">
      <label class="block text-xs text-gray-400 mb-1">{{ config.label || '选择选项' }}</label>
      <select 
        v-model="selectedValue" 
        @change="handleChange"
        class="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white text-sm focus:border-tech-coral focus:outline-none"
      >
        <option value="" disabled>请选择...</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

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

const selectedValue = ref(props.data?.value || '')

const options = computed(() => {
  return props.config.options || [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3' }
  ]
})

const handleChange = () => {
  emit('update:data', {
    ...props.data,
    value: selectedValue.value
  })
}

watch(() => props.data?.value, (newValue) => {
  selectedValue.value = newValue || ''
})
</script>