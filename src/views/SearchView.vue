<script setup lang="ts">
defineOptions({ name: 'SearchView' })
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { showToast } from 'vant'
import type { LiteTopic } from '@/types'
import { api } from '@/api/request'
import Topics from '@/components/Topics.vue'
const topicsDom = ref()
const key = ref('')
const index = ref(1)
const skeletonLoading = ref(true)
const hasSearched = ref(false)

const topics: LiteTopic[] = reactive([])
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
  index.value = 1
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
  const isFirstPage = topics.length === 0
  if (isFirstPage) {
    skeletonLoading.value = true
  }
  hasSearched.value = true
  topicsDom.value?.startLoad()
  const result = await api.search({ params: { page: index.value, node_id: 0, key: key.value } })
  if (!result.success) {
    showToast(result.message || '搜索失败')
    if (isFirstPage) skeletonLoading.value = false
    topicsDom.value?.endLoad()
    return
  }
  if (result.data?.results) {
    topics.push(...result.data.results)
  }
  index.value++
  if (isFirstPage) {
    skeletonLoading.value = false
    await nextTick()
  }
  topicsDom.value?.endLoad()
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
  <template v-else-if="skeletonLoading">
    <div v-for="i in 5" :key="i" class="skeleton-card">
      <van-skeleton title avatar :row="2" :loading="true" />
    </div>
  </template>
  <Topics v-else ref="topicsDom" :topics="topics" :skeletonLoading="false" @load="search()" />
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
