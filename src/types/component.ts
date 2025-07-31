// 基础组件接口
export interface Component {
  id: string
  type: string
  name: string
  // 位置和尺寸
  x: number
  y: number
  width: number
  height: number
  // 层级
  zIndex: number
  // 是否锁定
  locked: boolean
  // 是否可见
  visible: boolean
  // 组件属性
  props: Record<string, any>
  // 样式
  style: ComponentStyle
  // 数据配置
  data?: ComponentData
  // 动画配置
  animation?: ComponentAnimation
}

// 组件样式
export interface ComponentStyle {
  // 背景
  backgroundColor?: string
  backgroundImage?: string
  // 边框
  border?: string
  borderRadius?: number
  // 阴影
  boxShadow?: string
  // 透明度
  opacity?: number
  // 变换
  transform?: string
  // 其他CSS属性
  [key: string]: any
}

// 组件数据配置
export interface ComponentData {
  // 数据源类型
  sourceType: 'static' | 'api' | 'websocket' | 'file'
  // 数据源配置
  source: {
    url?: string
    method?: string
    headers?: Record<string, string>
    params?: Record<string, any>
    data?: any
  }
  // 数据处理
  transform?: {
    filter?: string
    map?: string
    sort?: string
  }
  // 刷新间隔（毫秒）
  refreshInterval?: number
}

// 组件动画配置
export interface ComponentAnimation {
  // 入场动画
  enter?: {
    type: string
    duration: number
    delay: number
    easing: string
  }
  // 循环动画
  loop?: {
    type: string
    duration: number
    direction: 'normal' | 'reverse' | 'alternate'
    iterationCount: number | 'infinite'
  }
}

// 组件库项目
export interface ComponentLibraryItem {
  id: string
  name: string
  type: string
  category: string
  icon: string
  description: string
  defaultProps: Record<string, any>
  preview?: string
}

// 画布配置
export interface CanvasConfig {
  width: number
  height: number
  scale: number
  background: string
  grid: {
    show: boolean
    size: number
    color: string
  }
  ruler: {
    show: boolean
    color: string
  }
}