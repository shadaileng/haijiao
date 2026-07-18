<template>
  <van-empty v-if="!skeletonLoading && (mode === 'scroll' ? !loading : true) && topics.length === 0" description="暂无内容" />
  <van-skeleton v-else title avatar :row="3" :loading="skeletonLoading">
    <template v-if="mode === 'scroll'">
      <van-list :finished="finished" :loading="loading" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in topics" :key="item.topicId">
          <template #value>
            <div class="card">
              <div v-if="item.attachments?.length > 1">
                <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                  <van-col span="24" class="hv-title">{{ item.title }}</van-col>
                </van-row>
                <div class="topic-images">
                  <van-image
                    v-for="attach in item.attachments"
                    :key="attach.id"
                    fit="cover"
                    radius="5"
                    :src="LOADING_URL"
                    v-headicon="attach.remoteUrl || attach.coverUrl"
                    class="topic-image"
                  />
                </div>
              </div>
              <div v-else>
                <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                  <van-col span="16" class="topic-text-col">
                    <div class="hv-title">{{ item.title }}</div>
                    <van-text-ellipsis rows="2" :content="item.liteContent" />
                  </van-col>
                  <van-col span="8">
                    <van-image
                      fit="cover"
                      radius="5"
                      :src="LOADING_URL"
                      v-headicon="item.attachments && (item.attachments[0].remoteUrl || item.attachments[0].coverUrl)"
                      class="topic-image-single"
                    />
                  </van-col>
                </van-row>
              </div>
              <div class="topic-meta">
                <span
                  class="topic-meta-user"
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
                  {{ item.user?.nickname }}
                </span>
                <span class="topic-meta-stat"><van-icon name="chat-o" />{{ item.commentCount }}</span>
                <span class="topic-meta-stat"><van-icon name="good-job" />{{ item.likeCount }}</span>
                <span class="topic-meta-date">{{ item.createTime?.split(' ')[0] }}</span>
                <van-tag plain type="primary">{{ item.node?.name }}</van-tag>
              </div>
            </div>
          </template>
        </van-cell>
      </van-list>
    </template>
    <template v-else>
      <van-cell v-for="item in topics" :key="item.topicId">
        <template #value>
          <div class="card">
            <div v-if="item.attachments?.length > 1">
              <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                <van-col span="24" class="hv-title">{{ item.title }}</van-col>
              </van-row>
              <div class="topic-images">
                <van-image
                  v-for="attach in item.attachments"
                  :key="attach.id"
                  fit="cover"
                  radius="5"
                  :src="LOADING_URL"
                  v-headicon="attach.remoteUrl || attach.coverUrl"
                  class="topic-image"
                />
              </div>
            </div>
            <div v-else>
              <van-row justify="space-between" @click="$router.push(`/topic/${item.topicId}`)">
                <van-col span="16" class="topic-text-col">
                  <div class="hv-title">{{ item.title }}</div>
                  <van-text-ellipsis rows="2" :content="item.liteContent" />
                </van-col>
                <van-col span="8">
                  <van-image
                    fit="cover"
                    radius="5"
                    :src="LOADING_URL"
                    v-headicon="item.attachments && (item.attachments[0].remoteUrl || item.attachments[0].coverUrl)"
                    class="topic-image-single"
                  />
                </van-col>
              </van-row>
            </div>
            <div class="topic-meta">
              <span
                class="topic-meta-user"
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
                {{ item.user?.nickname }}
              </span>
              <span class="topic-meta-stat"><van-icon name="chat-o" />{{ item.commentCount }}</span>
              <span class="topic-meta-stat"><van-icon name="good-job" />{{ item.likeCount }}</span>
              <span class="topic-meta-date">{{ item.createTime?.split(' ')[0] }}</span>
              <van-tag plain type="primary">{{ item.node?.name }}</van-tag>
            </div>
          </div>
        </template>
      </van-cell>
      <div v-if="totalItems > pageSize" class="pagination-wrapper">
        <van-pagination
          :model-value="pageIndex"
          :total-items="totalItems"
          :items-per-page="pageSize"
          @change="(p: number) => emit('pageChange', p)"
        />
      </div>
    </template>
  </van-skeleton>
</template>

<script setup lang="ts">
import { LiteTopic } from '@/types'
import { LOADING_URL } from '@/utils/constant'
import { ref, type PropType } from 'vue'

const props = defineProps({
  topics: {
    type: Array<LiteTopic>,
    default: () => [],
  },
  skeletonLoading: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: String as PropType<'scroll' | 'pagination'>,
    default: 'scroll',
  },
  pageIndex: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['load', 'pageChange'])
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
.topic-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #969799;
  margin-top: 6px;
}
.topic-meta > .van-tag {
  margin-left: auto;
}
.topic-meta-user {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  color: #505050;
  font-weight: 500;
  flex-shrink: 0;
  max-width: 40%;
}
.topic-meta-stat {
  white-space: nowrap;
  flex-shrink: 0;
}
.topic-meta-date {
  white-space: nowrap;
  flex-shrink: 0;
}
.topic-images {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.topic-image {
  flex: 1;
  aspect-ratio: 1;
}
.topic-image-single {
  display: block;
  width: 100%;
  aspect-ratio: 1;
}
.topic-text-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 10px;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0 60px;
}
</style>
