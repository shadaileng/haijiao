<script setup lang="ts">
defineOptions({ name: 'UserHomeView' })
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { User, LiteTopicPage } from '@/types'
import UserInfo from '@/components/UserInfo.vue'
import Topics from '@/components/Topics.vue'

const route = useRoute()

const userId = ref((route.params.userId as string) || '')
const nickname = ref((route.params.nickname as string) || '')
const userInfo = ref<User | null>(null)
const topicsDom = ref()
const skeletonLoading = ref(true)

const liteTopics: LiteTopicPage = reactive({ results: [], page: { index: 1, size: 10, total: 0 } })

const onClickLeft = () => history.back()

onMounted(async () => {
  if (userId.value) {
    await loadUserInfo(userId.value)
  }
  await pageto(1)
  skeletonLoading.value = false
})

watch(() => route.params.userId, async (newId) => {
  if (newId && newId !== userId.value) {
    skeletonLoading.value = true
    userId.value = newId as string
    nickname.value = (route.params.nickname as string) || ''
    userInfo.value = null
    liteTopics.results.splice(0, liteTopics.results.length)
    liteTopics.page.index = 1
    liteTopics.page.total = 0
    await loadUserInfo(userId.value)
    await pageto(1)
    skeletonLoading.value = false
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
  <van-nav-bar :title="nickname || '用户主页'" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
  <template v-if="skeletonLoading">
    <div class="skeleton-card van-hairline--bottom">
      <van-row>
        <van-col span="6">
          <van-skeleton-avatar :row="0" />
        </van-col>
        <van-col span="16">
          <van-skeleton-title :row="1" />
          <van-skeleton-title :row="1" style="width: 60%;" />
          <van-skeleton-title :row="1" style="width: 40%;" />
        </van-col>
      </van-row>
    </div>
    <div v-for="i in 3" :key="i" class="skeleton-card">
      <van-skeleton title avatar :row="2" :loading="true" />
    </div>
  </template>
  <template v-else>
    <UserInfo v-if="userInfo" :userInfo="userInfo" />
    <Topics ref="topicsDom" :topics="liteTopics.results" :skeletonLoading="false" @load="loadMore()" />
  </template>
</template>

<style scoped>
.skeleton-card {
  padding: 15px;
}
</style>
