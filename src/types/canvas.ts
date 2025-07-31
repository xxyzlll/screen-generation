// 画布操作类型
export type CanvasOperation = 
  | 'select'
  | 'move'
  | 'resize'
  | 'rotate'
  | 'draw'
  | 'pan'
  | 'zoom'

// 选择框
export interface SelectionBox {
  x: number
  y: number
  width: number
  height: number
  visible: boolean
}

// 变换手柄
export interface TransformHandle {
  type: 'resize' | 'rotate'
  position: string // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'rotate'
  x: number
  y: number
  cursor: string
}

// 拖拽状态
export interface DragState {
  isDragging: boolean
  dragType: 'component' | 'selection' | 'resize' | 'rotate'
  startX: number
  startY: number
  currentX: number
  currentY: number
  componentStartX?: number  // 添加这个属性
  componentStartY?: number  // 添加这个属性
} 

// 网格配置
export interface GridConfig {
  show: boolean
  size: number
  color: string
  opacity: number
  snap: boolean
}

// 标尺配置
export interface RulerConfig {
  show: boolean
  color: string
  backgroundColor: string
  textColor: string
  size: number
}

// 辅助线
export interface GuideLine {
  id: string
  type: 'horizontal' | 'vertical'
  position: number
  color: string
  visible: boolean
}

// 画布事件
export interface CanvasEvent {
  type: string
  target?: string
  x: number
  y: number
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}