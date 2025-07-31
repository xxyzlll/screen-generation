// 图表基础配置
export interface ChartConfig {
  title?: {
    text: string
    textStyle: {
      color: string
      fontSize: number
      fontWeight: string
    }
  }
  legend?: {
    show: boolean
    position: 'top' | 'bottom' | 'left' | 'right'
    textStyle: {
      color: string
      fontSize: number
    }
  }
  grid?: {
    left: number | string
    top: number | string
    right: number | string
    bottom: number | string
  }
  xAxis?: AxisConfig
  yAxis?: AxisConfig
  series: SeriesConfig[]
  color?: string[]
  backgroundColor?: string
  animation?: boolean
}

// 坐标轴配置
export interface AxisConfig {
  type: 'category' | 'value' | 'time' | 'log'
  name?: string
  data?: any[]
  axisLine?: {
    show: boolean
    lineStyle: {
      color: string
      width: number
    }
  }
  axisTick?: {
    show: boolean
    lineStyle: {
      color: string
    }
  }
  axisLabel?: {
    show: boolean
    color: string
    fontSize: number
    rotate?: number
  }
  splitLine?: {
    show: boolean
    lineStyle: {
      color: string
      type: 'solid' | 'dashed' | 'dotted'
    }
  }
}

// 系列配置
export interface SeriesConfig {
  name: string
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'map' | 'gauge'
  data: any[]
  itemStyle?: {
    color?: string | {
      type: 'linear' | 'radial'
      colorStops: Array<{
        offset: number
        color: string
      }>
    }
    borderColor?: string
    borderWidth?: number
  }
  lineStyle?: {
    color?: string
    width?: number
    type?: 'solid' | 'dashed' | 'dotted'
  }
  areaStyle?: {
    color?: string
    opacity?: number
  }
  label?: {
    show: boolean
    position: string
    color: string
    fontSize: number
  }
  emphasis?: {
    itemStyle?: {
      color?: string
      borderColor?: string
      borderWidth?: number
    }
  }
}

// 地图配置
export interface MapConfig extends ChartConfig {
  geo?: {
    map: string
    roam: boolean
    itemStyle: {
      normal: {
        color: string
        borderColor: string
        borderWidth: number
      }
      emphasis: {
        color: string
      }
    }
  }
  visualMap?: {
    min: number
    max: number
    left: string
    top: string
    text: string[]
    calculable: boolean
    inRange: {
      color: string[]
    }
  }
}