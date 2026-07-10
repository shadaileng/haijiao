<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getFollowList } from '@/api/request'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const uid = ref(store.uid || '')
const token = ref(store.token || '')
const loading = ref(false)
const followList = ref<any[]>([])

onMounted(() => {
  const routeUid = route.params.userId as string
  if (routeUid) {
    uid.value = routeUid
  }
  if (store.followMap[uid.value]) {
    followList.value = store.followMap[uid.value]
  }
})

watch(uid, (newUid) => {
  if (store.followMap[newUid]) {
    followList.value = store.followMap[newUid]
  } else {
    followList.value = []
  }
})

async function loadFollow() {
  if (!uid.value || !token.value) {
    showToast('请先在设置中填写UID和Token')
    return
  }

  loading.value = true
  try {
    const data = await getFollowList(token.value, uid.value)
    if (!data || !Array.isArray(data)) {
      showToast('获取关注列表失败')
      return
    }

    followList.value = data
    store.cacheFollow(uid.value, data)
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

function goToUser(userId: string) {
  router.push(`/user/${userId}`)
}

function openUserProfile(userId: string) {
  window.open(`https://haijiao.com/homepage/last/${userId}`, '_blank')
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccessToast('已复制')
  })
}
</script>

<template>
  <div class="follow-view">
    <van-nav-bar title="关注用户" left-arrow @click-left="router.back()" />

    <van-cell-group inset class="input-group">
      <van-field v-model="uid" label="UID" placeholder="输入用户ID" clearable />
      <van-field v-model="token" label="Token" placeholder="输入登录Token" type="password" clearable />
      <van-button
        type="primary"
        block
        round
        :loading="loading"
        @click="loadFollow"
        class="load-btn"
      >
        加载关注列表
      </van-button>
    </van-cell-group>

    <van-list
      v-model:loading="loading"
      :finished="followList.length === 0"
      finished-text="暂无数据"
      class="list-section"
    >
      <van-cell-group inset v-if="followList.length > 0">
        <van-cell
          v-for="item in followList"
          :key="item.userId"
          :title="item.nickname"
          :label="'ID: ' + item.userId"
          is-link
          @click="goToUser(item.userId)"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
          <template #extra>
            <van-button
              size="mini"
              type="success"
              @click.stop="openUserProfile(item.userId)"
            >
              主页
            </van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <van-empty v-else-if="!loading" description="输入UID和Token加载关注列表" />
    </van-list>
  </div>
</template>

<style scoped>
.follow-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.input-group {
  margin: 12px;
}

.load-btn {
  margin: 12px;
}

.list-section {
  margin-top: 12px;
}
</style>
