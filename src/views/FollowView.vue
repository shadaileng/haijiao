<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '@/api/request'
import { useSettingsStore } from '@/stores/settings'
import type { FollowUser } from '@/types'

const settings = useSettingsStore()
const loading = ref(false)
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
    return
  }
  itemsAll.splice(0, itemsAll.length, ...result.data)
  usernameFilter()
  loading.value = false
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
  <van-pull-refresh v-model="loading">
    <van-list :loading="loading" finished finished-text="没有更多了">
      <van-cell v-for="item in items" :key="item.userId">
        <template #value>
          <div class="card">
            <van-row>
              <van-col span="6">
                <van-image
                  round
                  width="4rem"
                  height="4rem"
                  src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                  v-headicon="item.avatar?.startsWith('http') ? item.avatar + '.txt' : item.avatar"
                />
              </van-col>
              <van-col span="16" class="hv-text-start">
                <van-row>
                  <van-col span="16">
                    <a class="hv-link" @click="$router.push(`/homepage/${item.userId}/${item.nickname}`)">{{ item.nickname }}</a>
                  </van-col>
                  <van-col span="8"><van-tag plain type="primary">{{ item.fansCount }}</van-tag></van-col>
                </van-row>
                <van-row>
                  <van-col span="24" class="hv-sign">签名:{{ item.description || '这家伙很懒什么也没留下' }}</van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-back-top />
  </van-pull-refresh>
</template>

<style scoped>
.card {
  text-align: center;
  padding: 0;
}
.hv-link {
  text-decoration: none;
  cursor: pointer;
  color: #505050;
}
</style>
