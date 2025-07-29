/**
 * 数据适配器 - 处理不同数据源的数据格式转换
 */

// 数据格式化工具
export const formatData = (data, mapping = {}) => {
  if (!data || !Array.isArray(data)) return []
  
  return data.map(item => {
    const formatted = {}
    
    // 应用字段映射
    Object.keys(mapping).forEach(key => {
      const sourcePath = mapping[key]
      formatted[key] = getNestedValue(item, sourcePath)
    })
    
    return { ...item, ...formatted }
  })
}

// 获取嵌套对象值
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

// 时间序列数据处理
export const processTimeSeriesData = (data, timeField = 'timestamp', valueField = 'value') => {
  if (!Array.isArray(data)) return []
  
  return data
    .map(item => ({
      time: new Date(item[timeField]).getTime(),
      value: Number(item[valueField]) || 0,
      ...item
    }))
    .sort((a, b) => a.time - b.time)
}

// 分组数据处理
export const groupData = (data, groupField) => {
  if (!Array.isArray(data)) return {}
  
  return data.reduce((groups, item) => {
    const key = item[groupField] || 'unknown'
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {})
}

// 数据聚合
export const aggregateData = (data, aggregateField, aggregateType = 'sum') => {
  if (!Array.isArray(data) || data.length === 0) return 0
  
  const values = data.map(item => Number(item[aggregateField]) || 0)
  
  switch (aggregateType) {
    case 'sum':
      return values.reduce((sum, val) => sum + val, 0)
    case 'avg':
      return values.reduce((sum, val) => sum + val, 0) / values.length
    case 'max':
      return Math.max(...values)
    case 'min':
      return Math.min(...values)
    case 'count':
      return values.length
    default:
      return 0
  }
}

// 数据过滤
export const filterData = (data, filters) => {
  if (!Array.isArray(data)) return []
  
  return data.filter(item => {
    // 时间范围过滤
    if (filters.timeRange) {
      const itemTime = new Date(item.timestamp).getTime()
      const now = Date.now()
      const timeRanges = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }
      
      if (now - itemTime > timeRanges[filters.timeRange]) {
        return false
      }
    }
    
    // 数据类型过滤
    if (filters.dataTypes && filters.dataTypes.length > 0) {
      if (!filters.dataTypes.includes(item.type)) {
        return false
      }
    }
    
    // 数值范围过滤
    if (filters.valueRange) {
      const value = Number(item.value)
      if (filters.valueRange.min !== null && value < filters.valueRange.min) {
        return false
      }
      if (filters.valueRange.max !== null && value > filters.valueRange.max) {
        return false
      }
    }
    
    return true
  })
}

// 模拟数据生成器
export const generateMockData = (type, count = 100) => {
  const data = []
  const now = Date.now()
  
  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * 60000 // 每分钟一个数据点
    
    switch (type) {
      case 'line':
        data.push({
          timestamp,
          value: Math.random() * 100 + Math.sin(i * 0.1) * 20,
          category: `类别${(i % 3) + 1}`
        })
        break
        
      case 'bar':
        data.push({
          name: `项目${i + 1}`,
          value: Math.random() * 1000,
          category: `分类${(i % 5) + 1}`
        })
        break
        
      case 'pie':
        data.push({
          name: `部门${i + 1}`,
          value: Math.random() * 100,
          percentage: Math.random() * 100
        })
        break
        
      default:
        data.push({
          timestamp,
          value: Math.random() * 100,
          label: `数据${i + 1}`
        })
    }
  }
  
  return data
}