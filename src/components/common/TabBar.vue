<script setup lang="ts">
import { ref } from 'vue'
const active = ref('hot')
</script>

<template>
  <van-tabbar v-model="active" route :fixed="true" :border="true">
    <van-tabbar-item name="hot" icon="home-o" to="/hot">主页</van-tabbar-item>
    <van-tabbar-item name="search" icon="search" to="/search">搜索</van-tabbar-item>
    <van-tabbar-item name="follow" icon="friends-o" to="/follow">关注</van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o" to="/settings">配置</van-tabbar-item>
  </van-tabbar>
</template>
