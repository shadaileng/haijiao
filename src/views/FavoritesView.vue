<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/request'
import Topics from '@/components/Topics.vue'
import type { LiteTopic } from '@/types'
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
const selectedFolder = ref<Folder | null>(null)
const topics = ref<LiteTopic[]>([])
const loading = ref(true)
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 20

const loadFolders = async () => {
  loading.value = true
  const resp = await api.favoriteFolders()
  if (resp.success && resp.data) {
    folders.value = resp.data as Folder[]
    // 默认选中第一个收藏夹
    if (folders.value.length > 0 && !selectedFolder.value) {
      selectFolder(folders.value[0])
    } else {
      loading.value = false
    }
  } else {
    loading.value = false
  }
}

const selectFolder = async (folder: Folder) => {
  selectedFolder.value = folder
  await loadPage(1)
}

const loadPage = async (page: number) => {
  if (!selectedFolder.value) return
  loading.value = true
  const resp = await api.favoriteTopics({
    params: { page, limit: pageSize, folderId: selectedFolder.value.id, total: selectedFolder.value.count }
  })
  if (resp.success && resp.data) {
    topics.value = resp.data.results || []
    totalItems.value = resp.data.page?.total || 0
    pageIndex.value = page
  }
  loading.value = false
}

onMounted(() => loadFolders())

const onPageChange = (p: number) => loadPage(p)
</script>

<template>
  <div class="favorites-view">
    <van-nav-bar title="我的收藏" left-arrow @click-left="safeBack" :fixed="true" :placeholder="true" />

    <!-- 收藏夹选择 -->
    <div v-if="folders.length > 1" class="folder-tabs">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="folder-tab"
        :class="{ active: selectedFolder?.id === folder.id }"
        @click="selectFolder(folder)"
      >
        {{ folder.name }} ({{ folder.count }})
      </div>
    </div>

    <!-- 帖子列表 -->
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

.folder-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  background: #fff;
}

.folder-tab {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  background: #f7f8fa;
  color: #666;
  cursor: pointer;
}

.folder-tab.active {
  background: #07c160;
  color: #fff;
}
</style>
