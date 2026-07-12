<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const topicsDom = ref()

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
    return
  }
  if (pageIndex.value === 1) {
    topics.length = 0
  }
  topics.push(...result.data.results)
  pageIndex.value++
  topicsDom.value.endLoad()
}
</script>

<template>
  <Topics ref="topicsDom" :topics="topics" @load="loadHot()" />
</template>
