<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { getHotTopics } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const topicsDom = ref()

onMounted(async () => {
  topicsDom.value.endLoad()
  await loadHot()
})

const loadHot = async () => {
  topicsDom.value.startLoad()
  try {
    const result = await getHotTopics(pageIndex.value)
    if (!result?.results) {
      showToast('加载热门列表失败')
      return
    }
    if (pageIndex.value === 1) {
      topics.length = 0
    }
    topics.push(...result.results)
  } catch (e: any) {
    showToast(e.message || '加载热门列表失败')
  } finally {
    topicsDom.value.endLoad()
    pageIndex.value++
  }
}
</script>

<template>
  <Topics ref="topicsDom" :topics="topics" @load="loadHot()" />
</template>
