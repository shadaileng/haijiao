<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog as showConfirmDialog } from 'vant'
import { useHistoryStore } from '@/stores/history'
import { useSafeBack } from '@/utils/navigation'

defineOptions({ name: 'HistoryView' })

const router = useRouter()
const safeBack = useSafeBack()
const historyStore = useHistoryStore()

const activeTab = ref(0)

const formatTime = (ts: number) => {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const handleClear = () => {
  showConfirmDialog({
    title: '清空足迹',
    message: '确定要清空所有浏览记录吗？',
    showCancelButton: true,
  })
    .then(() => {
      historyStore.clearRecords()
    })
    .catch(() => {})
}

const handleRemove = (type: 'user' | 'topic', id: string) => {
  historyStore.removeRecord(type, id)
}

const goToUser = (id: string) => {
  router.push(`/homepage/${id}`)
}

const goToTopic = (id: string) => {
  router.push(`/topic/${id}`)
}
</script>

<template>
  <div class="history-view">
    <van-nav-bar title="足迹" left-arrow @click-left="safeBack">
      <template #right>
        <van-button text="清空" size="small" @click="handleClear">清空</van-button>
      </template>
    </van-nav-bar>

    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="用户">
        <div v-if="historyStore.userRecords.length === 0" class="empty-wrap">
          <van-empty description="暂无足迹" />
        </div>
        <van-cell-group v-else inset class="history-list">
          <van-swipe-cell v-for="item in historyStore.userRecords" :key="item.id">
            <van-cell :title="item.title" :label="'uid: ' + item.id" is-link @click="goToUser(item.id)">
              <template #value>
                <span class="time-text">{{ formatTime(item.time) }}</span>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" class="delete-btn" @click="handleRemove('user', item.id)" />
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </van-tab>

      <van-tab title="帖子">
        <div v-if="historyStore.topicRecords.length === 0" class="empty-wrap">
          <van-empty description="暂无足迹" />
        </div>
        <van-cell-group v-else inset class="history-list">
          <van-swipe-cell v-for="item in historyStore.topicRecords" :key="item.id">
            <van-cell :title="item.title" :label="'pid: ' + item.id" is-link @click="goToTopic(item.id)">
              <template #value>
                <span class="time-text">{{ formatTime(item.time) }}</span>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" class="delete-btn" @click="handleRemove('topic', item.id)" />
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.history-view {
  min-height: 100vh;
  background: #f7f8fa;
}
.history-list {
  margin: 12px;
}
.empty-wrap {
  padding-top: 40px;
}
.time-text {
  font-size: 12px;
  color: #969799;
}
.delete-btn {
  height: 100%;
}
</style>
