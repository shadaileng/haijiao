<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { request } from '@/api/request'
import type { LiteTopicPage } from '@/types'
import UserInfo from '@/components/UserInfo.vue'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const route = useRoute()

const userId = Number(route.params.userId)
const nickname = route.params.nickname as string

const userInfo = ref<any>(null)
const userInfoLoading = ref(true)
const loading = ref(true)

const liteTopics = reactive<LiteTopicPage>({
  page: { index: 1, size: 10, total: 0 },
  results: [],
})

const onClickLeft = () => history.back()

onMounted(async () => {
  await Promise.all([loadUserInfo(), loadTopics(1)])
})

const loadUserInfo = async () => {
  userInfoLoading.value = true
  try {
    const data = await request({
      url: `/user/info/${userId}`,
    })
    if (!data) return
    userInfo.value = data.user || data
  } catch {
    // ignore
  } finally {
    userInfoLoading.value = false
  }
}

const loadTopics = async (index: number) => {
  loading.value = true
  try {
    const data = await request({
      url: '/topic/node/topics',
      params: { userId, page: index, type: 1 },
    })
    if (!data) {
      showToast('获取主题失败')
      return
    }
    liteTopics.results.splice(0, liteTopics.results.length, ...data.results)
    liteTopics.page.index = data.page.page
    liteTopics.page.size = data.page.limit
    liteTopics.page.total = data.page.total
  } catch (e: any) {
    showToast(e.message || '获取主题失败')
  } finally {
    loading.value = false
  }
}

const pageto = (index: number) => {
  loadTopics(index)
}
</script>

<template>
  <van-nav-bar
    :title="nickname || '用户主页'"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
    :fixed="true"
    :placeholder="true"
  />
  <van-skeleton title avatar :row="3" :loading="userInfoLoading">
    <UserInfo :userInfo="userInfo" />
  </van-skeleton>
  <van-divider :hairline="false">帖子</van-divider>
  <van-skeleton title avatar :row="3" :loading="loading">
    <van-list :loading="loading" :finished="liteTopics.results.length === 0" finished-text="没有更多了">
      <van-cell v-for="item in liteTopics.results" :key="item.topicId">
        <template #value>
          <div class="card" @click="$router.push(`/topic/${item.topicId}`)">
            <div v-if="item.attachments?.length > 1">
              <van-row justify="space-between">
                <van-col span="24" class="hv-title">{{ item.title }}</van-col>
              </van-row>
              <van-row justify="center">
                <van-col span="8" v-for="attach in item.attachments" :key="attach.id">
                  <van-image
                    width="80" height="80" fit="cover" radius="5"
                    :src="LOADING_URL"
                    v-headicon="(attach.remoteUrl || attach.coverUrl)?.startsWith('http') ? (attach.remoteUrl || attach.coverUrl) + '.txt' : (attach.remoteUrl || attach.coverUrl)"
                  />
                </van-col>
              </van-row>
            </div>
            <div v-else>
              <van-row justify="space-between">
                <van-col span="16">
                  <van-row justify="space-between">
                    <van-col span="24" class="hv-title">{{ item.title }}</van-col>
                  </van-row>
                  <van-row justify="space-between">
                    <van-text-ellipsis rows="2" :content="item.liteContent" />
                  </van-row>
                </van-col>
                <van-col span="8" v-if="item.attachments?.length">
                  <van-image
                    width="80" height="80" fit="cover" radius="5"
                    :src="LOADING_URL"
                    v-headicon="(item.attachments[0].remoteUrl || item.attachments[0].coverUrl)?.startsWith('http') ? (item.attachments[0].remoteUrl || item.attachments[0].coverUrl) + '.txt' : (item.attachments[0].remoteUrl || item.attachments[0].coverUrl)"
                  />
                </van-col>
              </van-row>
            </div>
            <van-row justify="space-between">
              <van-col span="4" class="hv-topic-state">
                <van-icon name="chat-o" /> <span>{{ item.commentCount }}</span>
              </van-col>
              <van-col span="4" class="hv-topic-state">
                <van-icon name="good-job" /> <span>{{ item.likeCount }}</span>
              </van-col>
              <van-col span="8" class="hv-topic-state">
                <span>{{ item.createTime?.split(' ')[0] }}</span>
              </van-col>
              <van-col span="8" class="hv-topic-state">
                <van-tag plain type="primary">{{ item.node?.name }}</van-tag>
              </van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-pagination
      v-model="liteTopics.page.index"
      :total-items="liteTopics.page.total"
      :items-per-page="liteTopics.page.size"
      v-if="liteTopics.page.total > liteTopics.page.size"
      force-ellipses
      @change="(index: number) => pageto(index)"
    />
  </van-skeleton>
</template>

<style scoped>
.card {
  text-align: left;
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 5px;
}
</style>
