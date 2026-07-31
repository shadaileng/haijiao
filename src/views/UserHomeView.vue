<script setup lang="ts">
defineOptions({ name: 'UserHomeView' })
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { api } from '@/api/request'
import type { User, LiteTopic } from '@/types'
import UserInfo from '@/components/UserInfo.vue'
import Topics from '@/components/Topics.vue'
import { useSafeBack } from '@/utils/navigation'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const safeBack = useSafeBack()
const historyStore = useHistoryStore()
const settings = useSettingsStore()
const userStore = useUserStore()

const userId = ref((route.params.userId as string) || '')
const userInfo = ref<User | null>(null)

const topics: LiteTopic[] = reactive([])
const pageIndex = ref(1)
const totalItems = ref(0)
const pageSize = 15
const loading = ref(true)

const isFollowing = ref(false)
const followLoading = ref(false)

const isSelf = computed(() => {
  return settings.isLoggedIn && String(settings.uid) === String(userId.value)
})

const onClickLeft = () => safeBack()

onMounted(async () => {
  try {
    if (userId.value) {
      await loadUserInfo(userId.value)
      if (!isSelf.value && settings.isLoggedIn) {
        await checkFollowStatus()
      }
    }
    await loadPage(1)
  } catch (e) {
    console.warn('user home init failed:', e)
  }
})

watch(() => route.params.userId, async (newId) => {
  if (newId && newId !== userId.value) {
    userId.value = newId as string
    userInfo.value = null
    topics.length = 0
    loading.value = true
    pageIndex.value = 1
    totalItems.value = 0
    isFollowing.value = false
    try {
      await loadUserInfo(userId.value)
      if (!isSelf.value && settings.isLoggedIn) {
        await checkFollowStatus()
      }
      await loadPage(1)
    } catch (e) {
      console.warn('user home watch failed:', e)
    }
  }
})

const loadUserInfo = async (id: string) => {
  const resp = await api.userinfo({ uid: id })
  if (resp.success && resp.data?.user) {
    const u = resp.data.user
    u.userId = u.id
    userInfo.value = u
    historyStore.addRecord('user', id, u.nickname || '用户 ' + id)
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

const checkFollowStatus = async () => {
  if (!userId.value) return
  const cached = userStore.getFollow()
  const cachedFollow = cached.some(u => String(u.userId) === String(userId.value))
  if (cachedFollow) {
    isFollowing.value = true
    return
  }
  const resp = await api.checkFollow({ params: { userId: userId.value } })
  if (resp.success && resp.data) {
    isFollowing.value = resp.data.isFollow
  }
}

const toggleFollow = async () => {
  if (!settings.isLoggedIn) {
    showToast('请先登录')
    return
  }
  if (followLoading.value) return

  if (isFollowing.value) {
    try {
      await showConfirmDialog({
        title: '取消关注',
        message: `确定要取消关注「${userInfo.value?.nickname || '该用户'}」吗？`,
      })
    } catch {
      return
    }
  }

  followLoading.value = true
  try {
    if (isFollowing.value) {
      const resp = await api.cancelFollow({ params: { userId: userId.value } })
      if (resp.success) {
        isFollowing.value = false
        showToast('已取消关注')
      } else {
        showToast(resp.message || '操作失败')
      }
    } else {
      const resp = await api.addFollow({ params: { userId: userId.value } })
      if (resp.success) {
        isFollowing.value = true
        showToast('关注成功')
      } else {
        showToast(resp.message || '操作失败')
      }
    }
  } catch (e) {
    showToast('操作失败')
  } finally {
    followLoading.value = false
  }
}
</script>

<template>
  <van-nav-bar :title="userInfo?.nickname || '用户主页'" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
  <div class="user-info-wrapper">
    <UserInfo v-if="userInfo" :userInfo="userInfo" />
    <van-button
      v-if="!isSelf && settings.isLoggedIn"
      class="follow-btn"
      :type="isFollowing ? 'default' : 'primary'"
      size="small"
      :loading="followLoading"
      @click="toggleFollow"
    >
      {{ isFollowing ? '已关注' : '关注' }}
    </van-button>
  </div>
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

<style scoped>
.user-info-wrapper {
  position: relative;
}
.follow-btn {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  z-index: 1;
}
</style>
