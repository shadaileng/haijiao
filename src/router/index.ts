import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/node',
    name: 'Node',
    component: () => import('@/views/NodeView.vue'),
    meta: { showTabBar: true },
  },
  {
    path: '/node/:nodeId',
    name: 'NodeTopics',
    component: () => import('@/views/NodeTopicsView.vue'),
    meta: {},
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
    path: '/homepage/:userId',
    name: 'Homepage',
    component: () => import('@/views/UserHomeView.vue'),
  },
  {
    path: '/user/:userId?',
    name: 'User',
    component: () => import('@/views/UserView.vue'),
  },
  {
    path: '/settings/follow',
    name: 'SettingsFollow',
    component: () => import('@/views/FollowView.vue'),
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
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/FavoritesView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const publicPages = ['Login', 'Settings', 'ImageViewer', 'History', 'NotFound']

function isLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem('settings')
    if (!raw) return false
    const cfg = JSON.parse(raw)
    return !!cfg.uid && !!cfg.token
  } catch {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // 优先从 sessionStorage 恢复 keep-alive 组件的滚动位置
    const scrollKey = `scrollPos_${String(to.name)}`
    const saved = sessionStorage.getItem(scrollKey)
    if (saved) {
      sessionStorage.removeItem(scrollKey)
      return { top: parseInt(saved) }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  if (isLoggedIn() || publicPages.includes(to.name as string)) {
    next()
  } else {
    next({ name: 'Login' })
  }
})

;(window as any).__router__ = router

export default router
