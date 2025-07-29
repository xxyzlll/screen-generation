<template>
  <div id="app" class="min-h-screen bg-dark-bg text-white">
    <!-- 三维背景 -->
    <ThreeBackground />
    
    <!-- 主要内容 -->
    <div class="relative z-10">
      <router-view />
    </div>
    
    <!-- 全局粒子效果 -->
    <ParticleSystem />
  </div>
</template>

<script setup>
import ThreeBackground from '@components/effects/ThreeBackground.vue'
import ParticleSystem from '@components/effects/ParticleSystem.vue'
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(26, 26, 26, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7c3aed, #db2777);
}
</style>