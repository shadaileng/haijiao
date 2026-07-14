<template>
  <div class="user-meta">
    <van-image
      round
      :width="avatarSize"
      :height="avatarSize"
      :src="LOADING_URL"
      v-headicon="avatar?.startsWith('http') ? avatar + '.txt' : avatar"
      class="user-meta-avatar"
    />
    <div class="user-meta-info">
      <span class="hv-nickname hv-pointer" @click="$router.push(`/homepage/${userId}/${nickname}`)">
        {{ nickname }}
      </span>
      <span class="user-meta-time">{{ displayTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LOADING_URL } from '@/utils/constant'

const props = withDefaults(defineProps<{
  avatar: string
  nickname: string
  userId: number | string
  createTime: string
  avatarSize?: string
  onlyDate?: boolean
}>(), {
  avatarSize: '3rem',
  onlyDate: false,
})

const displayTime = computed(() => {
  if (props.onlyDate) {
    return props.createTime?.split(' ')[0] || ''
  }
  return props.createTime || ''
})
</script>

<style scoped>
.user-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-meta-avatar {
  flex-shrink: 0;
}
.user-meta-info {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  text-align: left;
}
.user-meta-time {
  font-size: 0.8rem;
  color: #999;
}
</style>
