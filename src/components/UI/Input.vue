<template>
  <div class="input-container">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input-field"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.input-container {
  @apply w-full;
}

.input-label {
  @apply block text-sm font-medium text-gray-300 mb-1;
}

.input-field {
  @apply w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400;
  @apply focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>