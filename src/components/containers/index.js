import CardContainer from './CardContainer.vue'
import SectionContainer from './SectionContainer.vue'
import ModalContainer from './ModalContainer.vue'

export {
  CardContainer,
  SectionContainer,
  ModalContainer
}

// 容器组件配置
export const containerComponents = [
  {
    name: 'CardContainer',
    label: '卡片容器',
    component: CardContainer,
    icon: '🃏',
    category: 'layout',
    defaultProps: {
      title: '卡片容器',
      showHeader: true,
      collapsible: true,
      resizable: true,
      draggable: true
    },
    defaultStyle: {
      width: '300px',
      height: '200px'
    }
  },
  {
    name: 'SectionContainer',
    label: '分区容器',
    component: SectionContainer,
    icon: '📐',
    category: 'layout',
    defaultProps: {
      title: '分区容器',
      layout: 'horizontal',
      showHeader: true,
      sections: [
        { title: '分区 1', flex: 1 },
        { title: '分区 2', flex: 1 }
      ]
    },
    defaultStyle: {
      width: '600px',
      height: '400px'
    }
  },
  {
    name: 'ModalContainer',
    label: '弹窗容器',
    component: ModalContainer,
    icon: '🪟',
    category: 'overlay',
    defaultProps: {
      title: '弹窗容器',
      size: 'medium',
      draggable: true,
      maximizable: true,
      closable: true,
      maskClosable: true,
      showHeader: true,
      showFooter: false
    },
    defaultStyle: {
      width: '600px',
      height: '400px'
    }
  }
]

// 根据类别分组
export const containersByCategory = {
  layout: containerComponents.filter(c => c.category === 'layout'),
  overlay: containerComponents.filter(c => c.category === 'overlay')
}