<script setup lang="ts">
defineOptions({ name: 'HotTopicsView' })
import { ref, nextTick, onActivated, onDeactivated } from 'vue'
import { showToast } from 'vant'
import { api, TAB_CONFIG } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const TAB_LIST = Object.entries(TAB_CONFIG).map(([k, v]) => ({ index: Number(k), ...v }))

const activeTab = ref(Number(sessionStorage.getItem('hotActiveTab')) || 0)
const topicsMap: Record<number, LiteTopic[]> = {}
const pageMap: Record<number, number> = {}
const totalMap: Record<number, number> = {}
const scrollMap: Record<number, number> = {}
const pageSize = 20
const loading = ref(true)

const loadPage = async (page: number) => {
  loading.value = true
  const tab = activeTab.value
  const result = await api.tabTopics({ params: { tabIndex: tab, page, limit: pageSize } })
  if (!result.success) {
    showToast(result.message || '加载失败')
    loading.value = false
    return
  }
  topicsMap[tab] = result.data.results
  pageMap[tab] = page
  totalMap[tab] = result.data.page.total
  loading.value = false
}

const onTabChange = (newTab: number) => {
  scrollMap[activeTab.value] = window.scrollY
  activeTab.value = newTab
  sessionStorage.setItem('hotActiveTab', String(newTab))
  if (!topicsMap[newTab]) {
    loadPage(1)
  } else {
    nextTick(() => {
      window.scrollTo({ top: scrollMap[newTab] || 0 })
    })
  }
}

onActivated(() => {
  if (!topicsMap[activeTab.value]) {
    loadPage(1)
  }
  nextTick(() => {
    window.scrollTo({ top: scrollMap[activeTab.value] || 0 })
  })
})

onDeactivated(() => {
  scrollMap[activeTab.value] = window.scrollY
})
</script>

<template>
  <div class="hot-container">
    <div class="hot-tabs-sticky">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <van-tab v-for="tab in TAB_LIST" :key="tab.index" :title="tab.label" />
      </van-tabs>
    </div>
    <Topics
      mode="pagination"
      :topics="topicsMap[activeTab] || []"
      :skeletonLoading="loading"
      :pageIndex="pageMap[activeTab] || 1"
      :totalItems="totalMap[activeTab] || 0"
      :pageSize="pageSize"
      @pageChange="(p: number) => loadPage(p)"
    />
  </div>
</template>

<style scoped>
.hot-tabs-sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}
</style>
