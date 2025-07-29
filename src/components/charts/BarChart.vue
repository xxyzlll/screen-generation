<template>
  <div class="bar-chart-container w-full h-full relative">
    <div ref="chartRef" class="w-full h-full"></div>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-dark-surface bg-opacity-80">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
const chartInstance = ref(null)
const loading = ref(false)

// 默认配置
const defaultOption = {
  backgroundColor: 'transparent',
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#8b5cf6'
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
        color: '#8b5cf6'
      }
    },
    axisLabel: {
      color: '#ffffff'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(139, 92, 246, 0.2)'
      }
    }
  },
  series: [{
    type: 'bar',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#8b5cf6' },
          { offset: 1, color: '#ec4899' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    },
    emphasis: {
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#a855f7' },
            { offset: 1, color: '#f472b6' }
          ]
        }
      }
    },
    animationDuration: 2000,
    animationEasing: 'elasticOut'
  }]
}

// 模拟数据
const mockData = {
  xAxis: ['产品A', '产品B', '产品C', '产品D', '产品E'],
  series: [220, 182, 191, 234, 290]
}

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance.value = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance.value) return
  
  const option = {
    ...defaultOption,
    xAxis: {
      ...defaultOption.xAxis,
      data: props.data.length ? props.data.map(item => item.name) : mockData.xAxis
    },
    series: [{
      ...defaultOption.series[0],
      data: props.data.length ? props.data.map(item => item.value) : mockData.series
    }]
  }
  
  chartInstance.value.setOption(option, true)
}

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.config, updateChart, { deep: true })
</script>

<style scoped>
.bar-chart-container {
  border-radius: 8px;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.3);
}
</style>