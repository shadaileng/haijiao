<script setup lang="ts">
defineOptions({ name: 'FollowView' })
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import { useSettingsStore } from '@/stores/settings'
import type { FollowUser } from '@/types'
import { LOADING_URL } from '@/utils/constant'

const settings = useSettingsStore()
const loading = ref(false)
const skeletonLoading = ref(true)
const username = ref('')
const itemsAll = reactive<FollowUser[]>([])
const items = reactive<FollowUser[]>([])

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

const usernameFilter = () => {
  items.splice(
    0,
    items.length,
    ...itemsAll.filter(item => item.nickname?.includes(username.value))
  )
}
</script>

<template>
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
                    <div class="follow-top">
                      <a class="hv-link" @click="$router.push(`/homepage/${item.userId}/${item.nickname}`)">{{ item.nickname }}</a>
                      <van-tag plain type="primary">{{ item.fansCount }}</van-tag>
                    </div>
                    <div class="follow-sign">签名:{{ item.description || '这家伙很懒什么也没留下' }}</div>
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
  align-items: flex-start;
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
  gap: 6px;
}
.follow-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.follow-sign {
  font-size: 0.85rem;
  color: #999;
  text-align: left;
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
