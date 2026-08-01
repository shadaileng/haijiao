<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <van-nav-bar title="页面未找到" />
    <div class="not-found-content">
      <van-empty image="error" description="404">
        <van-button type="primary" round @click="router.replace('/')">返回首页</van-button>
      </van-empty>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  background: #f7f8fa;
}
.not-found-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 46px);
}
</style>
