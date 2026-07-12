<script setup lang="ts">
defineOptions({ name: 'HotTopicsView' })
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const topicsDom = ref()
const skeletonLoading = ref(true)

onMounted(() => {
  topicsDom.value.endLoad()
  loadHot()
})

const loadHot = async () => {
  topicsDom.value.startLoad()
  const result = await api.hot({ params: { page: pageIndex.value } })
  if (!result.success) {
    showToast(result.message || '加载热门列表失败')
    topicsDom.value.endLoad()
    skeletonLoading.value = false
    return
  }
  if (pageIndex.value === 1) {
    topics.length = 0
  }
  topics.push(...result.data.results)
  pageIndex.value++
  topicsDom.value.endLoad()
  skeletonLoading.value = false
}
</script>

<template>
  <template v-if="skeletonLoading">
    <div v-for="i in 5" :key="i" class="skeleton-card">
      <van-skeleton title avatar :row="2" :loading="true" />
    </div>
  </template>
  <Topics v-else ref="topicsDom" :topics="topics" :skeletonLoading="false" @load="loadHot()" />
</template>

<style scoped>
.skeleton-card {
  padding: 15px;
}
</style>
