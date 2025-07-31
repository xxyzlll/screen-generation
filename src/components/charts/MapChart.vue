<template>
  <div 
    ref="mapContainer" 
    class="w-full h-full relative"
    :class="{ 'pointer-events-none': isEditMode }"
  >
    <!-- 编辑模式遮罩 -->
    <div 
      v-if="isEditMode"
      class="absolute inset-0 z-10 bg-transparent cursor-move"
      @mousedown.stop
      @click.stop
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, inject } from 'vue'
import type { Component } from '@/types/component'

interface Props {
  component?: Component
  config?: any
  data?: any[]
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  selected: false
})

// 注入编辑器模式
const editorMode = inject('editorMode', ref('edit'))

// 计算是否为编辑模式
const isEditMode = computed(() => editorMode.value === 'edit')

const mapContainer = ref<HTMLElement>()
let mapInstance: any = null

// 高德地图 API Key
const AMAP_KEY = 'd5f3e16589dbecae64d05fe90e2ba4f2'

// 计算实际使用的配置和数据
const mapConfig = computed(() => {
  if (props.component) {
    return {
      title: props.component.name,
      ...props.component.props
    }
  }
  return props.config || {}
})

const mapData = computed(() => {
  if (props.component?.props?.data) {
    return props.component.props.data
  }
  return props.data || [
    { name: '北京', value: [116.46, 39.92, 100] },
    { name: '上海', value: [121.48, 31.22, 200] },
    { name: '深圳', value: [114.07, 22.62, 150] },
    { name: '广州', value: [113.23, 23.16, 120] }
  ]
})

// 动态加载高德地图 API
const loadAmapAPI = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}&plugin=AMap.Scale,AMap.ToolBar`
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        reject(new Error('高德地图加载失败'))
      }
    }
    script.onerror = () => reject(new Error('高德地图脚本加载失败'))
    document.head.appendChild(script)
  })
}

const initMap = async () => {
  if (!mapContainer.value) return
  
  try {
    const AMap = await loadAmapAPI()
    
    mapInstance = new AMap.Map(mapContainer.value, {
      zoom: 4,
      center: [108.5525, 34.3227], // 中国中心点
      mapStyle: 'amap://styles/dark', // 暗色主题
      viewMode: '2D',
      // 在编辑模式下禁用地图交互
      dragEnable: !isEditMode.value,
      zoomEnable: !isEditMode.value,
      doubleClickZoom: !isEditMode.value,
      keyboardEnable: false,
      scrollWheel: !isEditMode.value,
      touchZoom: !isEditMode.value
    })
    
    // 只在预览模式下添加工具栏
    if (!isEditMode.value) {
      mapInstance.addControl(new AMap.Scale())
      mapInstance.addControl(new AMap.ToolBar())
    }
    
    updateMapData()
  } catch (error) {
    console.error('地图初始化失败:', error)
    // 降级到文本显示
    if (mapContainer.value) {
      mapContainer.value.innerHTML = `
        <div class="flex items-center justify-center h-full text-white bg-gray-800 border border-gray-600">
          <div class="text-center">
            <div class="text-lg mb-2">🗺️</div>
            <div>地图组件</div>
            <div class="text-sm text-gray-400 mt-1">地图加载失败</div>
          </div>
        </div>
      `
    }
  }
}

const updateMapData = () => {
  if (!mapInstance || !window.AMap) return
  
  // 清除之前的标记
  mapInstance.clearMap()
  
  // 添加数据点
  mapData.value.forEach(item => {
    if (item.value && item.value.length >= 2) {
      const marker = new window.AMap.Marker({
        position: [item.value[0], item.value[1]],
        title: item.name,
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(20, 20),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#00d4ff" stroke="#ffffff" stroke-width="2"/>
            </svg>
          `)
        })
      })
      
      mapInstance.add(marker)
      
      // 只在预览模式下添加信息窗口交互
      if (!isEditMode.value) {
        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="color: #333;">${item.name}: ${item.value[2] || 0}</div>`
        })
        
        marker.on('click', () => {
          infoWindow.open(mapInstance, marker.getPosition())
        })
      }
    }
  })
}

// 监听编辑模式变化，重新初始化地图
watch(isEditMode, (newMode) => {
  if (mapInstance) {
    // 更新地图交互设置
    mapInstance.setStatus({
      dragEnable: !newMode,
      zoomEnable: !newMode,
      doubleClickZoom: !newMode,
      scrollWheel: !newMode,
      touchZoom: !newMode
    })
  }
}, { immediate: true })

watch(() => mapData.value, updateMapData, { deep: true })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.destroy()
  }
})
</script>

<style scoped>
/* 高德地图样式 */
:deep(.amap-logo),
:deep(.amap-copyright) {
  display: none !important;
}

/* 编辑模式下的样式 */
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-none > * {
  pointer-events: none;
}
</style>