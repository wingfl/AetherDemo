import { createRouter, createWebHistory } from 'vue-router'
import { beforeEach, afterEach } from './guard'

const routes = [
  {
    path: '/',
    name: 'CanvasEditor',
    component: () => import('@/views/canvas/index.vue')
  }
  // {
  //   path: '/image',
  //   name: 'ImageGenerator',
  //   component: () => import('@/views/ImageGenerator.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(beforeEach)
router.afterEach(afterEach)

export default router