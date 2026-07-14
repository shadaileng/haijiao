<template>
  <div class="card van-hairline--bottom">
    <van-row>
      <van-col span="6">
        <van-image
          round
          width="4rem"
          height="4rem"
          :src="LOADING_URL"
          v-headicon="userInfo && (userInfo.avatar?.startsWith('http') ? userInfo.avatar + '.txt' : userInfo.avatar)"
        />
      </van-col>
      <van-col span="16" class="hv-text-start">
        <van-space :size="10" direction="vertical">
          <van-row>
            <van-col span="24">
              <span>{{ userInfo?.nickname }}</span>
              <span>(ID: {{ userInfo?.id || userInfo?.userId }})</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24">
              <van-space :size="20">
                <span>帖子:{{ userInfo?.topicCount }}</span>
                <span>粉丝:{{ userInfo?.fansCount }}</span>
                <span>关注:{{ userInfo?.favoriteCount }}</span>
              </van-space>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="24" class="hv-sign">
              <span>签名:{{ userInfo?.description || '这家伙很懒什么也没留下' }}</span>
            </van-col>
          </van-row>
        </van-space>
      </van-col>
    </van-row>
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
  padding-top: 10px;
  padding-bottom: 5px;
}
</style>
