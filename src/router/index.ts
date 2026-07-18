import { createRouter, createWebHistory } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const routes = [
  {
    path: '/',
    redirect: '/hot',
  },
  {
    path: '/hot',
    name: 'Hot',
    component: () => import('@/views/HotTopicsView.vue'),
    meta: { showTabBar: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/topic/:pid?',
    name: 'Topic',
    component: () => import('@/views/TopicView.vue'),
  },
  {
    path: '/homepage/:userId/:nickname?',
    name: 'Homepage',
    component: () => import('@/views/UserHomeView.vue'),
  },
  {
    path: '/user/:userId?',
    name: 'User',
    component: () => import('@/views/UserView.vue'),
  },
  {
    path: '/follow/:userId?',
    name: 'Follow',
    component: () => import('@/views/FollowView.vue'),
    meta: { showTabBar: true },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: { showTabBar: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { showTabBar: true },
  },
  {
    path: '/image-viewer',
    name: 'ImageViewer',
    component: () => import('@/views/ImageViewerView.vue'),
  },
]

const publicPages = ['Login', 'Settings', 'ImageViewer']

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    const key = `scrollPos_${to.name as string}`
    const savedPos = sessionStorage.getItem(key)
    if (savedPos) {
      sessionStorage.removeItem(key)
      return { top: parseInt(savedPos) }
    }
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const settings = useSettingsStore()
  if (settings.isLoggedIn || publicPages.includes(to.name as string)) {
    next()
  } else {
    next({ name: 'Login' })
  }
})

export default router
