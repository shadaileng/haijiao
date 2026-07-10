<script setup lang="ts">
import { ref } from 'vue'
import type { LiteTopic } from '@/types'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const props = defineProps<{
  topics: LiteTopic[]
}>()

const emit = defineEmits<{
  load: []
}>()

const finished = ref(false)
const loading = ref(true)

const onLoad = async () => {
  if (!loading.value && props.topics.length > 0) {
    loading.value = true
    setTimeout(() => {
      emit('load')
    }, 1500)
  }
}

const startLoad = () => { loading.value = true }
const endLoad = () => { loading.value = false }

defineExpose({ startLoad, endLoad })
</script>

<template>
  <van-skeleton title avatar :row="3" :loading="false">
    <van-list
      :finished="finished"
      :loading="loading"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in topics" :key="item.topicId">
        <template #value>
          <div class="card">
            <div v-if="item.attachments?.length > 1">
              <van-row
                justify="space-between"
                @click="$router.push(`/topic/${item.topicId}`)"
              >
                <van-col span="24" class="hv-title">{{ item.title }}</van-col>
              </van-row>
              <van-row justify="center">
                <van-col
                  span="8"
                  v-for="attach in item.attachments"
                  :key="attach.id"
                >
                  <van-image
                    width="80"
                    height="80"
                    fit="cover"
                    radius="5"
                    :src="LOADING_URL"
                    v-headicon="attach.remoteUrl || attach.coverUrl"
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
                  <van-row justify="space-between" :title="item.liteContent">
                    <van-text-ellipsis rows="2" :content="item.liteContent" />
                  </van-row>
                </van-col>
                <van-col span="8">
                  <van-image
                    class="img-pos"
                    width="80"
                    height="80"
                    fit="cover"
                    radius="5"
                    :src="LOADING_URL"
                    v-if="item.attachments?.length"
                    v-headicon="item.attachments[0].remoteUrl || item.attachments[0].coverUrl"
                  />
                </van-col>
              </van-row>
            </div>
            <van-row justify="space-between">
              <van-col
                span="7"
                class="hv-topic-state hv-of-hidden hv-pointer"
                @click="$router.push(`/homepage/${item.user?.id}/${item.user?.nickname}`)"
                :title="item.user?.nickname"
              >
                <van-image
                  round
                  width="1rem"
                  height="1rem"
                  :src="LOADING_URL"
                  class="hv-user-icon"
                  v-headicon="item.user?.avatar"
                />
                <span>{{ item.user?.nickname }}</span>
              </van-col>
              <van-col span="3" class="hv-topic-state">
                <van-icon name="chat-o" />
                <span>{{ item.commentCount }}</span>
              </van-col>
              <van-col span="3" class="hv-topic-state">
                <van-icon name="good-job" />
                <span>{{ item.likeCount }}</span>
              </van-col>
              <van-col span="6" class="hv-topic-state">
                <span>{{ item.createTime?.split(' ')[0] }}</span>
              </van-col>
              <van-col span="5" class="hv-topic-state">
                <van-tag plain type="primary">{{ item.node?.name }}</van-tag>
              </van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-back-top />
  </van-skeleton>
</template>

<style scoped>
.card {
  text-align: left;
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 5px;
}
.img-pos {
  margin: 18px 10px;
}
</style>
