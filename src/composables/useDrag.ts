import { ref, type Ref } from 'vue'

export interface DragOptions {
  onDragStart?: (event: DragEvent) => void
  onDragEnd?: (event: DragEvent) => void
  onDrop?: (event: DragEvent, data: any) => void
}

export function useDrag(options: DragOptions = {}) {
  const isDragging = ref(false)
  const dragData = ref<any>(null)

  const startDrag = (event: DragEvent, data: any) => {
    isDragging.value = true
    dragData.value = data
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('application/json', JSON.stringify(data))
    }
    
    options.onDragStart?.(event)
  }

  const endDrag = (event: DragEvent) => {
    isDragging.value = false
    dragData.value = null
    options.onDragEnd?.(event)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    
    try {
      const data = JSON.parse(event.dataTransfer?.getData('application/json') || '{}')
      options.onDrop?.(event, data)
    } catch (error) {
      console.error('Failed to parse drag data:', error)
    }
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  return {
    isDragging,
    dragData,
    startDrag,
    endDrag,
    handleDrop,
    handleDragOver
  }
}