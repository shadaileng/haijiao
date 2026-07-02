import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
