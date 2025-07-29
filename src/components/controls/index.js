import FilterControl from './FilterControl.vue'
import DataControl from './DataControl.vue'
import DropdownControl from './DropdownControl.vue'
import DatePicker from './DatePicker.vue'
import SwitchControl from './SwitchControl.vue'

export {
  FilterControl,
  DataControl,
  DropdownControl,
  DatePicker,
  SwitchControl
}

// 控制组件配置
export const controlComponents = [
  {
    name: 'FilterControl',
    label: '数据筛选器',
    component: FilterControl,
    icon: '🔍',
    category: 'data',
    defaultProps: {
      title: '数据筛选',
      showTimeRange: true,
      showDataTypes: true,
      showValueRange: true
    },
    defaultStyle: {
      width: '280px',
      height: '320px'
    }
  },
  {
    name: 'DataControl',
    label: '数据控制器',
    component: DataControl,
    icon: '📊',
    category: 'data',
    defaultProps: {
      title: '数据控制',
      autoRefresh: false,
      refreshInterval: 30000
    },
    defaultStyle: {
      width: '300px',
      height: '200px'
    }
  },
  {
    name: 'DropdownControl',
    label: '下拉选择器',
    component: DropdownControl,
    icon: '📋',
    category: 'input',
    defaultProps: {
      placeholder: '请选择',
      options: [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' }
      ],
      multiple: false
    },
    defaultStyle: {
      width: '200px',
      height: '40px'
    }
  },
  {
    name: 'DatePicker',
    label: '日期选择器',
    component: DatePicker,
    icon: '📅',
    category: 'input',
    defaultProps: {
      placeholder: '选择日期',
      format: 'YYYY-MM-DD',
      type: 'date'
    },
    defaultStyle: {
      width: '200px',
      height: '40px'
    }
  },
  {
    name: 'SwitchControl',
    label: '开关控制器',
    component: SwitchControl,
    icon: '🔘',
    category: 'input',
    defaultProps: {
      label: '开关',
      defaultValue: false,
      size: 'default'
    },
    defaultStyle: {
      width: '100px',
      height: '40px'
    }
  }
]

// 按分类分组
export const controlsByCategory = {
  data: controlComponents.filter(c => c.category === 'data'),
  input: controlComponents.filter(c => c.category === 'input')
}