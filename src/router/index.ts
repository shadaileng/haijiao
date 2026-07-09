import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
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
    path: '/user/:userId?',
    name: 'User',
    component: () => import('@/views/UserView.vue'),
  },
  {
    path: '/follow/:userId?',
    name: 'Follow',
    component: () => import('@/views/FollowView.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
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
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (store.isLoggedIn || publicPages.includes(to.name as string)) {
    next()
  } else {
    next({ name: 'Login' })
  }
})

export default router
