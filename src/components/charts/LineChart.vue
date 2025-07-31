<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, inject } from 'vue'
import * as echarts from 'echarts'
import type { ChartConfig } from '@/types/chart'

interface Props {
  config: ChartConfig
  data?: any[]
  component?: any  // 添加组件属性
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  
  // 添加ResizeObserver监听容器尺寸变化
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(chartRef.value)
  }
}

const updateChart = () => {
  if (!chartInstance) return
  
  // 添加安全检查
  const config = props.config || {}
  
  const option = {
    title: {
      text: config.title || '图表标题',
      textStyle: {
        color: '#ffffff',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00d4ff',
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.name || item.x),
      axisLine: {
        lineStyle: {
          color: '#00d4ff'
        }
      },
      axisLabel: {
        color: '#ffffff'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#00d4ff'
        }
      },
      axisLabel: {
        color: '#ffffff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 212, 255, 0.2)'
        }
      }
    },
    series: [{
      data: props.data.map(item => item.value || item.y),
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#00d4ff',
        width: 2
      },
      itemStyle: {
        color: '#00d4ff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
          { offset: 1, color: 'rgba(0, 212, 255, 0.1)' }
        ])
      }
    }]
  }
  
  chartInstance.setOption(option)
}

const resize = () => {
  chartInstance?.resize()
}

// 监听组件尺寸变化
watch(() => props.component && [props.component.width, props.component.height], () => {
  setTimeout(() => {
    resize()
  }, 100) // 延迟一点确保DOM更新完成
}, { deep: true })

watch(() => [props.config, props.data], updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resize)
  
  // 监听组件尺寸变化事件
  window.addEventListener('component-resize', (event: CustomEvent) => {
    if (event.detail.componentId === props.component?.id) {
      setTimeout(() => {
        resize()
      }, 100)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>