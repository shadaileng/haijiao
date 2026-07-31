<script setup lang="ts">
import { computed } from 'vue'
import { useP2PStore } from '@/stores/p2p'

const p2pStore = useP2PStore()

const statusClass = computed(() => ({
  'p2p-status': true,
  'p2p-connected': p2pStore.status === 'connected',
  'p2p-connecting': p2pStore.status === 'connecting',
  'p2p-disconnected': p2pStore.status === 'disconnected',
}))

const statusText = computed(() => {
  if (p2pStore.status === 'connected') {
    return `${p2pStore.onlineCount} 台设备在线`
  }
  if (p2pStore.status === 'connecting') {
    return '连接中...'
  }
  return '未连接'
})
</script>

<template>
  <div :class="statusClass">
    <van-icon name="wifi" />
    <span>{{ statusText }}</span>
  </div>
</template>

<style scoped>
.p2p-status {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: #969799;
}

.p2p-connected {
  color: #07c160;
}

.p2p-connecting {
  color: #ff976a;
}

.p2p-disconnected {
  color: #969799;
}
</style>
