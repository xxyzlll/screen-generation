<template>
  <div class="switch-control p-3 bg-dark-surface rounded-lg border border-dark-border">
    <div class="flex items-center justify-between">
      <label class="text-sm text-white">{{ config.label || '开关控制' }}</label>
      <button 
        @click="toggle"
        :class="[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
          isOn ? 'bg-tech-coral' : 'bg-gray-600'
        ]"
      >
        <span 
          :class="[
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            isOn ? 'translate-x-6' : 'translate-x-1'
          ]"
        />
      </button>
    </div>
    <p v-if="config.description" class="text-xs text-gray-400 mt-1">
      {{ config.description }}
    </p>
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

const isOn = ref(props.data?.value || false)

const toggle = () => {
  isOn.value = !isOn.value
  emit('update:data', {
    ...props.data,
    value: isOn.value
  })
}

watch(() => props.data?.value, (newValue) => {
  isOn.value = newValue || false
})
</script>