<script setup lang="ts">
defineOptions({ name: 'NodeTopicsView' })
import { ref, reactive, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const route = useRoute()
const router = useRouter()

const topics = reactive<LiteTopic[]>([])
const loading = ref(true)
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 20
const nodeId = ref(Number(route.params.nodeId))
const nodeName = ref('')

const loadPage = async (page: number) => {
  loading.value = true
  const result = await api.nodeTopics({ params: { nodeId: nodeId.value, page, limit: pageSize } })
  if (!result.success) {
    showToast(result.message || '加载失败')
    loading.value = false
    return
  }
  if (result.data?.results) {
    topics.length = 0
    topics.push(...result.data.results)
    if (result.data.results.length > 0 && result.data.results[0].node?.name) {
      nodeName.value = result.data.results[0].node.name
    }
  }
  if (result.data?.page) {
    totalItems.value = result.data.page.total
    pageIndex.value = page
  }
  loading.value = false
}

onActivated(() => {
  nodeId.value = Number(route.params.nodeId)
  loadPage(1)
})
</script>

<template>
  <van-nav-bar :title="nodeName || '板块帖子'" left-arrow @click-left="router.back()" />
  <Topics
    mode="pagination"
    :topics="topics"
    :skeletonLoading="loading"
    :pageIndex="pageIndex"
    :totalItems="totalItems"
    :pageSize="pageSize"
    @pageChange="loadPage"
  />
</template>
