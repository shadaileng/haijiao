<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { Topic } from '@/types'
import Comment from '@/components/Comment.vue'
import TopicContent from '@/components/TopicContent.vue'
import UserMeta from '@/components/UserMeta.vue'
import { useSafeBack } from '@/utils/navigation'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'
import { useClipboard } from '@/composables/useClipboard'

const route = useRoute()
const safeBack = useSafeBack()
const historyStore = useHistoryStore()
const settings = useSettingsStore()
const { copy } = useClipboard()

const pid = ref((route.params.pid as string) || '')
const commentDivider = ref<HTMLElement>()
const loading = ref(true)
const defaultTopic = (): Topic => ({
  topicId: 0,
  likeCount: 0,
  title: '',
  user: null,
  content: '',
  attachments: [],
  createTime: '',
  node: null,
  commentCount: 0,
  doors: [],
})

const topicLocal = ref<Topic>(defaultTopic())
const defaultFolderId = ref<number | undefined>()
const folders = ref<{ id: number; name: string; count: number }[]>([])
const showFolderPicker = ref(false)
const pendingTopicId = ref<string | number>(0)

const onClickLeft = () => safeBack()

const loadTopic = async (topicPid: string) => {
  if (!topicPid) return
  topicLocal.value = defaultTopic()
  loading.value = true
  const resp = await api.topic({ params: { topicId: topicPid } })
  if (!resp.success) {
    showToast(resp.message || '加载主题失败')
    loading.value = false
    return
  }
  Object.assign(topicLocal.value, resp.data)
  if (topicLocal.value.title) {
    historyStore.addRecord('topic', topicPid, topicLocal.value.title)
  }
  loading.value = false
  // 检查收藏状态
  if (settings.isLoggedIn) {
    const favResp = await api.checkFavorite({ params: { topicId: topicPid } })
    if (favResp.success && favResp.data) {
      topicLocal.value.isFavorite = !!favResp.data.favorite
    }
  }
}

const toggleFavorite = async () => {
  if (!settings.isLoggedIn) {
    showToast('请先登录')
    return
  }
  const tid = topicLocal.value.topicId
  if (topicLocal.value.isFavorite) {
    const resp = await api.delFavorite({ params: { topicId: tid } })
    if (resp.success) {
      topicLocal.value.isFavorite = false
      showToast('已取消收藏')
    } else {
      showToast(resp.message || '操作失败')
    }
  } else {
    if (folders.value.length <= 1) {
      await doAddFavorite(tid, defaultFolderId.value)
    } else {
      pendingTopicId.value = tid
      showFolderPicker.value = true
    }
  }
}

const doAddFavorite = async (topicId: string | number, folderId?: number) => {
  const resp = await api.addFavorite({ params: { topicId, folderId } })
  if (resp.success) {
    topicLocal.value.isFavorite = true
    showToast('已收藏')
  } else {
    showToast(resp.message || '操作失败')
  }
}

const onFolderSelect = async (folder: { id: number; name: string }) => {
  showFolderPicker.value = false
  await doAddFavorite(pendingTopicId.value, folder.id)
}

const handleShare = async () => {
  const url = `${window.location.origin}/topic/${topicLocal.value.topicId}`
  const text = `${topicLocal.value.title}\n\n${url}\n\n来自「海角助手」`
  const ok = await copy(text)
  if (ok) {
    showToast('链接已复制')
  } else {
    showToast('复制失败')
  }
}

onMounted(async () => {
  const resp = await api.favoriteFolders()
  if (resp.success && Array.isArray(resp.data) && resp.data.length > 0) {
    folders.value = resp.data
    defaultFolderId.value = resp.data[0].id
  }
})

watch(() => route.params.pid, async (newPid) => {
  if (newPid) {
    pid.value = newPid as string
    await loadTopic(pid.value)
  }
}, { immediate: true })

const onCommentLoaded = () => {
  nextTick(() => {
    commentDivider.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<template>
  <van-nav-bar
    :title="topicLocal?.title || '帖子详情'"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    :fixed="true"
    :placeholder="true"
  />
  <van-skeleton title avatar :row="3" :loading="loading">
    <van-row justify="space-between">
      <van-col span="24" class="hv-title hv-box-padding-lt">{{ topicLocal.title }}</van-col>
    </van-row>
    <div class="hv-stats-row hv-box-padding-lt">
      <span class="hv-topic-state">
        <van-tag plain type="primary">{{ topicLocal.node?.name }}</van-tag>
      </span>
      <span class="hv-topic-state">
        <van-icon name="chat-o" />{{ topicLocal.commentCount }}
      </span>
      <span class="hv-topic-state">
        <van-icon name="good-job" />{{ topicLocal.likeCount }}
      </span>
      <span class="hv-topic-state hv-pointer" @click="toggleFavorite">
        <van-icon :name="topicLocal.isFavorite ? 'star' : 'star-o'" :class="{ 'favorite-active': topicLocal.isFavorite }" />
      </span>
      <span class="hv-topic-state hv-pointer" @click="handleShare">
        <van-icon name="share" />
      </span>
    </div>
    <van-row class="hv-box-padding">
      <UserMeta
        :avatar="topicLocal.user?.avatar || ''"
        :nickname="topicLocal.user?.nickname || ''"
        :userId="topicLocal.user?.id || 0"
        :createTime="topicLocal.createTime || ''"
      />
    </van-row>
    <van-row class="hv-box-padding" v-if="topicLocal.content?.length">
      <TopicContent
        :key="topicLocal.topicId"
        :topicId="topicLocal.topicId"
        :content="topicLocal.content"
        :attachments="topicLocal.attachments"
        :doors="topicLocal.doors"
        :sale="topicLocal.sale"
      />
    </van-row>
  </van-skeleton>
  <div ref="commentDivider"></div>
  <van-divider :hairline="false">评论</van-divider>
  <Comment v-if="topicLocal.topicId" :key="topicLocal.topicId" :topicId="topicLocal.topicId" @loaded="onCommentLoaded" />

  <!-- 收藏夹选择弹窗 -->
  <van-action-sheet
    v-model:show="showFolderPicker"
    title="选择收藏夹"
    :actions="folders.map(f => ({ name: `${f.name} (${f.count})`, value: f.id }))"
    @select="(action: any) => onFolderSelect({ id: action.value, name: action.name })"
    cancel-text="取消"
  />
</template>

<style scoped>
.hv-stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 6px 0;
  flex-wrap: nowrap;
}
.favorite-active {
  color: #ffc107;
}
</style>
