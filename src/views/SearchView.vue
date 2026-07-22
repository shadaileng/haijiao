<script setup lang="ts">
defineOptions({ name: 'SearchView' })
import { ref, reactive, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import type { LiteTopic } from '@/types'
import { api } from '@/api/request'
import Topics from '@/components/Topics.vue'

const key = ref('')
const skeletonLoading = ref(true)
const hasSearched = ref(false)
const loading = ref(false)

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 20

const tags = reactive<any[]>([])

onMounted(async () => {
  const result = await api.tags()
  if (result.success && result.data) {
    const list = Array.isArray(result.data) ? result.data : (result.data.results || [])
    tags.splice(0, tags.length, ...list)
  }
  skeletonLoading.value = false
})

const onClear = () => {
  key.value = ''
  hasSearched.value = false
  topics.splice(0, topics.length)
  pageIndex.value = 1
  totalItems.value = 0
}

watch(key, (val) => {
  if (!val && hasSearched.value) {
    onClear()
  }
})

const search = async (tag?: string) => {
  if (tag) {
    key.value = tag
  }
  if (!key.value) {
    showToast('请输入搜索关键词')
    return
  }
  hasSearched.value = true
  await loadPage(1)
}

const loadPage = async (page: number) => {
  loading.value = true
  const result = await api.search({ params: { page, node_id: 0, key: key.value } })
  if (!result.success) {
    showToast(result.message || '搜索失败')
    loading.value = false
    return
  }
  if (result.data?.results) {
    topics.length = 0
    topics.push(...result.data.results)
  }
  if (result.data?.page) {
    totalItems.value = result.data.page.total
    pageIndex.value = page
  }
  loading.value = false
}
</script>

<template>
  <van-search
    v-model="key"
    placeholder="请输入搜索关键词"
    clearable
    clear-trigger="always"
    @search="search()"
    @clear="onClear"
  />
  <template v-if="!hasSearched">
    <div v-if="skeletonLoading" class="skeleton-card">
      <van-skeleton title :row="3" :loading="true" />
    </div>
    <div v-else-if="tags.length" class="hot-tags">
      <div class="hot-tags-title">热门标签</div>
      <div class="hot-tags-list">
        <van-tag
          v-for="tag in tags"
          :key="tag.tagId"
          size="large"
          plain
          type="primary"
          class="hot-tag"
          @click="search(tag.tagName)"
        >{{ tag.tagName }}</van-tag>
      </div>
    </div>
  </template>
  <Topics
    v-else
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
.hot-tags {
  padding: 20px 15px;
}
.hot-tags-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}
.hot-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.hot-tag {
  cursor: pointer;
}
.skeleton-card {
  padding: 15px;
}
</style>
