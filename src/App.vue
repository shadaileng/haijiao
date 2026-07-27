<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, reactive, watch, provide } from 'vue'
import TabBar from '@/components/common/TabBar.vue'

const route = useRoute()
const active = ref('hot')

watch(
  () => route.path,
  (newVal) => {
    if (route.meta?.showTabBar) {
      const name = newVal.slice(1) || 'hot'
      active.value = name
    }
  },
  { immediate: true }
)

const overlay = reactive({
  show: false,
  img: '',
  video: false,
  dplayer: null as any | null,
})

provide('overlay', (data: { overlayShow: boolean; overlayImg?: string; overlayVideo?: boolean; dplayer?: any }) => {
  overlay.show = data.overlayShow
  if (data.overlayImg) overlay.img = data.overlayImg
  if (data.overlayVideo) overlay.video = data.overlayVideo
  if (data.dplayer) overlay.dplayer = data.dplayer
})

watch(() => overlay.show, (val) => {
  if (!val) {
    if (overlay.dplayer) {
      overlay.dplayer.destroy()
      overlay.dplayer = null
    }
    overlay.video = false
    overlay.img = ''
  }
})
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <keep-alive :include="['HotTopicsView', 'SearchView', 'UserHomeView', 'FollowView']">
        <component :is="Component" />
      </keep-alive>
    </RouterView>
    <TabBar v-if="route.meta?.showTabBar" />
    <van-back-top />
    <van-overlay :show="overlay.show" @click="overlay.show = false">
      <div class="overlay-wrapper">
        <img
          v-if="overlay.img"
          class="hv-img-view"
          :src="overlay.img"
          @click.stop
        />
        <div
          v-if="overlay.video"
          class="hv-video-container"
          @click.stop
        />
      </div>
    </van-overlay>
  </div>
</template>

<style>
.app-container {
  max-width: 768px;
  min-width: 320px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f7f8fa;
}

.van-nav-bar--fixed {
  max-width: 768px;
  left: 50% !important;
  transform: translateX(-50%);
}

.van-tabbar {
  max-width: 768px;
  left: 50% !important;
  transform: translateX(-50%);
}
</style>
