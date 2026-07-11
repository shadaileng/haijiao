<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { request } from '@/api/request'
import type { CommentPage } from '@/types'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const props = defineProps<{
  topicId: number
}>()

const loading = ref(true)
const finished = ref(false)

const comments = reactive<CommentPage>({
  results: [],
  page: { index: 1, size: 20, total: 0 },
})

onMounted(() => {
  loadComments(1)
})

const loadComments = async (index: number) => {
  loading.value = true
  finished.value = false
  try {
    const data = await request({
      url: '/comment/reply_list',
      params: {
        page: index,
        sort: 'asc',
        topic_id: props.topicId,
        search_type: 0,
        user_id: 0,
      },
    })
    if (!data) {
      showToast('评论加载失败')
      return
    }
    comments.results.splice(0, comments.results.length, ...data.results)
    comments.page.total = data.page.total
    comments.page.index = data.page.page
    comments.page.size = data.page.limit
  } catch {
    showToast('评论加载失败')
  } finally {
    loading.value = false
    finished.value = true
  }
}

const handleClick = (params: any) => {
  console.log('handleClick:', params)
}
</script>

<template>
  <van-skeleton title avatar :row="6" :loading="loading">
    <van-list
      :loading="loading"
      :finished="finished"
      finished-text="没有更多了"
    >
      <van-cell v-for="(item) in comments.results" :key="item.floor">
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
                    <van-row
                      class="hv-nickname hv-pointer"
                      @click="$router.push(`/homepage/${item.user_id}/${item.nickname}`)"
                    >
                      <van-col span="24">{{ item.nickname }}</van-col>
                    </van-row>
                    <van-row>
                      <van-col span="24">{{ item.create_time }}</van-col>
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
          <van-row>
            <div class="commend_list" v-if="item.commend_list?.length > 0">
              <van-row
                v-for="commend in item.commend_list"
                :key="commend.reply_id"
              >
                <van-col span="24">
                  <span
                    class="hv-nickname hv-pointer"
                    @click="$router.push(`/homepage/${commend.user_id}/${commend.nickname}`)"
                  >{{ commend.nickname }}:</span>
                  <span>{{ commend.content }}</span>
                </van-col>
              </van-row>
            </div>
          </van-row>
        </template>
      </van-cell>
    </van-list>
    <van-pagination
      v-model="comments.page.index"
      :total-items="comments.page.total"
      v-if="comments.page.total > comments.page.size"
      :items-per-page="comments.page.size"
      @change="(index: number) => loadComments(index)"
      force-ellipses
    />
  </van-skeleton>
</template>

<style scoped>
.content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding: 0 15px;
}
.content p { margin: 0; }
.content img { width: 100%; height: auto; }
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
