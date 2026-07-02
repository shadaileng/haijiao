<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Toast } from 'vant'

const router = useRouter()
const store = useUserStore()
const isLoggedIn = ref(store.isLoggedIn)

onMounted(() => {
  isLoggedIn.value = store.isLoggedIn
})
</script>

<template>
  <div class="home-view">
    <van-nav-bar title="海角助手">
      <template #right>
        <van-icon name="setting-o" size="22" @click="router.push('/settings')" />
      </template>
    </van-nav-bar>

    <div class="content-area">
      <van-cell-group inset class="status-group">
        <van-cell
          title="登录状态"
          :value="isLoggedIn ? '已登录' : '未登录'"
          :label="isLoggedIn ? `UID: ${store.uid}` : '请在设置中填写UID和Token'"
        />
      </van-cell-group>

      <van-cell-group inset class="feature-group">
        <van-grid :column-num="2" :border="false">
          <van-grid-item icon="wap-home-o" text="帖子详情" to="/topic" />
          <van-grid-item icon="search" text="搜索帖子" to="/search" />
          <van-grid-item icon="friends-o" text="关注列表" to="/follow" />
          <van-grid-item icon="user-o" text="用户帖子" to="/user" />
        </van-grid>
      </van-cell-group>

      <van-cell-group v-if="store.topicIds.length > 0" inset class="recent-group">
        <van-cell title="最近帖子" />
        <van-cell
          v-for="pid in store.topicIds.slice(0, 5)"
          :key="pid"
          :title="pid"
          is-link
          to="/topic"
        >
          <template #right-icon><van-icon name="arrow" /></template>
        </van-cell>
      </van-cell-group>

      <van-cell-group v-if="store.userIds.length > 0" inset class="recent-group">
        <van-cell title="最近用户" />
        <van-cell
          v-for="uid in store.userIds.slice(0, 5)"
          :key="uid"
          :title="uid"
          is-link
          to="/user"
        >
          <template #right-icon><van-icon name="arrow" /></template>
        </van-cell>
      </van-cell-group>

      <van-cell-group v-if="store.searchKeys.length > 0" inset class="recent-group">
        <van-cell title="最近搜索" />
        <van-cell
          v-for="key in store.searchKeys.slice(0, 5)"
          :key="key"
          :title="key"
          is-link
        >
          <template #right-icon><van-icon name="arrow" /></template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-tabbar v-model="active" @change="onTabChange" :fixed="true" :border="true" route>
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
    const active = ref('home')
    const onTabChange = (name: string) => {
      active.value = name
    }
    return { active, onTabChange }
  },
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.content-area {
  padding: 12px 0;
}

.status-group {
  margin-bottom: 12px;
}

.feature-group {
  margin-bottom: 12px;
}

.recent-group {
  margin-bottom: 12px;
}
</style>
