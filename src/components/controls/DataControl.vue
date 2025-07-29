<template>
  <div class="data-control p-4 bg-dark-surface rounded-lg border border-dark-border">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-medium text-white">数据源配置</h3>
      <button @click="refreshData" class="text-xs text-tech-blue hover:text-white">
        刷新
      </button>
    </div>
    
    <div class="space-y-3">
      <!-- 数据源类型 -->
      <div>
        <label class="block text-xs text-gray-400 mb-1">数据源类型</label>
        <select v-model="dataSource.type" class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs">
          <option value="api">API接口</option>
          <option value="websocket">WebSocket</option>
          <option value="static">静态数据</option>
          <option value="mock">模拟数据</option>
        </select>
      </div>
      
      <!-- API配置 -->
      <div v-if="dataSource.type === 'api'">
        <label class="block text-xs text-gray-400 mb-1">API地址</label>
        <input 
          v-model="dataSource.url"
          type="text"
          placeholder="https://api.example.com/data"
          class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs"
        >
        
        <label class="block text-xs text-gray-400 mb-1 mt-2">请求方法</label>
        <select v-model="dataSource.method" class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        
        <label class="block text-xs text-gray-400 mb-1 mt-2">更新间隔(秒)</label>
        <input 
          v-model.number="dataSource.interval"
          type="number"
          min="1"
          class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs"
        >
      </div>
      
      <!-- WebSocket配置 -->
      <div v-if="dataSource.type === 'websocket'">
        <label class="block text-xs text-gray-400 mb-1">WebSocket地址</label>
        <input 
          v-model="dataSource.url"
          type="text"
          placeholder="ws://localhost:8080/data"
          class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs"
        >
      </div>
      
      <!-- 数据映射 -->
      <div>
        <label class="block text-xs text-gray-400 mb-1">数据字段映射</label>
        <textarea 
          v-model="dataSource.mapping"
          placeholder="{
  \"x\": \"timestamp\",
  \"y\": \"value\",
  \"label\": \"name\"
}"
          rows="4"
          class="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded text-white text-xs font-mono"
        ></textarea>
      </div>
      
      <!-- 连接状态 -->
      <div class="flex items-center justify-between pt-2 border-t border-dark-border">
        <span class="text-xs text-gray-400">连接状态</span>
        <span :class="statusClass" class="text-xs font-medium">
          {{ statusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['data-change'])

const dataSource = ref({
  type: 'mock',
  url: '',
  method: 'GET',
  interval: 30,
  mapping: '{}',
  status: 'disconnected'
})

const statusClass = computed(() => {
  switch (dataSource.value.status) {
    case 'connected': return 'text-green-400'
    case 'connecting': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    default: return 'text-gray-400'
  }
})

const statusText = computed(() => {
  switch (dataSource.value.status) {
    case 'connected': return '已连接'
    case 'connecting': return '连接中'
    case 'error': return '连接错误'
    default: return '未连接'
  }
})

const refreshData = () => {
  dataSource.value.status = 'connecting'
  // 模拟连接过程
  setTimeout(() => {
    dataSource.value.status = 'connected'
  }, 1000)
}

watch(dataSource, (newDataSource) => {
  emit('data-change', newDataSource)
}, { deep: true })
</script>