<script setup lang="ts">
defineOptions({ name: 'FollowView' })
import { ref, reactive, onMounted, onActivated, onDeactivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { api } from '@/api/request'
import { useSettingsStore } from '@/stores/settings'
import type { FollowUser } from '@/types'
import { LOADING_URL } from '@/utils/constant'

const router = useRouter()
const settings = useSettingsStore()
const loading = ref(false)
const skeletonLoading = ref(true)
const username = ref('')
const itemsAll = reactive<FollowUser[]>([])
const items = reactive<FollowUser[]>([])
const unfollowLoading = ref<number | null>(null)

onMounted(async () => {
  if (!settings.isLoggedIn) return
  loading.value = true
  const result = await api.follow()
  if (!result.success) {
    showToast(result.message || '加载关注列表失败')
    loading.value = false
    skeletonLoading.value = false
    return
  }
  itemsAll.splice(0, itemsAll.length, ...result.data)
  usernameFilter()
  loading.value = false
  skeletonLoading.value = false
})

onDeactivated(() => {
  sessionStorage.setItem('scrollPos_SettingsFollow', String(window.scrollY))
})

onActivated(() => {
  const saved = Number(sessionStorage.getItem('scrollPos_SettingsFollow') || '0')
  sessionStorage.removeItem('scrollPos_SettingsFollow')
  if (saved > 0) {
    nextTick(() => {
      window.scrollTo(0, saved)
    })
  }
})

const usernameFilter = () => {
  items.splice(
    0,
    items.length,
    ...itemsAll.filter(item => item.nickname?.includes(username.value))
  )
}

const handleUnfollow = async (item: FollowUser) => {
  try {
    await showConfirmDialog({
      title: '取消关注',
      message: `确定要取消关注「${item.nickname}」吗？`,
    })
  } catch {
    return
  }
  unfollowLoading.value = item.userId
  try {
    const resp = await api.cancelFollow({ params: { userId: item.userId } })
    if (resp.success) {
      showToast('已取消关注')
      const idx = itemsAll.findIndex(i => i.userId === item.userId)
      if (idx !== -1) itemsAll.splice(idx, 1)
      usernameFilter()
    } else {
      showToast(resp.message || '操作失败')
    }
  } catch {
    showToast('操作失败')
  } finally {
    unfollowLoading.value = null
  }
}
</script>

<template>
  <van-nav-bar title="关注" left-arrow @click-left="router.push('/settings')" />
  <van-search
    v-model="username"
    @search="usernameFilter"
    placeholder="搜索昵称"
  />
  <template v-if="skeletonLoading">
    <div v-for="i in 5" :key="i" class="skeleton-card">
      <van-row>
        <van-col span="6">
          <van-skeleton-avatar :row="0" />
        </van-col>
        <van-col span="16">
          <van-skeleton-title :row="1" />
          <van-skeleton-title :row="1" style="width: 50%;" />
        </van-col>
      </van-row>
    </div>
  </template>
  <template v-else>
    <van-pull-refresh v-model="loading">
      <van-list :loading="loading" finished finished-text="没有更多了">
        <van-cell v-for="item in items" :key="item.userId">
          <template #value>
            <div class="card">
              <div class="follow-item">
                <van-image
                  round
                  width="4rem"
                  height="4rem"
                  :src="LOADING_URL"
                  v-headicon="item.avatar?.startsWith('http') ? item.avatar + '.txt' : item.avatar"
                  class="follow-avatar"
                />
                <div class="follow-body">
                  <a class="hv-link" @click="$router.push(`/homepage/${item.userId}`)">{{ item.nickname }}</a>
                  <div class="follow-sign">{{ item.description || '这家伙很懒什么也没留下' }}</div>
                </div>
                <div class="follow-actions">
                  <van-button
                    size="small"
                    type="danger"
                    plain
                    :loading="unfollowLoading === item.userId"
                    @click="handleUnfollow(item)"
                  >
                    取消关注
                  </van-button>
                  <div class="follow-count">粉丝: {{ item.fansCount }}</div>
                </div>
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
      <van-back-top />
    </van-pull-refresh>
  </template>
</template>

<style scoped>
.card {
  padding: 0;
}
.follow-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.follow-avatar {
  flex-shrink: 0;
}
.follow-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.follow-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.follow-count {
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
}
.follow-sign {
  font-size: 0.85rem;
  color: #999;
}
.hv-link {
  text-decoration: none;
  cursor: pointer;
  color: #505050;
}
.skeleton-card {
  padding: 15px;
}
</style>
