import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/Editor.vue'),
    meta: {
      title: '大屏编辑器'
    }
  },
  {
    path: '/preview/:id?',
    name: 'Preview',
    component: () => import('../views/Preview.vue'),
    meta: {
      title: '大屏预览'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 大屏生成平台`
  }
  next()
})

export default router