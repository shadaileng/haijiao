<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useP2PStore } from '@/stores/p2p'
import { useSafeBack } from '@/utils/navigation'
import DeviceList from '@/components/DeviceList.vue'

defineOptions({ name: 'SharedView' })

const router = useRouter()
const safeBack = useSafeBack()
const p2pStore = useP2PStore()

const activeTab = ref(0)

const sharedFootprints = computed(() =>
  p2pStore.receivedItems.filter(item => item.type === 'footprint')
)

const sharedRecommendations = computed(() =>
  p2pStore.receivedItems.filter(item => item.type === 'recommendation')
)

const getDeviceLabel = (deviceId: string) => {
  const device = p2pStore.devices.get(deviceId)
  return device?.nickname || `设备 ${deviceId.slice(0, 8)}...`
}

const formatTime = (timestamp: number) => {
  const d = new Date(timestamp)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const goToItem = (item: any) => {
  if (item.itemType === 'topic') {
    router.push(`/topic/${item.id}`)
  } else if (item.itemType === 'user') {
    router.push(`/homepage/${item.id}`)
  }
}
</script>

<template>
  <div class="shared-view">
    <van-nav-bar title="共享发现" left-arrow @click-left="safeBack" />

    <van-tabs v-model:active="activeTab">
      <van-tab title="设备">
        <DeviceList />
      </van-tab>

      <van-tab title="足迹">
        <van-list v-if="sharedFootprints.length > 0">
          <van-cell
            v-for="item in sharedFootprints"
            :key="`${item.deviceId}-${item.id}`"
            :title="item.title"
            :label="getDeviceLabel(item.deviceId)"
            :value="formatTime(item.timestamp)"
            is-link
            @click="goToItem(item)"
          />
        </van-list>
        <van-empty v-else description="暂无共享足迹" />
      </van-tab>

      <van-tab title="推荐">
        <van-list v-if="sharedRecommendations.length > 0">
          <van-cell
            v-for="item in sharedRecommendations"
            :key="`${item.deviceId}-${item.id}`"
            :title="item.title"
            :label="item.reason"
            :value="formatTime(item.timestamp)"
            is-link
            @click="goToItem(item)"
          />
        </van-list>
        <van-empty v-else description="暂无共享推荐" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.shared-view {
  min-height: 100vh;
  background: #f7f8fa;
}
</style>
