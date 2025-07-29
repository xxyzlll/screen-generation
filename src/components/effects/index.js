import ParticleSystem from './ParticleSystem.vue'
import ThreeBackground from './ThreeBackground.vue'

export {
  ParticleSystem,
  ThreeBackground
}

// 特效组件配置
export const effectComponents = [
  {
    name: 'ParticleSystem',
    label: '粒子系统',
    component: ParticleSystem,
    icon: '✨',
    category: 'background',
    defaultProps: {
      particleCount: 50,
      speed: 1,
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
    },
    defaultStyle: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1'
    }
  },
  {
    name: 'ThreeBackground',
    label: '3D背景',
    component: ThreeBackground,
    icon: '🌌',
    category: 'background',
    defaultProps: {
      particleCount: 1000,
      animationSpeed: 0.01,
      gridSize: 20
    },
    defaultStyle: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-10'
    }
  }
]

// 按分类分组
export const effectsByCategory = {
  background: effectComponents.filter(c => c.category === 'background')
}