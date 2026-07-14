<template>
  <van-skeleton title avatar :row="6" :loading="loading">
    <div v-for="item in comments.results" :key="item.floor" class="comment-cell">
      <div class="comment-header">
        <van-image
          round
          width="3rem"
          height="3rem"
          :src="LOADING_URL"
          v-headicon="item.avatar?.startsWith('http') ? item.avatar + '.txt' : item.avatar"
          class="comment-avatar"
        />
        <div class="comment-header-info">
          <span class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${item.userId}/${item.nickname}`)">
            {{ item.nickname }}
          </span>
          <span class="comment-header-time">{{ item.createTime }}</span>
        </div>
        <span class="comment-header-floor">{{ item.floor }}楼</span>
      </div>
      <div class="comment-body">
        <div
          class="content"
          v-content="{
            content: item.content,
            attachments: item.attachments,
            handleClick,
          }"
        ></div>
        <van-divider :style="{ margin: '8px 0', borderColor: '#eee' }" v-if="item.commendList?.length" />
        <ReplyList
          v-if="item.commendList?.length"
          :replies="item.commendList"
          :handleClick="handleClick"
        />
      </div>
    </div>
  </van-skeleton>
  <van-pagination
    v-model="comments.page.index"
    :total-items="comments.page.total"
    :items-per-page="comments.page.size"
    v-if="comments.page.total > comments.page.size"
    force-ellipses
    @change="(index: number) => loadComments(index, true)"
  />
</template>

<script setup lang="ts">
import { reactive, inject, ref, onMounted } from 'vue'
import { CommentPage } from '@/types'
import { api } from '@/api/request'
import { LOADING_URL } from '@/utils/constant'
import { showToast } from 'vant'
import ReplyList from './ReplyList.vue'

const props = defineProps({
  topicId: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits<{ loaded: [scroll: boolean] }>()

const loading = ref(true)

const comments = reactive<CommentPage>({
  results: [],
  page: { index: 1, size: 20, total: 0 },
})

const handleClick = inject('overlay') as (data: any) => void

onMounted(() => {
  loadComments(1)
})

const loadComments = async (index: number, scrollToTop = false) => {
  loading.value = true
  const resp = await api.reply_list({
    params: {
      page: index,
      sort: 'asc',
      topic_id: props.topicId,
      search_type: 0,
      user_id: 0,
    },
  })
  if (!resp.success) {
    showToast('评论加载失败')
    loading.value = false
    return
  }
  const data = resp.data
  if (!data?.results || !data?.page) {
    loading.value = false
    return
  }
  comments.results.splice(0, comments.results.length, ...data.results)
  comments.page.total = data.page.total
  comments.page.index = data.page.page
  comments.page.size = data.page.limit
  loading.value = false
  if (scrollToTop) {
    emit('loaded', true)
  }
}
</script>

<style scoped>
.content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding-right: 15px;
}
.content p {
  margin: 0;
}
.content img {
  width: 100%;
  height: auto;
}
:deep(.content img.hv-emoji) {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1.5em 0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-header-info {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  text-align: left;
}

.comment-header-time {
  font-size: 0.8rem;
  color: #999;
}

.comment-header-floor {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 0.9rem;
  color: #999;
}

.comment-cell {
  padding: 0 16px;
}
.comment-body {
  padding-left: calc(3rem + 10px);
}

</style>
