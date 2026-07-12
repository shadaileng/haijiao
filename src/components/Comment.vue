<template>
  <van-skeleton title avatar :row="6" :loading="loading">
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in comments.results" :key="item.floor">
        <template #value>
          <van-row>
            <van-col span="20">
              <van-row class="hv-box-padding-tb hv-text-center">
                <van-col span="6">
                  <van-image
                    round
                    width="3rem"
                    height="3rem"
                    :src="LOADING_URL"
                    v-headicon="item.avatar?.startsWith('http') ? item.avatar + '.txt' : item.avatar"
                  />
                </van-col>
                <van-col span="16" class="hv-text-start">
                  <van-space :size="10" direction="vertical">
                    <van-row class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${item.userId}/${item.nickname}`)">
                      <van-col span="24">{{ item.nickname }}</van-col>
                    </van-row>
                    <van-row>
                      <van-col span="24">{{ item.createTime }}</van-col>
                    </van-row>
                  </van-space>
                </van-col>
              </van-row>
            </van-col>
            <van-col span="4">{{ item.floor }}楼</van-col>
          </van-row>
          <van-row>
            <div
              class="content"
              v-content="{
                content: item.content,
                attachments: item.attachments,
                handleClick,
              }"
            ></div>
          </van-row>
          <van-row v-if="item.commendList?.length > 0">
            <div class="commend_list">
              <van-row v-for="commend_item in item.commendList" :key="commend_item.replyId">
                <van-col span="24">
                  <span class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${item.userId}/${item.nickname}`)">{{ commend_item.nickname }}:</span>
                  <span>{{ commend_item.content }}</span>
                </van-col>
              </van-row>
            </div>
          </van-row>
        </template>
      </van-cell>
    </van-list>
  </van-skeleton>
  <van-pagination
    v-model="comments.page.index"
    :total-items="comments.page.total"
    :items-per-page="comments.page.size"
    v-if="comments.page.total > comments.page.size"
    force-ellipses
    @change="(index: number) => loadComments(index)"
  />
</template>

<script setup lang="ts">
import { reactive, inject, ref, onMounted } from 'vue'
import { CommentPage } from '@/types'
import { api } from '@/api/request'
import { LOADING_URL } from '@/utils/constant'
import { showToast } from 'vant'

const props = defineProps({
  topicId: {
    type: Number,
    required: true,
  },
})

const loading = ref(true)
const finished = ref(false)

const comments = reactive<CommentPage>({
  results: [],
  page: { index: 1, size: 20, total: 0 },
})

const handleClick = inject('overlay') as (data: any) => void

const onLoad = () => {}

onMounted(() => {
  loadComments(1)
})

const loadComments = async (index: number) => {
  loading.value = true
  finished.value = false
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
    finished.value = true
    return
  }
  const data = resp.data
  if (!data?.results || !data?.page) {
    loading.value = false
    finished.value = true
    return
  }
  comments.results.splice(0, comments.results.length, ...data.results)
  comments.page.total = data.page.total
  comments.page.index = data.page.page
  comments.page.size = data.page.limit
  loading.value = false
  finished.value = true
}
</script>

<style scoped>
.content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding: 0 15px;
}
.content p {
  margin: 0;
}
.content img {
  width: 100%;
  height: auto;
}
.commend_list {
  width: 100%;
  margin: 0 10px;
  text-align: left;
  font-size: 0.8rem;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
}
</style>
