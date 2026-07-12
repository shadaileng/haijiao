<script setup lang="ts">
defineOptions({ name: 'SearchView' })
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topicsDom = ref()
const key = ref('')
const index = ref(1)
const skeletonLoading = ref(false)

const topics: LiteTopic[] = reactive([])

const search = async () => {
  if (!key.value) {
    showToast('请输入搜索关键词')
    return
  }
  skeletonLoading.value = true
  topicsDom.value?.startLoad()
  const result = await api.search({ params: { page: index.value, node_id: 0, key: key.value } })
  if (!result.success) {
    showToast(result.message || '搜索失败')
    skeletonLoading.value = false
    topicsDom.value?.endLoad()
    return
  }
  topics.push(...result.data.results)
  index.value++
  skeletonLoading.value = false
  topicsDom.value?.endLoad()
}
</script>

<template>
  <van-search v-model="key" placeholder="请输入搜索关键词" @search="search()" />
  <template v-if="skeletonLoading">
    <div v-for="i in 5" :key="i" class="skeleton-card">
      <van-skeleton title avatar :row="2" :loading="true" />
    </div>
  </template>
  <Topics v-else ref="topicsDom" :topics="topics" :skeletonLoading="false" @load="search()" />
</template>

<style scoped>
.skeleton-card {
  padding: 15px;
}
</style>
