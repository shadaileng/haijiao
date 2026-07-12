<script setup lang="ts">
defineOptions({ name: 'SearchView' })
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const topicsDom = ref()
const key = ref('')
const index = ref(1)

const topics: LiteTopic[] = reactive([])

onMounted(() => {
  topicsDom.value?.endLoad()
})

const search = async () => {
  if (!key.value) {
    showToast('请输入搜索关键词')
    return
  }
  topicsDom.value?.startLoad()
  const result = await api.search({ params: { page: index.value, node_id: 0, key: key.value } })
  if (!result.success) {
    showToast(result.message || '搜索失败')
    topicsDom.value?.endLoad()
    return
  }
  topics.push(...result.data.results)
  index.value++
  topicsDom.value?.endLoad()
}
</script>

<template>
  <van-search v-model="key" placeholder="请输入搜索关键词" @search="search()" />
  <Topics ref="topicsDom" :topics="topics" @load="search()" />
</template>
