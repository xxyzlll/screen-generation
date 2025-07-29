/**
 * 代码生成器 - 将画布配置转换为可部署的代码
 */

// 生成Vue组件代码
export const generateVueComponent = (canvasConfig) => {
  const { components, canvas } = canvasConfig
  
  const template = generateTemplate(components, canvas)
  const script = generateScript(components)
  const style = generateStyle(canvas)
  
  return `<template>
${template}
</template>

<script setup>
${script}
</script>

<style scoped>
${style}
</style>`
}

// 生成模板代码
const generateTemplate = (components, canvas) => {
  const { width, height } = canvas.size
  
  let template = `  <div class="dashboard" style="width: ${width}px; height: ${height}px; position: relative; background: #0a0a0a;">
`
  
  components.forEach(component => {
    const { type, position, size, props } = component
    const style = `position: absolute; left: ${position.x}px; top: ${position.y}px; width: ${size.width}px; height: ${size.height}px;`
    
    switch (type) {
      case 'line-chart':
        template += `    <div style="${style}">
`
        template += `      <LineChart :data="data_${component.id}" :options="options_${component.id}" />
`
        template += `    </div>
`
        break
        
      case 'bar-chart':
        template += `    <div style="${style}">
`
        template += `      <BarChart :data="data_${component.id}" :options="options_${component.id}" />
`
        template += `    </div>
`
        break
        
      case 'card-container':
        template += `    <div style="${style}" class="card-container">
`
        template += `      <h3>${props.title || '标题'}</h3>
`
        template += `      <div class="card-content">${props.content || '内容'}</div>
`
        template += `    </div>
`
        break
        
      default:
        template += `    <div style="${style}" class="component-${type}">
`
        template += `      <!-- ${type} 组件 -->
`
        template += `    </div>
`
    }
  })
  
  template += `  </div>`
  
  return template
}

// 生成脚本代码
const generateScript = (components) => {
  const imports = new Set()
  const dataRefs = []
  const optionsRefs = []
  
  components.forEach(component => {
    const { type, props, data } = component
    
    // 添加组件导入
    switch (type) {
      case 'line-chart':
        imports.add("import LineChart from '@/components/charts/LineChart.vue'")
        break
      case 'bar-chart':
        imports.add("import BarChart from '@/components/charts/BarChart.vue'")
        break
      // 添加更多组件类型
    }
    
    // 生成数据引用
    if (data) {
      dataRefs.push(`const data_${component.id} = ref(${JSON.stringify(data, null, 2)})`)
    }
    
    // 生成配置引用
    if (props) {
      optionsRefs.push(`const options_${component.id} = ref(${JSON.stringify(props, null, 2)})`)
    }
  })
  
  let script = `import { ref, onMounted } from 'vue'
`
  script += Array.from(imports).join('\n') + '\n\n'
  script += dataRefs.join('\n') + '\n\n'
  script += optionsRefs.join('\n') + '\n\n'
  script += `onMounted(() => {
  // 组件挂载后的初始化逻辑
})`
  
  return script
}

// 生成样式代码
const generateStyle = (canvas) => {
  return `.dashboard {
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

.card-container {
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.card-container h3 {
  margin: 0 0 12px 0;
  color: #8b5cf6;
  font-size: 16px;
  font-weight: 600;
}

.card-content {
  color: #ffffff;
  font-size: 14px;
}`
}

// 生成HTML文件
export const generateHTML = (canvasConfig, title = '数据可视化大屏') => {
  const vueComponent = generateVueComponent(canvasConfig)
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0a0a0a;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  
  <!-- Vue组件代码 -->
  <script type="module">
    ${vueComponent}
  </script>
</body>
</html>`
}

// 生成配置JSON
export const generateConfig = (canvasConfig) => {
  return JSON.stringify(canvasConfig, null, 2)
}

// 导出项目文件
export const exportProject = (canvasConfig, format = 'vue') => {
  const files = {}
  
  switch (format) {
    case 'vue':
      files['App.vue'] = generateVueComponent(canvasConfig)
      files['config.json'] = generateConfig(canvasConfig)
      break
      
    case 'html':
      files['index.html'] = generateHTML(canvasConfig)
      files['config.json'] = generateConfig(canvasConfig)
      break
      
    default:
      files['config.json'] = generateConfig(canvasConfig)
  }
  
  return files
}