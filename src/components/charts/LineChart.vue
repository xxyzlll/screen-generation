<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ChartConfig } from '@/types/chart'

interface Props {
  config: ChartConfig
  data?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return
  
  const option = {
    title: {
      text: props.config.title,
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

watch(() => [props.config, props.data], updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  chartInstance?.dispose()
})
</script>