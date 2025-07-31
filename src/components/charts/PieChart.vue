<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
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
      nextTick(() => {
        resize()
      })
    })
    resizeObserver.observe(chartRef.value)
  }
}

const updateChart = () => {
  if (!chartInstance) return
  
  const colors = ['#00d4ff', '#0099cc', '#006699', '#004466', '#002233']
  
  const option = {
    title: {
      text: props.config.title,
      textStyle: {
        color: '#ffffff',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00d4ff',
      textStyle: {
        color: '#ffffff'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#ffffff'
      }
    },
    series: [{
      name: props.config.title || '数据',
      type: 'pie',
      radius: '50%',
      data: props.data.map((item, index) => ({
        value: item.value || item.y,
        name: item.name || item.x,
        itemStyle: {
          color: colors[index % colors.length]
        }
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chartInstance.setOption(option)
}

const resize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听组件尺寸变化
watch(() => props.component && [props.component.width, props.component.height], () => {
  nextTick(() => {
    resize()
  })
}, { deep: true })

watch(() => [props.config, props.data], updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  resizeObserver?.disconnect()
  chartInstance?.dispose()
})
</script>