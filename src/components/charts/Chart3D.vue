<template>
  <div class="chart3d-container" :style="containerStyle">
    <div ref="chartRef" class="chart-wrapper"></div>
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  },
  style: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  chartType: {
    type: String,
    default: 'bar3D' // bar3D, scatter3D, surface
  }
})

const emit = defineEmits(['click', 'hover'])

const chartRef = ref(null)
let chartInstance = null

const containerStyle = computed(() => ({
  width: props.style.width || '100%',
  height: props.style.height || '400px',
  ...props.style
}))

const defaultConfig = {
  title: {
    text: '三维图表',
    textStyle: {
      color: '#ffffff',
      fontSize: 16
    },
    left: 'center',
    top: 20
  },
  tooltip: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderColor: '#8b5cf6',
    textStyle: {
      color: '#ffffff'
    }
  },
  xAxis3D: {
    type: 'category',
    data: [],
    axisLabel: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: '#8b5cf6'
      }
    }
  },
  yAxis3D: {
    type: 'category',
    data: [],
    axisLabel: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: '#8b5cf6'
      }
    }
  },
  zAxis3D: {
    type: 'value',
    axisLabel: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: '#8b5cf6'
      }
    }
  },
  grid3D: {
    boxWidth: 200,
    boxDepth: 80,
    boxHeight: 120,
    environment: 'none',
    light: {
      main: {
        intensity: 1.2,
        shadow: true
      },
      ambient: {
        intensity: 0.3
      }
    },
    viewControl: {
      autoRotate: true,
      autoRotateSpeed: 5
    }
  },
  series: [{
    type: 'bar3D',
    data: [],
    itemStyle: {
      color: function(params) {
        const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
        return colors[params.dataIndex % colors.length]
      },
      opacity: 0.8
    },
    emphasis: {
      itemStyle: {
        color: '#ffffff'
      }
    }
  }]
}

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    ...defaultConfig,
    ...props.config,
    series: [{
      ...defaultConfig.series[0],
      type: props.chartType,
      ...props.config.series?.[0],
      data: props.data
    }]
  }
  
  chartInstance.setOption(option)
  
  chartInstance.on('click', (params) => {
    emit('click', params)
  })
  
  chartInstance.on('mouseover', (params) => {
    emit('hover', params)
  })
}

const updateChart = () => {
  if (!chartInstance) return
  
  const option = {
    ...defaultConfig,
    ...props.config,
    series: [{
      ...defaultConfig.series[0],
      type: props.chartType,
      ...props.config.series?.[0],
      data: props.data
    }]
  }
  
  chartInstance.setOption(option, true)
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

watch(() => props.data, updateChart, { deep: true })
watch(() => props.config, updateChart, { deep: true })
watch(() => props.chartType, updateChart)

defineExpose({
  resize: resizeChart,
  getInstance: () => chartInstance
})
</script>

<style scoped>
.chart3d-container {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  overflow: hidden;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>