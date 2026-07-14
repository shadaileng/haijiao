<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopicPage } from '@/types'
import Topics from '@/components/Topics.vue'

const route = useRoute()
const userId = ref((route.params.userId as string) || '')
const topicsDom = ref()
const skeletonLoading = ref(true)

const liteTopics: LiteTopicPage = reactive({ results: [], page: { index: 1, size: 10, total: 0 } })

onMounted(async () => {
  topicsDom.value?.endLoad()
  await pageto(1)
  skeletonLoading.value = false
})

const onClickLeft = () => history.back()

const pageto = async (index: number) => {
  if (!userId.value) return
  const resp = await api.topics({ params: { userId: userId.value, page: index, type: 1 } })
  if (!resp.success) {
    showToast(resp.message || '获取主题失败')
    return
  }
  const data = resp.data
  if (data?.results) {
    liteTopics.results.splice(0, liteTopics.results.length, ...data.results)
  }
  if (data?.page) {
    liteTopics.page.index = data.page.page
    liteTopics.page.size = data.page.limit
    liteTopics.page.total = data.page.total
  }
}

const loadMore = () => {
  if (liteTopics.page.index < Math.ceil(liteTopics.page.total / liteTopics.page.size)) {
    pageto(liteTopics.page.index + 1)
  }
}
</script>

<template>
  <van-nav-bar title="用户帖子" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
  <Topics ref="topicsDom" :topics="liteTopics.results" :skeletonLoading="skeletonLoading" @load="loadMore()" />
</template>
