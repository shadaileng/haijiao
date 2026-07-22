<script setup lang="ts">
defineOptions({ name: 'UserHomeView' })
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { User, LiteTopic } from '@/types'
import UserInfo from '@/components/UserInfo.vue'
import Topics from '@/components/Topics.vue'

const route = useRoute()

const userId = ref((route.params.userId as string) || '')
const nickname = ref((route.params.nickname as string) || '')
const userInfo = ref<User | null>(null)

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 15
const loading = ref(true)

const onClickLeft = () => history.back()

onMounted(async () => {
  if (userId.value) {
    await loadUserInfo(userId.value)
  }
  await loadPage(1)
})

watch(() => route.params.userId, async (newId) => {
  if (newId && newId !== userId.value) {
    userId.value = newId as string
    nickname.value = (route.params.nickname as string) || ''
    userInfo.value = null
    topics.length = 0
    loading.value = true
    pageIndex.value = 1
    totalItems.value = 0
    await loadUserInfo(userId.value)
    await loadPage(1)
  }
})

const loadUserInfo = async (id: string) => {
  const resp = await api.userinfo({ uid: id })
  if (resp.success && resp.data?.user) {
    const u = resp.data.user
    u.userId = u.id
    userInfo.value = u
  }
}

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
  <van-nav-bar :title="nickname || '用户主页'" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
  <UserInfo v-if="userInfo" :userInfo="userInfo" />
  <van-divider v-if="userInfo" />
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
