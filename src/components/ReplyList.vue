<template>
  <div class="reply_list" :class="{ 'reply_list--nested': depth > 0 }">
    <template v-if="!expanded">
      <!-- 折叠态：第一条回复预览 + 展开入口 -->
      <div class="reply-summary" @click="expanded = true">
        <van-image
          round
          width="1.8rem"
          height="1.8rem"
          :src="LOADING_URL"
          v-headicon="replies[0].avatar?.startsWith('http') ? replies[0].avatar + '.txt' : replies[0].avatar"
          class="reply_avatar"
        />
        <div class="reply_body">
          <div class="reply-text-row">
            <span class="hv-nickname hv-pointer" @click.stop="$router.push(`/homepage/${replies[0].userId}/${replies[0].nickname}`)">
              {{ replies[0].nickname }}
            </span>
            <span class="reply-colon">：</span>
            <span class="reply-text-preview" v-html="replies[0].content"></span>
          </div>
          <div class="reply-item-time">{{ replies[0].createTime }}</div>
        </div>
      </div>
      <div class="reply-expand" @click="expanded = true">
        <span>{{ replies.length }} 条评论</span>
        <van-icon name="arrow" />
      </div>
    </template>
    <template v-else>
      <!-- 展开态：所有回复 + 折叠入口 -->
      <div v-for="reply in replies" :key="reply.replyId" class="reply_item">
        <van-image
          round
          width="1.8rem"
          height="1.8rem"
          :src="LOADING_URL"
          v-headicon="reply.avatar?.startsWith('http') ? reply.avatar + '.txt' : reply.avatar"
          class="reply_avatar"
        />
        <div class="reply_body">
          <div class="reply-text-row">
            <span class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${reply.userId}/${reply.nickname}`)">
              {{ reply.nickname }}
            </span>
            <span class="reply-colon">：</span>
            <div class="reply-text" v-content="{ content: reply.content, attachments: reply.attachments, handleClick }"></div>
          </div>
          <div class="reply-item-time">{{ reply.createTime }}</div>
          <ReplyList
            v-if="reply.commendList?.length"
            :replies="reply.commendList"
            :handleClick="handleClick"
            :depth="depth + 1"
          />
        </div>
      </div>
      <div class="reply-expand" @click="expanded = false">
        <span>{{ replies.length }} 条评论</span>
        <van-icon name="arrow-down" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CommentItem } from '@/types'
import { LOADING_URL } from '@/utils/constant'

defineOptions({ name: 'ReplyList' })

interface Props {
  replies: CommentItem[]
  handleClick?: (data: any) => void
  depth?: number
}

withDefaults(defineProps<Props>(), {
  depth: 0,
})

const expanded = ref(false)
</script>

<style scoped>
.reply_list {
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 0.8rem;
  width: 100%;
  text-align: left;
}

.reply_list--nested {
  margin-top: 6px;
  border-left: 2px solid #e0e0e0;
  border-radius: 0 5px 5px 0;
}

.reply_item {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.reply_item:last-child {
  margin-bottom: 0;
}

.reply_avatar {
  flex-shrink: 0;
  margin-top: 2px;
}

.reply_body {
  flex: 1;
  min-width: 0;
}

.reply-text-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  line-height: 1.5;
}

.reply-colon {
  color: #999;
  flex-shrink: 0;
}

.reply-text {
  flex: 1 1 0;
  min-width: 0;
  color: #000;
}

.reply-text :deep(img) {
  display: block;
  width: 100% !important;
  height: auto;
}

.reply-text :deep(p) {
  margin: 0;
}

.reply-item-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.2em;
}

.reply-summary {
  display: flex;
  gap: 6px;
  cursor: pointer;
}

.reply-text-preview {
  color: #000;
  word-break: break-word;
}

.reply-expand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
}
</style>
