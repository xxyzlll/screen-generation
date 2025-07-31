import { defineStore } from 'pinia'
import type { ComponentLibraryItem } from '../types/component'

interface ComponentsState {
  // 组件库列表
  library: ComponentLibraryItem[]
  // 当前拖拽的组件
  draggingComponent: ComponentLibraryItem | null
}

export const useComponentsStore = defineStore('components', {
  state: (): ComponentsState => ({
    library: [
      // 图表组件
      {
        id: 'line-chart',
        name: '折线图',
        type: 'chart',
        category: 'charts',
        icon: '📈',
        description: '用于展示数据趋势变化',
        defaultProps: {
          width: 400,
          height: 300,
          data: []
        }
      },
      {
        id: 'bar-chart',
        name: '柱状图',
        type: 'chart',
        category: 'charts',
        icon: '📊',
        description: '用于展示数据对比',
        defaultProps: {
          width: 400,
          height: 300,
          data: []
        }
      },
      {
        id: 'pie-chart',
        name: '饼图',
        type: 'chart',
        category: 'charts',
        icon: '🥧',
        description: '用于展示数据占比',
        defaultProps: {
          width: 300,
          height: 300,
          data: []
        }
      },
      {
        id: 'map-chart',
        name: '地图',
        type: 'chart',
        category: 'charts',
        icon: '🗺️',
        description: '用于展示地理数据',
        defaultProps: {
          width: 500,
          height: 400,
          data: []
        }
      },
      // 容器组件
      {
        id: 'border-box',
        name: '边框容器',
        type: 'container',
        category: 'containers',
        icon: '⬜',
        description: '科技感边框容器',
        defaultProps: {
          width: 300,
          height: 200,
          borderType: 'tech'
        }
      },
      {
        id: 'card-container',
        name: '卡片容器',
        type: 'container',
        category: 'containers',
        icon: '🃏',
        description: '通用卡片容器',
        defaultProps: {
          width: 300,
          height: 200,
          padding: 16
        }
      },
      // 控制组件
      {
        id: 'data-filter',
        name: '数据筛选器',
        type: 'control',
        category: 'controls',
        icon: '🔍',
        description: '用于数据筛选',
        defaultProps: {
          width: 200,
          height: 40,
          options: []
        }
      },
      {
        id: 'time-selector',
        name: '时间选择器',
        type: 'control',
        category: 'controls',
        icon: '⏰',
        description: '用于时间范围选择',
        defaultProps: {
          width: 250,
          height: 40,
          format: 'YYYY-MM-DD'
        }
      }
    ],
    draggingComponent: null
  }),

  getters: {
    // 按分类获取组件
    getComponentsByCategory: (state) => {
      return (category: string) => {
        return state.library.filter(item => item.category === category)
      }
    },

    // 获取所有分类
    getCategories: (state) => {
      const categories = [...new Set(state.library.map(item => item.category))]
      return categories.map(category => ({
        key: category,
        label: {
          charts: '图表组件',
          containers: '容器组件',
          controls: '控制组件'
        }[category] || category
      }))
    }
  },

  actions: {
    // 设置拖拽组件
    setDraggingComponent(component: ComponentLibraryItem | null) {
      this.draggingComponent = component
    },

    // 根据ID获取组件
    getComponentById(id: string) {
      return this.library.find(item => item.id === id)
    }
  }
})