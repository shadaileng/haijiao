<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabBar from '@/components/common/TabBar.vue'
</script>

<template>
  <div class="app-layout">
    <RouterView />
    <TabBar />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}
</style>
