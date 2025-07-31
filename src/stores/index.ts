import { createPinia } from 'pinia'

// 导出所有store
export { useEditorStore } from './editor'
export { useComponentsStore } from './components'

// 创建pinia实例
export const pinia = createPinia()

export default pinia