<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/request'
import Topics from '@/components/Topics.vue'
import type { LiteTopic } from '@/types'
import { useSafeBack } from '@/utils/navigation'

defineOptions({ name: 'FavoritesView' })

const safeBack = useSafeBack()
const topics = ref<LiteTopic[]>([])
const loading = ref(true)
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 20

const loadPage = async (page: number) => {
  loading.value = true
  const resp = await api.favoriteTopics({ params: { page, limit: pageSize } })
  if (resp.success && resp.data) {
    topics.value = resp.data.results || []
    totalItems.value = resp.data.page?.total || 0
    pageIndex.value = page
  }
  loading.value = false
}

onMounted(() => loadPage(1))

const onPageChange = (p: number) => loadPage(p)
</script>

<template>
  <div class="favorites-view">
    <van-nav-bar title="我的收藏" left-arrow @click-left="safeBack" :fixed="true" :placeholder="true" />
    <Topics
      :topics="topics"
      :skeleton-loading="loading"
      mode="pagination"
      :page-index="pageIndex"
      :total-items="totalItems"
      :page-size="pageSize"
      @page-change="onPageChange"
    />
  </div>
</template>

<style scoped>
.favorites-view {
  min-height: 100vh;
  background: #f7f8fa;
}
</style>
