import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import type { Component } from '@/types/component'

export function useCanvas() {
  const editorStore = useEditorStore()
  
  const canvasRef = ref<HTMLElement>()
  const isSelecting = ref(false)
  const selectionStart = ref({ x: 0, y: 0 })
  const selectionEnd = ref({ x: 0, y: 0 })

  const selectionBox = computed(() => {
    const start = selectionStart.value
    const end = selectionEnd.value
    
    return {
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y)
    }
  })

  const startSelection = (event: MouseEvent) => {
    if (!canvasRef.value) return
    
    const rect = canvasRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    isSelecting.value = true
    selectionStart.value = { x, y }
    selectionEnd.value = { x, y }
    
    editorStore.clearSelection()
  }

  const updateSelection = (event: MouseEvent) => {
    if (!isSelecting.value || !canvasRef.value) return
    
    const rect = canvasRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    selectionEnd.value = { x, y }
  }

  const endSelection = () => {
    if (!isSelecting.value) return
    
    isSelecting.value = false
    
    // 检查选择框内的组件
    const box = selectionBox.value
    const selectedComponents = editorStore.components.filter(component => {
      return component.style.left >= box.left &&
             component.style.top >= box.top &&
             component.style.left + component.style.width <= box.left + box.width &&
             component.style.top + component.style.height <= box.top + box.height
    })
    
    if (selectedComponents.length > 0) {
      editorStore.selectComponent(selectedComponents[0].id)
    }
  }

  const getMousePosition = (event: MouseEvent) => {
    if (!canvasRef.value) return { x: 0, y: 0 }
    
    const rect = canvasRef.value.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  return {
    canvasRef,
    isSelecting,
    selectionBox,
    startSelection,
    updateSelection,
    endSelection,
    getMousePosition
  }
}