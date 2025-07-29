<template>
  <div class="particle-system fixed inset-0 pointer-events-none overflow-hidden">
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="particle absolute rounded-full"
      :style="getParticleStyle(particle)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const particles = ref([])
let animationId

const createParticle = (id) => {
  return {
    id,
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 10,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    color: getRandomColor()
  }
}

const getRandomColor = () => {
  const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getParticleStyle = (particle) => {
  return {
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    backgroundColor: particle.color,
    opacity: particle.opacity,
    boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
  }
}

const updateParticles = () => {
  particles.value.forEach(particle => {
    particle.y -= particle.speed
    particle.opacity -= 0.002
    
    // 重置粒子
    if (particle.y < -10 || particle.opacity <= 0) {
      particle.y = window.innerHeight + 10
      particle.x = Math.random() * window.innerWidth
      particle.opacity = Math.random() * 0.5 + 0.3
    }
  })
}

const animate = () => {
  updateParticles()
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  // 创建初始粒子
  for (let i = 0; i < 50; i++) {
    particles.value.push(createParticle(i))
  }
  
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.particle {
  filter: blur(0.5px);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
}
</style>