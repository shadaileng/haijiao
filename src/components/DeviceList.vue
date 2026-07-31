<script setup lang="ts">
import { computed } from 'vue'
import { useP2PStore } from '@/stores/p2p'

const p2pStore = useP2PStore()

const sortedDevices = computed(() => p2pStore.sortedDevices)
const onlineCount = computed(() => p2pStore.onlineCount)

const formatDeviceLabel = (device: any) => {
  const statusText = device.status === 'online' ? '在线' : '离线'
  const activityText = `活跃度: ${device.activityScore}`
  return `${statusText} · ${activityText}`
}
</script>

<template>
  <div class="device-list">
    <van-cell-group inset>
      <van-cell title="在线设备" :value="`${onlineCount}/${sortedDevices.length}`" />
      <van-cell
        v-for="device in sortedDevices"
        :key="device.id"
        :title="device.nickname"
        :label="formatDeviceLabel(device)"
      >
        <template #right-icon>
          <van-tag :type="device.status === 'online' ? 'success' : 'default'">
            {{ device.status === 'online' ? '在线' : '离线' }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-if="sortedDevices.length === 0" description="暂无设备" />
  </div>
</template>

<style scoped>
.device-list {
  padding: 12px 0;
}
</style>
