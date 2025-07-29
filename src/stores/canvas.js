import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
  // 画布状态
  const scale = ref(1)
  const position = reactive({ x: 0, y: 0 })
  const size = reactive({ width: 1920, height: 1080 })
  const selectedComponent = ref(null)
  const components = ref([])
  
  // 画布操作
  const setScale = (newScale) => {
    scale.value = Math.max(0.1, Math.min(3, newScale))
  }
  
  const setPosition = (x, y) => {
    position.x = x
    position.y = y
  }
  
  const addComponent = (component) => {
    const newComponent = {
      id: Date.now().toString(),
      type: component.type,
      position: component.position || { x: 100, y: 100 },
      size: component.size || { width: 300, height: 200 },
      props: component.defaultProps ? { ...component.defaultProps } : {},
      style: component.defaultStyle ? { 
        ...component.defaultStyle,
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px'
      } : {
        opacity: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px'
      },
      data: component.data || null,
      dataSource: {
        type: 'static',
        url: '',
        refreshInterval: 5000,
        data: []
      },
      zIndex: component.zIndex || 1
    }
    components.value.push(newComponent)
    selectedComponent.value = newComponent.id
    
    console.log('Added component:', newComponent)
  }
  
  const updateComponent = (id, updates) => {
    const component = components.value.find(c => c.id === id)
    if (component) {
      Object.assign(component, updates)
    }
  }
  
  const deleteComponent = (id) => {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value.splice(index, 1)
      if (selectedComponent.value === id) {
        selectedComponent.value = null
      }
    }
  }
  
  const selectComponent = (id) => {
    selectedComponent.value = id
  }
  
  const resetCanvas = () => {
    scale.value = 1
    position.x = 0
    position.y = 0
    selectedComponent.value = null
  }
  
  const exportConfig = () => {
    return {
      canvas: {
        size: { ...size },
        background: 'dark-gradient'
      },
      components: components.value.map(c => ({ ...c }))
    }
  }
  
  return {
    scale,
    position,
    size,
    selectedComponent,
    components,
    setScale,
    setPosition,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    resetCanvas,
    exportConfig
  }
})