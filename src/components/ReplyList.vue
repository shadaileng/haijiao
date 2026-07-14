<template>
  <div class="reply_list" :class="{ 'reply_list--nested': depth > 0 }">
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
        <span class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${reply.userId}/${reply.nickname}`)">
          {{ reply.nickname }}
        </span>
        <div class="reply_content" v-content="{ content: reply.content, attachments: reply.attachments, handleClick }"></div>
        <ReplyList
          v-if="reply.commendList?.length"
          :replies="reply.commendList"
          :handleClick="handleClick"
          :depth="depth + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

.reply_content {
  text-align: left;
  word-break: break-word;
}

.reply_content :deep(img) {
  width: 100%;
  height: auto;
}
</style>
