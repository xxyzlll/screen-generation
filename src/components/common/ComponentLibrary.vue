<template>
  <div class="component-library h-full flex flex-col">
    <!-- 搜索框 -->
    <div class="p-4 border-b border-dark-border">
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索组件..."
          class="w-full pl-8 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tech-blue"
        >
        <svg class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- 组件分类 -->
    <div class="flex-1 overflow-y-auto">
      <div v-for="category in filteredCategories" :key="category.name" class="mb-4">
        <div 
          @click="toggleCategory(category.name)"
          class="px-4 py-2 cursor-pointer hover:bg-dark-bg transition-colors flex items-center justify-between"
        >
          <span class="font-medium text-tech-blue">{{ category.label }}</span>
          <svg 
            :class="{ 'rotate-90': expandedCategories.includes(category.name) }"
            class="w-4 h-4 transition-transform" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <div v-show="expandedCategories.includes(category.name)" class="pb-2">
          <div 
            v-for="component in category.components"
            :key="component.type"
            @dragstart="handleDragStart($event, component)"
            draggable="true"
            class="mx-4 mb-2 p-3 bg-dark-bg rounded-lg cursor-move hover:bg-opacity-80 transition-all border border-transparent hover:border-tech-purple group"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded bg-tech-gradient flex items-center justify-center text-white">
                <component :is="component.icon" class="w-4 h-4" />
              </div>
              <div>
                <div class="text-sm font-medium text-white">{{ component.name }}</div>
                <div class="text-xs text-gray-400">{{ component.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCanvasStore } from '@stores/canvas'
// 导入Element Plus图标
import {
  TrendCharts,
  Histogram,
  PieChart,
  DataAnalysis, // 替换 ScatterChart
  Grid,
  Location,
  View,
  Box,
  Folder,
  Monitor,
  Filter,
  ArrowDown,
  Calendar,
  Switch,
  Setting
} from '@element-plus/icons-vue'

const canvasStore = useCanvasStore()
const searchQuery = ref('') 
const expandedCategories = ref(['charts', 'containers', 'controls'])

// 组件分类
const categories = [
  {
    name: 'charts',
    label: '图表组件',
    components: [
      { 
        type: 'line-chart', 
        name: '折线图', 
        description: '展示趋势变化', 
        icon: TrendCharts,
        defaultProps: {
          title: '折线图',
          showLegend: true,
          showGrid: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      },
      { 
        type: 'bar-chart', 
        name: '柱状图', 
        description: '对比数据大小', 
        icon: Histogram,
        defaultProps: {
          title: '柱状图',
          showLegend: true,
          showGrid: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      },
      { 
        type: 'pie-chart', 
        name: '环形图', 
        description: '展示占比关系', 
        icon: PieChart,
        defaultProps: {
          title: '环形图',
          showLegend: true,
          innerRadius: 60
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px' 
        }
      },
      { 
        type: 'scatter-chart', 
        name: '散点图', 
        description: '展示相关性', 
        icon: DataAnalysis, // 使用 DataAnalysis 替换 ScatterChart
        defaultProps: {
          title: '散点图',
          showLegend: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      },
      { 
        type: 'heatmap-chart', 
        name: '热力图', 
        description: '展示密度分布', 
        icon: Grid,
        defaultProps: {
          title: '热力图'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      },
      { 
        type: 'map-chart', 
        name: '地理地图', 
        description: '地理数据可视化', 
        icon: Location,
        defaultProps: {
          title: '地理地图'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      },
      { 
        type: '3d-chart', 
        name: '三维图表', 
        description: '立体数据展示', 
        icon: View,
        defaultProps: {
          title: '三维图表'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          padding: '16px'
        }
      }
    ]
  },
  {
    name: 'containers',
    label: '容器组件',
    components: [
      { 
        type: 'card-container', 
        name: '卡片容器', 
        description: '内容分组展示', 
        icon: Box,
        defaultProps: {
          title: '卡片标题',
          showHeader: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px'
        }
      },
      { 
        type: 'section-container', 
        name: '区域容器', 
        description: '页面区域划分', 
        icon: Folder,
        defaultProps: {
          title: '区域标题',
          showHeader: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px'
        }
      },
      { 
        type: 'modal-container', 
        name: '弹窗容器', 
        description: '模态对话框', 
        icon: Monitor,
        defaultProps: {
          title: '弹窗标题',
          showHeader: true,
          showFooter: true
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px'
        }
      }
    ]
  },
  {
    name: 'controls',
    label: '控制组件',
    components: [
      { 
        type: 'filter-control', 
        name: '筛选器', 
        description: '数据筛选控制', 
        icon: Filter,
        defaultProps: {
          placeholder: '请选择筛选条件'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '6px',
          padding: '12px'
        }
      },
      { 
        type: 'dropdown-control', 
        name: '下拉选择', 
        description: '下拉选择控制', 
        icon: ArrowDown,
        defaultProps: {
          placeholder: '请选择'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '6px',
          padding: '8px'
        }
      },
      { 
        type: 'date-picker', 
        name: '日期选择', 
        description: '日期时间选择', 
        icon: Calendar,
        defaultProps: {
          placeholder: '请选择日期'
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '6px',
          padding: '8px'
        }
      },
      { 
        type: 'switch-control', 
        name: '开关控制', 
        description: '开关切换控制', 
        icon: Switch,
        defaultProps: {
          defaultValue: false
        },
        defaultStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '6px',
          padding: '8px'
        }
      }
    ]
  }
]

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories
  
  return categories.map(category => ({
    ...category,
    components: category.components.filter(component => 
      component.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })).filter(category => category.components.length > 0)
})

const toggleCategory = (categoryName) => {
  const index = expandedCategories.value.indexOf(categoryName)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryName)
  }
}

const handleDragStart = (event, component) => {
  console.log('Drag started:', component) // 调试信息
  event.dataTransfer.setData('application/json', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}
</script>

<style scoped>
.component-library {
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
}
</style>