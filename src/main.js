import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.css'

// 路由配置
const routes = [
  { path: '/', redirect: '/editor' },
  { path: '/editor', component: () => import('./views/Editor.vue') }
  // 移除不存在的路由
  // { path: '/preview', component: () => import('./views/Preview.vue') },
  // { path: '/dashboard', component: () => import('./views/Dashboard.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')