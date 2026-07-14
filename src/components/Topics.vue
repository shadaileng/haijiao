<template>
  <van-empty v-if="!skeletonLoading && !loading && topics.length === 0" description="暂无内容" />
  <van-skeleton v-else title avatar :row="3" :loading="skeletonLoading">
    <van-list :finished="finished" :loading="loading" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in topics" :key="item.topicId">
        <template #value>
          <div class="card">
            <div v-if="item.attachments?.length > 1">
              <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                <van-col span="24" class="hv-title">{{ item.title }}</van-col>
              </van-row>
              <van-row justify="center">
                <van-col span="8" v-for="attach in item.attachments" :key="attach.id">
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
              <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                <van-col span="16">
                  <van-row justify="space-between">
                    <van-col span="24" class="hv-title">{{ item.title }}</van-col>
                  </van-row>
                  <van-row justify="space-between">
                    <van-col span="24">
                      <van-text-ellipsis rows="2" :content="item.liteContent" />
                    </van-col>
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
                    v-headicon="item.attachments && (item.attachments[0].remoteUrl || item.attachments[0].coverUrl)"
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
                  v-headicon="item.user?.avatar?.startsWith('http') ? item.user.avatar + '.txt' : item.user?.avatar"
                />
                <span>{{ item.user?.nickname }}</span>
              </van-col>
              <van-col span="3" class="hv-topic-state"><van-icon name="chat-o" /><span>{{ item.commentCount }}</span></van-col>
              <van-col span="3" class="hv-topic-state"><van-icon name="good-job" /><span>{{ item.likeCount }}</span></van-col>
              <van-col span="6" class="hv-topic-state"><span>{{ item.createTime?.split(' ')[0] }}</span></van-col>
              <van-col span="5" class="hv-topic-state"><van-tag plain type="primary">{{ item.node?.name }}</van-tag></van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </van-list>
  </van-skeleton>
</template>

<script setup lang="ts">
import { LiteTopic } from '@/types'
import { LOADING_URL } from '@/utils/constant'
import { ref } from 'vue'

const props = defineProps({
  topics: {
    type: Array<LiteTopic>,
    default: () => [],
  },
  skeletonLoading: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['load'])
const finished = ref(false)
const loading = ref(true)

const onLoad = () => {
  if (!loading.value && props.topics.length > 0) {
    loading.value = true
    setTimeout(() => emit('load'), 1500)
  }
}
const startLoad = () => {
  loading.value = true
}
const endLoad = () => {
  loading.value = false
}

const finishLoad = () => {
  finished.value = true
  loading.value = false
}

defineExpose({ startLoad, endLoad, finishLoad })
</script>

<style scoped>
.card {
  text-align: left;
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 5px;
}
.hv-of-hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.hv-user-icon {
  display: inline-block;
  vertical-align: middle;
}
.hv-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  padding-bottom: 5px;
}
.hv-topic-state {
  text-align: left;
}
.img-pos {
  margin: 18px 10px;
}
</style>
