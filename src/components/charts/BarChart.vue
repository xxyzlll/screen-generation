<template>
  <div 
    ref="chartRef" 
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { Component } from '@/types/component' 
import { inject } from 'vue'
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

// 计算实际使用的配置和数据
const chartConfig = computed(() => {
  if (props.component) {
    return {
      title: props.component.name,
      ...props.component.props
    }
  }
  return props.config || {}
})

const chartData = computed(() => {
  if (props.component?.props?.data) {
    return props.component.props.data
  }
  return props.data || [
    { name: '示例1', value: 120 },
    { name: '示例2', value: 200 },
    { name: '示例3', value: 150 },
    { name: '示例4', value: 80 },
    { name: '示例5', value: 70 }
  ]
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 注入编辑器模式
const editorMode = inject('editorMode', ref('edit'))
const isEditMode = computed(() => editorMode.value === 'edit')

// 在 updateChart 函数中禁用图表交互
const updateChart = () => {
  if (!chartInstance) return
  
  const option = {
    title: {
      text: chartConfig.value.title || '柱状图',
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
      data: chartData.value.map(item => item.name),
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
      data: chartData.value.map(item => item.value),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00d4ff' },
          { offset: 1, color: '#0099cc' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: '#00e6ff'
        }
      }
    }]
  }
  
  chartInstance.setOption(option)
  
  // 在编辑模式下禁用图表的所有交互事件
  if (isEditMode.value) {
    chartInstance.getZr().off('click')
    chartInstance.getZr().off('mouseover')
    chartInstance.getZr().off('mouseout')
  }
}

const resize = () => {
  chartInstance?.resize()
}

watch(() => [chartConfig.value, chartData.value], updateChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  chartInstance?.dispose()
})
</script>