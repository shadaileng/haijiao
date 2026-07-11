<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { searchTopics } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const store = useUserStore()

const key = ref('')
const index = ref(1)
const nodeId = ref(0)
const topics = reactive<LiteTopic[]>([])
const topicsDom = ref()

onMounted(() => {
  topicsDom.value?.endLoad()
})

const doSearch = async () => {
  if (!key.value.trim()) return
  topicsDom.value.startLoad()
  try {
    const result = await searchTopics(key.value, index.value, nodeId.value)
    if (!result?.results) {
      showToast('未找到相关内容')
      return
    }
    topics.push(...result.results)
    store.addSearchKey(key.value)
    store.cacheSearchTopics(key.value, result)
  } catch (e: any) {
    showToast(e.message || '搜索失败')
  } finally {
    topicsDom.value.endLoad()
    index.value++
  }
}
</script>

<template>
  <van-search v-model="key" placeholder="请输入搜索关键词" @search="doSearch()" />
  <Topics ref="topicsDom" :topics="topics" />
</template>
