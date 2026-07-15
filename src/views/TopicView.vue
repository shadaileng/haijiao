<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { Topic } from '@/types'
import Comment from '@/components/Comment.vue'
import TopicContent from '@/components/TopicContent.vue'
import UserMeta from '@/components/UserMeta.vue'

const route = useRoute()

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

const onClickLeft = () => history.back()

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
  loading.value = false
}

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
    <van-row justify="space-between" class="hv-box-padding-lt">
      <van-col span="8" class="hv-topic-state">
        <van-tag plain type="primary">{{ topicLocal.node?.name }}</van-tag>
      </van-col>
      <van-col span="8" class="hv-topic-state">
        <van-icon name="chat-o" />{{ topicLocal.commentCount }}
      </van-col>
      <van-col span="8" class="hv-topic-state">
        <van-icon name="good-job" />{{ topicLocal.likeCount }}
      </van-col>
    </van-row>
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
</template>

<style scoped></style>
