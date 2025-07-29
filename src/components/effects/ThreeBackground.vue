<template>
  <div ref="containerRef" class="three-background fixed inset-0 -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, particles, animationId

const initThree = () => {
  if (!containerRef.value) return
  
  // 场景
  scene = new THREE.Scene()
  
  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 5
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)
  containerRef.value.appendChild(renderer.domElement)
  
  // 创建粒子系统
  createParticles()
  
  // 创建网格
  createGrid()
  
  // 开始动画
  animate()
}

const createParticles = () => {
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 位置
    positions[i3] = (Math.random() - 0.5) * 20
    positions[i3 + 1] = (Math.random() - 0.5) * 20
    positions[i3 + 2] = (Math.random() - 0.5) * 20
    
    // 颜色（紫-粉-蓝渐变）
    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.3 + 0.7, 0.8, 0.6)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const createGrid = () => {
  const gridHelper = new THREE.GridHelper(20, 20, 0x8b5cf6, 0x8b5cf6)
  gridHelper.material.opacity = 0.2
  gridHelper.material.transparent = true
  gridHelper.position.y = -5
  scene.add(gridHelper)
  
  // 添加发光效果
  const gridGeometry = new THREE.PlaneGeometry(20, 20, 20, 20)
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  })
  const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial)
  gridMesh.rotation.x = -Math.PI / 2
  gridMesh.position.y = -5
  scene.add(gridMesh)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 旋转粒子系统
  if (particles) {
    particles.rotation.x += 0.001
    particles.rotation.y += 0.002
  }
  
  // 相机轻微移动
  camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5
  camera.position.y = Math.cos(Date.now() * 0.0003) * 0.3
  camera.lookAt(scene.position)
  
  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.three-background {
  pointer-events: none;
}
</style>