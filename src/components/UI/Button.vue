<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  const baseClass = 'px-4 py-2 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2'
  
  const typeClass = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-400 focus:ring-cyan-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-500 focus:ring-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-400 focus:ring-red-300'
  }[props.type]
  
  const sizeClass = {
    small: 'text-sm px-3 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  }[props.size]
  
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return `${baseClass} ${typeClass} ${sizeClass} ${disabledClass}`
})
</script>