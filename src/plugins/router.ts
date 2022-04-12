import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

export const router = createRouter({
  history: __IS_GITHUB_PAGES__ ? createWebHashHistory() : createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home.vue')
    },
    {
      path: '/furigana',
      component: () => import('@/pages/furigana.vue')
    },
    {
      path: '/reading',
      component: () => import('@/pages/reading.vue')
    },
    {
      path: '/kana',
      component: () => import('@/pages/kana.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/home.vue')
    }
  ]
})
