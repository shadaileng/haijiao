<script setup lang="ts">
import { ref, nextTick, onActivated, onDeactivated } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'
import { useSafeBack } from '@/utils/navigation'

defineOptions({ name: 'FavoritesView' })

const safeBack = useSafeBack()

interface Folder {
  id: number
  name: string
  count: number
  coverUrl?: string
  folder_type?: string
}

const folders = ref<Folder[]>([])
const activeFolderIndex = ref(0)
const topicsMap: Record<number, LiteTopic[]> = {}
const pageMap: Record<number, number> = {}
const totalMap: Record<number, number> = {}
const scrollMap: Record<number, number> = {}
const lastFirstTopicIdMap: Record<number, string | number> = {}
const latest = ref<{ topics: LiteTopic[]; total: number }>()
const loading = ref(true)
const pageSize = 20
const loaded = ref(false)

const loadFolders = async () => {
  const resp = await api.favoriteFolders()
  if (resp.success && Array.isArray(resp.data) && resp.data.length > 0) {
    folders.value = resp.data
    return true
  }
  loading.value = false
  return false
}

const loadPage = async (page: number) => {
  const folder = folders.value[activeFolderIndex.value]
  if (!folder) return
  loading.value = true
  const resp = await api.favoriteTopics({
    params: { page, limit: pageSize, folderId: folder.id, total: folder.count }
  })
  if (resp.success && resp.data) {
    const tab = activeFolderIndex.value
    topicsMap[tab] = resp.data.results || []
    pageMap[tab] = page
    totalMap[tab] = resp.data.page?.total || 0
    if (page === 1 && resp.data.results && resp.data.results.length > 0) {
      lastFirstTopicIdMap[tab] = resp.data.results[0].topicId
    }
  } else {
    showToast(resp.message || '加载失败')
  }
  loading.value = false
}

const checkUpdate = async () => {
  const tab = activeFolderIndex.value
  const folder = folders.value[tab]
  if (!folder || !lastFirstTopicIdMap[tab]) return
  const resp = await api.favoriteTopics({
    params: { page: 1, limit: pageSize, folderId: folder.id, total: folder.count }
  })
  if (!resp.success || !resp.data.results?.length) return
  const latestFirstId = resp.data.results[0].topicId
  if (latestFirstId !== lastFirstTopicIdMap[tab]) {
    latest.value = {
      topics: resp.data.results,
      total: resp.data.page?.total || 0
    }
  }
}

const onApply = () => {
  const tab = activeFolderIndex.value
  if (latest.value) {
    topicsMap[tab] = latest.value.topics
    lastFirstTopicIdMap[tab] = latest.value.topics[0].topicId
    pageMap[tab] = 1
    totalMap[tab] = latest.value.total
    latest.value = undefined
  } else {
    loadPage(1)
  }
  nextTick(() => { window.scrollTo({ top: 0 }) })
}

const onFolderChange = (newIndex: number) => {
  scrollMap[activeFolderIndex.value] = window.scrollY
  activeFolderIndex.value = newIndex
  latest.value = undefined
  if (!topicsMap[newIndex]) {
    loadPage(1)
  } else {
    nextTick(() => {
      window.scrollTo({ top: scrollMap[newIndex] || 0 })
    })
  }
}

onActivated(async () => {
  if (!loaded.value) {
    const ok = await loadFolders()
    if (ok) {
      loaded.value = true
      await loadPage(1)
    }
  } else {
    checkUpdate()
  }
  nextTick(() => {
    window.scrollTo({ top: scrollMap[activeFolderIndex.value] || 0 })
  })
})

onDeactivated(() => {
  scrollMap[activeFolderIndex.value] = window.scrollY
})

const onPageChange = (p: number) => loadPage(p)
</script>

<template>
  <div class="favorites-view">
    <van-nav-bar title="我的收藏" left-arrow @click-left="safeBack" :fixed="true" :placeholder="true" />

    <div v-if="folders.length > 1" class="folder-tabs-sticky">
      <van-tabs v-model:active="activeFolderIndex" @change="onFolderChange">
        <van-tab v-for="folder in folders" :key="folder.id" :title="`${folder.name} (${folder.count})`" />
      </van-tabs>
    </div>

    <Topics
      :topics="topicsMap[activeFolderIndex] || []"
      :skeleton-loading="loading"
      mode="pagination"
      :page-index="pageMap[activeFolderIndex] || 1"
      :total-items="totalMap[activeFolderIndex] || 0"
      :page-size="pageSize"
      :baseline-first-id="lastFirstTopicIdMap[activeFolderIndex]"
      :latest="latest"
      @page-change="onPageChange"
      @apply="onApply"
    />
  </div>
</template>

<style scoped>
.favorites-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.folder-tabs-sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}
</style>
