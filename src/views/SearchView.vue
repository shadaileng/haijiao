<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { searchTopics } from '@/api/request'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const searchKey = ref('')
const loading = ref(false)
const finished = ref(false)
const topicList = ref<any[]>([])
const pageNum = ref(1)
const pageSize = 15

onMounted(() => {
  if (store.searchKeys.length > 0) {
    searchKey.value = store.searchKeys[0]
    doSearch()
  }
})

watch(searchKey, (newKey) => {
  if (newKey) {
    pageNum.value = 1
    topicList.value = []
    finished.value = false
    doSearch()
  }
})

async function doSearch() {
  if (!searchKey.value.trim()) {
    Toast('请输入搜索关键字')
    return
  }

  loading.value = true
  try {
    const data = await searchTopics(searchKey.value, pageNum.value)
    if (!data?.results) {
      Toast('未找到相关内容')
      finished.value = true
      return
    }

    if (pageNum.value === 1) {
      topicList.value = data.results
    } else {
      topicList.value = [...topicList.value, ...data.results]
    }

    store.cacheSearchTopics(searchKey.value, data)
    if (!store.searchKeys.includes(searchKey.value)) {
      store.searchKeys.unshift(searchKey.value)
    }

    const total = data.page?.total || 0
    finished.value = topicList.value.length >= total
  } catch (error: any) {
    Toast(error.message || '搜索失败')
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!finished.value) {
    pageNum.value++
    doSearch()
  }
}

function goToTopic(pid: string) {
  router.push(`/topic/${pid}`)
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    Toast.success('已复制')
  })
}
</script>

<template>
  <div class="search-view">
    <van-nav-bar title="搜索帖子" left-arrow @click-left="router.back()" />

    <van-search
      v-model="searchKey"
      placeholder="输入搜索关键字"
      shape="round"
      @search="doSearch"
      class="search-bar"
    />

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
          :title="item.title || '无标题'"
          is-link
          @click="goToTopic(item.topicId || item.id)"
        >
          <template #label>
            <div class="cell-label">
              <span @click.stop="copyText(item.user?.id || '')">{{ item.user?.nickname || '未知用户' }}</span>
              <span v-if="item.create_time">{{ item.create_time }}</span>
            </div>
          </template>
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-empty v-else-if="!loading" description="输入关键字搜索帖子" />
    </van-list>
  </div>
</template>

<style scoped>
.search-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.search-bar {
  background: #f7f8fa;
}

.cell-label {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 12px;
}

.cell-label span {
  cursor: pointer;
}
</style>
