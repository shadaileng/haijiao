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
})

provide('overlay', (data: { overlayShow: boolean; overlayImg?: string; overlayVideo?: boolean }) => {
  overlay.show = data.overlayShow
  if (data.overlayImg) overlay.img = data.overlayImg
  if (data.overlayVideo) overlay.video = data.overlayVideo
})
</script>

<template>
  <div class="app-container">
    <RouterView />
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
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
