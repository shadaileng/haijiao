<script setup lang="ts">
defineOptions({ name: 'HotTopicsView' })
import { ref, reactive, onMounted, onDeactivated } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(Number(sessionStorage.getItem('hotPageIndex')) || 1)
const totalItems = ref(0)
const pageSize = 20
const loading = ref(true)
const SCROLL_KEY = 'scrollPos_Hot'

onMounted(() => {
  loadPage(pageIndex.value)
})

onDeactivated(() => {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
})

const loadPage = async (page: number) => {
  loading.value = true
  const result = await api.hot({ params: { page, limit: pageSize } })
  if (!result.success) {
    showToast(result.message || '加载热门列表失败')
    loading.value = false
    return
  }
  topics.length = 0
  topics.push(...result.data.results)
  totalItems.value = result.data.page.total
  pageIndex.value = page
  sessionStorage.setItem('hotPageIndex', String(page))
  loading.value = false
  sessionStorage.removeItem(SCROLL_KEY)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Topics
    mode="pagination"
    :topics="topics"
    :skeletonLoading="loading"
    :pageIndex="pageIndex"
    :totalItems="totalItems"
    :pageSize="pageSize"
    @pageChange="loadPage"
  />
</template>

<style scoped>
</style>
