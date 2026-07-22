<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { LiteTopic } from '@/types'
import Topics from '@/components/Topics.vue'

const route = useRoute()
const userId = ref((route.params.userId as string) || '')

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 15
const loading = ref(true)

onMounted(async () => {
  await loadPage(1)
})

const onClickLeft = () => history.back()

const loadPage = async (page: number) => {
  loading.value = true
  if (!userId.value) { loading.value = false; return }
  const resp = await api.topics({ params: { userId: userId.value, page, type: 1 } })
  if (!resp.success) {
    showToast(resp.message || '获取主题失败')
    loading.value = false
    return
  }
  const data = resp.data
  if (data?.results) {
    topics.length = 0
    topics.push(...data.results)
  }
  if (data?.page) {
    totalItems.value = data.page.total
    pageIndex.value = page
  }
  loading.value = false
}
</script>

<template>
  <van-nav-bar title="用户帖子" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
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
