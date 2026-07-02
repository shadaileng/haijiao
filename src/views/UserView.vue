<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserTopics } from '@/api/request'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const userId = ref('')
const loading = ref(false)
const finished = ref(false)
const topicList = ref<any[]>([])
const pageNum = ref(1)
const pageSize = 15

onMounted(() => {
  const routeUserId = route.params.userId as string
  if (routeUserId) {
    userId.value = routeUserId
    loadUserTopics()
  }
})

watch(userId, (newId) => {
  if (newId) {
    pageNum.value = 1
    topicList.value = []
    finished.value = false
    loadUserTopics()
  }
})

async function loadUserTopics() {
  if (!userId.value) {
    Toast('请输入用户ID')
    return
  }

  loading.value = true
  try {
    const data = await getUserTopics(userId.value, pageNum.value, pageSize)
    if (!data?.results) {
      Toast('获取数据失败')
      finished.value = true
      return
    }

    if (pageNum.value === 1) {
      topicList.value = data.results
    } else {
      topicList.value = [...topicList.value, ...data.results]
    }

    store.cacheUserTopics(userId.value, data)
    if (!store.userIds.includes(userId.value)) {
      store.userIds.unshift(userId.value)
    }

    const total = data.page?.total || 0
    finished.value = topicList.value.length >= total
  } catch (error: any) {
    Toast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!finished.value) {
    pageNum.value++
    loadUserTopics()
  }
}

function goToTopic(pid: string) {
  router.push(`/topic/${pid}`)
}

function openTopic(pid: string) {
  window.open(`https://haijiao.com/post/details?pid=${pid}`, '_blank')
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    Toast.success('已复制')
  })
}
</script>

<template>
  <div class="user-view">
    <van-nav-bar title="用户帖子" left-arrow @click-left="router.back()" />

    <van-search
      v-model="userId"
      placeholder="输入用户ID"
      shape="round"
      @search="loadUserTopics"
      class="search-bar"
    />

    <van-button
      type="primary"
      block
      round
      :loading="loading"
      @click="loadUserTopics"
      class="search-btn"
    >
      查找用户帖子
    </van-button>

    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <van-cell-group inset v-if="topicList.length > 0">
        <van-cell
          v-for="item in topicList"
          :key="item.topicId || item.id"
          is-link
          @click="goToTopic(item.topicId || item.id)"
        >
          <template #title>
            <div class="topic-item-inner">
              <div class="topic-header">
                <h5 class="topic-id" @click="copyText(item.topicId || '')">
                  {{ item.topicId || item.id }}
                </h5>
                <van-icon name="arrow" size="18" @click="openTopic(item.topicId || item.id)" />
              </div>
              <p class="topic-title">{{ item.title || '无标题' }}</p>
              <div class="topic-meta">
                <span class="user-name" @click="copyText(item.user?.id || '')">
                  {{ item.user?.nickname || '未知用户' }}
                </span>
                <span class="create-time">{{ item.create_time || item.createTime || '' }}</span>
              </div>
            </div>
          </template>
          <template #extra>
            <van-button
              size="mini"
              type="success"
              @click.stop="openTopic(item.topicId || item.id)"
            >
              查看
            </van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <van-empty v-else-if="!loading" description="输入用户ID查看帖子" />
    </van-list>
  </div>
</template>

<style scoped>
.user-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.search-bar {
  background: #f7f8fa;
}

.search-btn {
  margin: 12px;
}

.topic-item-inner {
  padding: 4px 0;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.topic-id {
  margin: 0;
  font-size: 14px;
  color: #07c160;
  cursor: pointer;
}

.topic-title {
  margin: 0 0 8px;
  font-size: 13px;
  color: #323233;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topic-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #969799;
}

.user-name {
  cursor: pointer;
}
</style>
