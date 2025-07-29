<template>
  <div class="line-chart-container" :style="containerStyle">
    <div class="chart-header" v-if="showTitle">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-controls" v-if="showControls">
        <button @click="refreshData" class="control-btn" title="刷新数据">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="exportChart" class="control-btn" title="导出图表">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div ref="chartRef" class="chart-wrapper"></div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ loadingText }}</span>
    </div>
    
    <div v-if="error" class="error-overlay">
      <div class="error-content">
        <svg class="w-8 h-8 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="error-message">{{ error }}</p>
        <button @click="retryLoad" class="retry-btn">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 数据配置
  data: {
    type: Array,
    default: () => []
  },
  // 图表配置
  config: {
    type: Object,
    default: () => ({})
  },
  // 样式配置
  style: {
    type: Object,
    default: () => ({})
  },
  // 数据源配置
  dataSource: {
    type: Object,
    default: () => ({})
  },
  // 标题
  title: {
    type: String,
    default: '折线图'
  },
  // 是否显示标题
  showTitle: {
    type: Boolean,
    default: true
  },
  // 是否显示控制按钮
  showControls: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 加载文本
  loadingText: {
    type: String,
    default: '数据加载中...'
  },
  // 错误信息
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['refresh', 'export', 'retry', 'click', 'hover'])

const chartRef = ref(null)
let chartInstance = null

// 容器样式
const containerStyle = computed(() => ({
  width: props.style.width || '100%',
  height: props.style.height || '300px',
  backgroundColor: props.style.backgroundColor || 'rgba(26, 26, 26, 0.8)',
  borderRadius: props.style.borderRadius || '8px',
  border: props.style.border || '1px solid rgba(139, 92, 246, 0.3)',
  ...props.style
}))

// 默认配置
const defaultConfig = {
  // 基础配置
  smooth: true,
  showSymbol: true,
  symbolSize: 6,
  lineWidth: 3,
  
  // 颜色配置
  colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#10b981'],
  gradientColors: {
    start: '#8b5cf6',
    end: '#ec4899'
  },
  
  // 网格配置
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  
  // 坐标轴配置
  xAxis: {
    show: true,
    type: 'category',
    boundaryGap: false,
    axisLine: { show: true, lineStyle: { color: '#8b5cf6' } },
    axisLabel: { color: '#ffffff', fontSize: 12 },
    axisTick: { show: false }
  },
  
  yAxis: {
    show: true,
    type: 'value',
    axisLine: { show: true, lineStyle: { color: '#8b5cf6' } },
    axisLabel: { color: '#ffffff', fontSize: 12 },
    splitLine: { show: true, lineStyle: { color: 'rgba(139, 92, 246, 0.2)' } },
    axisTick: { show: false }
  },
  
  // 图例配置
  legend: {
    show: true,
    textStyle: { color: '#ffffff' },
    top: '5%'
  },
  
  // 提示框配置
  tooltip: {
    show: true,
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#8b5cf6',
    textStyle: { color: '#ffffff' }
  },
  
  // 动画配置
  animation: {
    duration: 2000,
    easing: 'cubicOut'
  },
  
  // 区域填充
  areaStyle: {
    show: false,
    opacity: 0.3
  }
}

// 合并配置
const mergedConfig = computed(() => {
  return {
    ...defaultConfig,
    ...props.config
  }
})

// 处理数据
const processedData = computed(() => {
  if (!props.data || props.data.length === 0) {
    // 返回模拟数据
    return {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [{
        name: '示例数据',
        data: [120, 132, 101, 134, 90, 230]
      }]
    }
  }
  
  // 处理真实数据
  if (Array.isArray(props.data[0])) {
    // 多系列数据
    return {
      categories: props.data[0].map(item => item.name || item.x || item.category),
      series: props.data.map((seriesData, index) => ({
        name: `系列${index + 1}`,
        data: seriesData.map(item => item.value || item.y || item.data)
      }))
    }
  } else {
    // 单系列数据
    return {
      categories: props.data.map(item => item.name || item.x || item.category),
      series: [{
        name: props.title || '数据',
        data: props.data.map(item => item.value || item.y || item.data)
      }]
    }
  }
})

// 生成图表选项
const generateOption = () => {
  const config = mergedConfig.value
  const data = processedData.value
  
  return {
    backgroundColor: 'transparent',
    grid: config.grid,
    
    xAxis: {
      ...config.xAxis,
      data: data.categories
    },
    
    yAxis: config.yAxis,
    
    legend: {
      ...config.legend,
      data: data.series.map(s => s.name)
    },
    
    tooltip: config.tooltip,
    
    series: data.series.map((seriesData, index) => {
      const color = config.colors[index % config.colors.length]
      
      return {
        name: seriesData.name,
        type: 'line',
        data: seriesData.data,
        smooth: config.smooth,
        showSymbol: config.showSymbol,
        symbolSize: config.symbolSize,
        
        lineStyle: {
          width: config.lineWidth,
          color: config.gradientColors ? {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: config.gradientColors.start },
              { offset: 1, color: config.gradientColors.end }
            ]
          } : color
        },
        
        areaStyle: config.areaStyle.show ? {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${color}${Math.round(config.areaStyle.opacity * 255).toString(16)}` },
              { offset: 1, color: `${color}10` }
            ]
          }
        } : undefined,
        
        emphasis: {
          focus: 'series',
          lineStyle: { width: config.lineWidth + 1 }
        },
        
        animationDuration: config.animation.duration,
        animationEasing: config.animation.easing
      }
    })
  }
}

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return
  
  try {
    chartInstance = echarts.init(chartRef.value)
    
    // 绑定事件
    chartInstance.on('click', (params) => {
      emit('click', params)
    })
    
    chartInstance.on('mouseover', (params) => {
      emit('hover', params)
    })
    
    updateChart()
  } catch (error) {
    console.error('图表初始化失败:', error)
    emit('retry')
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  try {
    const option = generateOption()
    chartInstance.setOption(option, true)
  } catch (error) {
    console.error('图表更新失败:', error)
  }
}

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 刷新数据
const refreshData = () => {
  emit('refresh')
}

// 导出图表
const exportChart = () => {
  if (chartInstance) {
    const url = chartInstance.getDataURL({
      type: 'png',
      backgroundColor: '#fff'
    })
    
    const link = document.createElement('a')
    link.download = `${props.title || '折线图'}.png`
    link.href = url
    link.click()
    
    emit('export', url)
  }
}

// 重试加载
const retryLoad = () => {
  emit('retry')
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', resizeChart)
})

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

watch(() => props.config, () => {
  updateChart()
}, { deep: true })

watch(() => props.style, () => {
  nextTick(() => {
    resizeChart()
  })
}, { deep: true })
</script>

<style scoped>
.line-chart-container {
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.6);
}

.chart-wrapper {
  width: 100%;
  height: calc(100% - 60px);
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.loading-text {
  color: #ffffff;
  font-size: 14px;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.error-content {
  text-align: center;
  color: #ffffff;
}

.error-message {
  margin: 8px 0 16px;
  font-size: 14px;
}

.retry-btn {
  padding: 8px 16px;
  background: #8b5cf6;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #7c3aed;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>