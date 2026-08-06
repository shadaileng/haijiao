<script setup lang="ts">
defineOptions({ name: 'NodeTopicsView' })
import { ref, reactive, onMounted, onActivated, watch, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
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
const nodeName = ref('')

const currentId = ref(Number(route.params.nodeId) || 0)
const topicsMap: Record<number, LiteTopic[]> = {}
const pageMap: Record<number, number> = {}
const totalMap: Record<number, number> = {}
const nameMap: Record<number, string> = {}
const scrollCache: Record<number, number> = {}
const lastFirstTopicIdMap: Record<number, string | number> = {}
const latest = ref<{ topics: LiteTopic[]; total: number }>()

function syncToReactive(nid: number) {
  topics.length = 0
  if (topicsMap[nid]) topics.push(...topicsMap[nid])
  pageIndex.value = pageMap[nid] || 1
  totalItems.value = totalMap[nid] || 0
  nodeName.value = nameMap[nid] || ''
}

async function loadPage(page: number) {
  const nid = currentId.value
  loading.value = true
  const result = await api.nodeTopics({ params: { nodeId: nid, page, limit: pageSize } })
  if (!result.success) {
    showToast(result.message || '加载失败')
    loading.value = false
    return
  }
  if (result.data?.results) {
    topicsMap[nid] = result.data.results
    pageMap[nid] = page
    totalMap[nid] = result.data.page?.total || 0
    if (result.data.results.length > 0 && result.data.results[0].node?.name) {
      nameMap[nid] = result.data.results[0].node.name
    }
    if (page === 1 && result.data.results.length > 0) {
      lastFirstTopicIdMap[nid] = result.data.results[0].topicId
    }
    syncToReactive(nid)
  }
  loading.value = false
}

const checkUpdate = async () => {
  const nid = currentId.value
  if (!lastFirstTopicIdMap[nid]) return
  const result = await api.nodeTopics({ params: { nodeId: nid, page: 1, limit: pageSize } })
  if (!result.success || !result.data.results?.length) return
  const latestFirstId = result.data.results[0].topicId
  if (latestFirstId !== lastFirstTopicIdMap[nid]) {
    latest.value = {
      topics: result.data.results,
      total: result.data.page?.total || 0
    }
  }
}

const onApply = () => {
  const nid = currentId.value
  if (latest.value) {
    topicsMap[nid] = latest.value.topics
    lastFirstTopicIdMap[nid] = latest.value.topics[0].topicId
    pageMap[nid] = 1
    totalMap[nid] = latest.value.total
    if (latest.value.topics.length > 0 && latest.value.topics[0].node?.name) {
      nameMap[nid] = latest.value.topics[0].node.name
    }
    latest.value = undefined
    syncToReactive(nid)
  } else {
    loadPage(1)
  }
  nextTick(() => { window.scrollTo({ top: 0 }) })
}

function switchNode(nid: number) {
  if (nid === currentId.value) return
  scrollCache[currentId.value] = window.scrollY
  currentId.value = nid
  latest.value = undefined
  if (topicsMap[nid]) {
    syncToReactive(nid)
    const saved = scrollCache[nid] || 0
    if (saved > 0) setTimeout(() => window.scrollTo(0, saved), 0)
  } else {
    loadPage(1)
  }
}

watch(() => route.params.nodeId, (newId) => {
  if (newId) switchNode(Number(newId))
})

onMounted(() => {
  currentId.value = Number(route.params.nodeId) || 0
  if (!topicsMap[currentId.value]) loadPage(1)
  else syncToReactive(currentId.value)
})

onActivated(() => {
  const nid = Number(route.params.nodeId) || 0
  if (nid !== currentId.value) {
    currentId.value = nid
    latest.value = undefined
    if (topicsMap[nid]) syncToReactive(nid)
    else loadPage(1)
  } else {
    checkUpdate()
  }
  const saved = scrollCache[currentId.value] || 0
  if (saved > 0) {
    setTimeout(() => {
      window.scrollTo(0, saved)
    }, 0)
  }
})

onBeforeRouteLeave(() => {
  scrollCache[currentId.value] = window.scrollY
})
</script>

<template>
  <div class="node-topics-container">
    <div class="node-topics-header-sticky">
      <van-nav-bar :title="nodeName || '板块帖子'" left-arrow @click-left="router.back()" />
    </div>
    <Topics
      mode="pagination"
      :topics="topics"
      :skeletonLoading="loading"
      :pageIndex="pageIndex"
      :totalItems="totalItems"
      :pageSize="pageSize"
      :baselineFirstId="lastFirstTopicIdMap[currentId]"
      :latest="latest"
      @pageChange="(p: number) => loadPage(p)"
      @apply="onApply"
    />
  </div>
</template>

<style scoped>
.node-topics-header-sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}
</style>
