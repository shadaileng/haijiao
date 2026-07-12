<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { api } from '@/api/request'
import type { Topic } from '@/types'
import Comment from '@/components/Comment.vue'
import TopicContent from '@/components/TopicContent.vue'
import { LOADING_URL } from '@/utils/constant'

const route = useRoute()

const pid = ref((route.params.pid as string) || '')
const loading = ref(true)
const topicLocal = ref<Topic>({
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

const onClickLeft = () => history.back()

onMounted(async () => {
  if (pid.value) {
    await loadTopic(pid.value)
  }
})

const loadTopic = async (topicPid: string) => {
  if (!topicPid) return
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
      <van-col span="6">
        <van-image
          round
          width="3rem"
          height="3rem"
          :src="LOADING_URL"
          v-headicon="topicLocal.user?.avatar?.startsWith('http') ? topicLocal.user?.avatar + '.txt' : topicLocal.user?.avatar"
        />
      </van-col>
      <van-col span="16" class="hv-text-start">
        <van-space :size="10" direction="vertical">
          <van-row
            class="hv-nickname hv-pointer"
            @click="$router.push(`/homepage/${topicLocal.user?.id}/${topicLocal.user?.nickname}`)"
          >
            <van-col span="24">{{ topicLocal.user?.nickname }}</van-col>
          </van-row>
          <van-row>
            <van-col span="24">{{ topicLocal.createTime }}</van-col>
          </van-row>
        </van-space>
      </van-col>
    </van-row>
    <van-row class="hv-box-padding" v-if="topicLocal.content?.length">
      <TopicContent
        :topicId="topicLocal.topicId"
        :content="topicLocal.content"
        :attachments="topicLocal.attachments"
      />
    </van-row>
  </van-skeleton>
  <van-divider :hairline="false">评论</van-divider>
  <Comment :topicId="topicLocal.topicId" />
</template>

<style scoped></style>
