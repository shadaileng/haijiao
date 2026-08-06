<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>

<template>
  <Transition name="fade">
    <div v-if="appStore.loading > 0" class="global-loading">
      <div class="global-loading-mask" />
      <div class="global-loading-spinner">
        <van-loading size="32px" vertical>加载中</van-loading>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.global-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.global-loading-mask {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
}

.global-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
