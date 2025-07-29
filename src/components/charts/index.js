import LineChart from './LineChart.vue'
import BarChart from './BarChart.vue'
import PieChart from './PieChart.vue'
import ScatterChart from './ScatterChart.vue'
import HeatmapChart from './HeatmapChart.vue'
import MapChart from './MapChart.vue'
import Chart3D from './Chart3D.vue'

export {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  MapChart,
  Chart3D
}

// 图表组件配置
export const chartComponents = [
  {
    name: 'LineChart',
    label: '折线图',
    component: LineChart,
    icon: '📈',
    category: 'basic',
    defaultProps: {
      title: '折线图',
      smooth: true,
      showSymbol: true
    },
    defaultStyle: {
      width: '400px',
      height: '300px'
    }
  },
  {
    name: 'BarChart',
    label: '柱状图',
    component: BarChart,
    icon: '📊',
    category: 'basic',
    defaultProps: {
      title: '柱状图',
      showLabel: true
    },
    defaultStyle: {
      width: '400px',
      height: '300px'
    }
  },
  {
    name: 'PieChart',
    label: '环形图',
    component: PieChart,
    icon: '🍰',
    category: 'basic',
    defaultProps: {
      title: '环形图',
      radius: ['40%', '70%']
    },
    defaultStyle: {
      width: '400px',
      height: '300px'
    }
  },
  {
    name: 'ScatterChart',
    label: '散点图',
    component: ScatterChart,
    icon: '⚪',
    category: 'basic',
    defaultProps: {
      title: '散点图',
      symbolSize: 8
    },
    defaultStyle: {
      width: '400px',
      height: '300px'
    }
  },
  {
    name: 'HeatmapChart',
    label: '热力图',
    component: HeatmapChart,
    icon: '🔥',
    category: 'advanced',
    defaultProps: {
      title: '热力图'
    },
    defaultStyle: {
      width: '500px',
      height: '400px'
    }
  },
  {
    name: 'MapChart',
    label: '地理地图',
    component: MapChart,
    icon: '🗺️',
    category: 'advanced',
    defaultProps: {
      title: '地理地图',
      roam: true
    },
    defaultStyle: {
      width: '600px',
      height: '400px'
    }
  },
  {
    name: 'Chart3D',
    label: '三维图表',
    component: Chart3D,
    icon: '🎲',
    category: '3d',
    defaultProps: {
      title: '三维图表',
      chartType: 'bar3D',
      autoRotate: true
    },
    defaultStyle: {
      width: '500px',
      height: '400px'
    }
  }
]

// 根据类别分组
export const chartsByCategory = {
  basic: chartComponents.filter(c => c.category === 'basic'),
  advanced: chartComponents.filter(c => c.category === 'advanced'),
  '3d': chartComponents.filter(c => c.category === '3d')
}