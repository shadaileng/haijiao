<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const store = useUserStore()
</script>

<template>
  <div class="home-page">
    <van-nav-bar title="海角助手">
      <template #right>
        <van-icon name="setting-o" size="22" @click="router.push('/settings')" />
      </template>
    </van-nav-bar>

    <div class="content-area">
      <!-- Quick Stats -->
      <van-cell-group inset class="stats-group">
        <van-cell title="登录状态" :value="store.isLoggedIn ? '已登录' : '未登录'" :label="store.isLoggedIn ? `UID: ${store.uid}` : '请在设置中填写UID和Token'" />
      </van-cell-group>

      <!-- Feature Grid -->
      <van-cell-group inset class="feature-group">
        <van-grid :column-num="2" :border="false">
          <van-grid-item
            icon="wap-home-o"
            text="帖子详情"
            @click="router.push('/topic')"
          />
          <van-grid-item
            icon="search"
            text="搜索帖子"
            @click="router.push('/search')"
          />
          <van-grid-item
            icon="friends-o"
            text="关注列表"
            @click="router.push('/follow')"
          />
          <van-grid-item
            icon="user-o"
            text="用户帖子"
            @click="router.push('/user')"
          />
        </van-grid>
      </van-cell-group>

      <!-- Recent Topics -->
      <van-cell-group inset v-if="store.topicIds.length > 0" class="recent-group">
        <van-cell title="最近查看的帖子" />
        <van-cell
          v-for="pid in store.topicIds.slice(0, 5)"
          :key="pid"
          :title="pid"
          is-link
          @click="router.push(`/topic/${pid}`)"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Recent Users -->
      <van-cell-group inset v-if="store.userIds.length > 0" class="recent-group">
        <van-cell title="最近查看的用户" />
        <van-cell
          v-for="uid in store.userIds.slice(0, 5)"
          :key="uid"
          :title="uid"
          is-link
          @click="router.push(`/user/${uid}`)"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Recent Searches -->
      <van-cell-group inset v-if="store.searchKeys.length > 0" class="recent-group">
        <van-cell title="最近搜索关键字" />
        <van-cell
          v-for="key in store.searchKeys.slice(0, 5)"
          :key="key"
          :title="key"
          is-link
          @click="router.push({ path: '/search', query: { q: key } })"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- Tab Bar -->
    <van-tabbar v-model="activeTab" @change="onTabChange" :fixed="true" :border="true" route>
      <van-tabbar-item name="home" icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item name="search" icon="search" to="/search">搜索</van-tabbar-item>
      <van-tabbar-item name="user" icon="friends-o" to="/follow">关注</van-tabbar-item>
      <van-tabbar-item name="settings" icon="setting-o" to="/settings">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup() {
    const activeTab = ref('home')
    const onTabChange = (name: string) => {
      activeTab.value = name
    }
    return { activeTab, onTabChange }
  },
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.content-area {
  padding: 12px 0;
}

.stats-group {
  margin-bottom: 12px;
}

.feature-group {
  margin-bottom: 12px;
}

.recent-group {
  margin-bottom: 12px;
}
</style>
