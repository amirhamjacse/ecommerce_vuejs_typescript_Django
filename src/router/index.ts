import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import App from '../App.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: App,
    meta: { showDetail: false },
  },
  {
    path: '/product/:productName',
    name: 'product-detail',
    component: App,
    meta: { showDetail: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
