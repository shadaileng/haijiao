<template>
  <div class="card van-hairline--bottom">
    <div class="user-info-main">
      <van-image
        round
        width="4rem"
        height="4rem"
        :src="LOADING_URL"
        v-headicon="userInfo && (userInfo.avatar?.startsWith('http') ? userInfo.avatar + '.txt' : userInfo.avatar)"
        class="user-info-avatar"
      />
      <div class="user-info-body">
        <div class="user-info-name">
          <span>{{ userInfo?.nickname }}</span>
          <span class="user-info-id">(ID: {{ userInfo?.id || userInfo?.userId }})</span>
        </div>
        <div class="user-info-stats">
          <span>帖子:{{ userInfo?.topicCount }}</span>
          <span>粉丝:{{ userInfo?.fansCount }}</span>
          <span>关注:{{ userInfo?.favoriteCount }}</span>
        </div>
        <div class="user-info-sign hv-sign">
          <span>签名:{{ userInfo?.description || '这家伙很懒什么也没留下' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LOADING_URL } from '@/utils/constant'
import type { UserInfoProp } from '@/types'

defineProps<{
  userInfo: UserInfoProp | null
}>()
</script>

<style scoped>
.card {
  text-align: left;
  cursor: pointer;
  padding: 10px 16px 5px;
}
.user-info-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.user-info-avatar {
  flex-shrink: 0;
}
.user-info-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.user-info-name {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}
.user-info-id {
  font-size: 0.8rem;
  color: #999;
  font-weight: 400;
  margin-left: 4px;
}
.user-info-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}
.user-info-sign {
  font-size: 0.85rem;
}
</style>
