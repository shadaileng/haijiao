<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

interface TabItem {
  name: string
  icon: string
  to: string
  label: string
  requireAuth?: boolean
}

const settings = useSettingsStore()
const active = ref('hot')

const tabs = ref<TabItem[]>([
  { name: 'hot', icon: 'home-o', to: '/hot', label: '主页' },
  { name: 'search', icon: 'search', to: '/search', label: '搜索' },
  { name: 'follow', icon: 'friends-o', to: '/follow', label: '关注', requireAuth: true },
  { name: 'settings', icon: 'setting-o', to: '/settings', label: '配置' },
])

const visibleTabs = computed(() =>
  tabs.value.filter(tab => !tab.requireAuth || settings.isLoggedIn)
)
</script>

<template>
  <van-tabbar v-model="active" route :fixed="true" :border="true">
    <van-tabbar-item
      v-for="tab in visibleTabs"
      :key="tab.name"
      :name="tab.name"
      :icon="tab.icon"
      :to="tab.to"
    >
      {{ tab.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>
