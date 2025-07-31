import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import type { Component } from '../types/component'

interface EditorState {
  // 画布配置
  canvas: {
    width: number
    height: number
    scale: number
    background: string
  }
  // 选中的组件
  selectedComponents: string[]
  // 画布上的所有组件
  components: Component[]
  // 编辑器模式
  mode: 'edit' | 'preview'
  // 是否显示网格
  showGrid: boolean
  // 是否显示标尺
  showRuler: boolean
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    canvas: {
      width: 1920,
      height: 1080,
      scale: 1,
      background: 'linear-gradient(135deg, #0c1426 0%, #1a1a2e 50%, #16213e 100%)'
    },
    selectedComponents: [],
    components: [],
    mode: 'edit',
    showGrid: true,
    showRuler: true
  }),

  getters: {
    // 获取选中的组件
    getSelectedComponents: (state) => {
      return state.components.filter(comp => 
        state.selectedComponents.includes(comp.id)
      )
    },
    
    // 获取画布样式
    getCanvasStyle: (state) => {
      return {
        width: `${state.canvas.width}px`,
        height: `${state.canvas.height}px`,
        transform: `scale(${state.canvas.scale})`,
        background: state.canvas.background
      }
    }
  },

  actions: {
    // 添加组件
    addComponent(component: Component) {
      this.components.push(component)
    },

    // 删除组件
    removeComponent(id: string) {
      const index = this.components.findIndex(comp => comp.id === id)
      if (index > -1) {
        this.components.splice(index, 1)
        this.selectedComponents = this.selectedComponents.filter(compId => compId !== id)
      }
    },

    // 选中组件
    selectComponent(id: string, multiple = false) {
      if (multiple) {
        if (this.selectedComponents.includes(id)) {
          this.selectedComponents = this.selectedComponents.filter(compId => compId !== id)
        } else {
          this.selectedComponents.push(id)
        }
      } else {
        this.selectedComponents = [id]
      }
    },

    // 清空选择
    clearSelection() {
      this.selectedComponents = []
    },

    // 更新组件
    updateComponent(id: string, updates: Partial<Component>) {
      const component = this.components.find(comp => comp.id === id)
      if (component) {
        Object.assign(component, updates)
        
        // 如果更新了尺寸，触发resize事件
        if (updates.width !== undefined || updates.height !== undefined) {
          // 使用nextTick确保DOM更新完成后再触发resize
          nextTick(() => {
            window.dispatchEvent(new CustomEvent('component-resize', {
              detail: { componentId: id, component }
            }))
          })
        }
      }
    },

    // 设置画布尺寸
    setCanvasSize(width: number, height: number) {
      this.canvas.width = width
      this.canvas.height = height
    },

    // 设置画布缩放
    setCanvasScale(scale: number) {
      this.canvas.scale = Math.max(0.1, Math.min(3, scale))
    },

    // 切换编辑器模式
    setMode(mode: 'edit' | 'preview') {
      this.mode = mode
    }
  }
})