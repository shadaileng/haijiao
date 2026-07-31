<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useP2PStore } from '@/stores/p2p'
import { p2pManager } from '@/p2p/manager'
import { showDialog } from 'vant'
import { useSafeBack } from '@/utils/navigation'

defineOptions({ name: 'P2PSettingsView' })

const router = useRouter()
const settings = useSettingsStore()
const p2pStore = useP2PStore()
const safeBack = useSafeBack()

const p2pEnabled = ref(false)
const deviceNickname = ref('')
const deviceId = ref('')
const maxOfflineDevices = ref(10)

onMounted(async () => {
  p2pEnabled.value = settings.p2pEnabled || false
  deviceNickname.value = settings.deviceNickname || ''
  maxOfflineDevices.value = settings.maxOfflineDevices || 10

  if (!p2pStore.status || p2pStore.status === 'disconnected') {
    await p2pManager.initialize()
  }

  const identity = p2pManager.getIdentity()
  if (identity) {
    deviceId.value = identity.id
    if (!deviceNickname.value) {
      deviceNickname.value = identity.nickname
    }
  }
})

const onlineCount = computed(() => p2pStore.onlineCount)

const toggleP2P = async (enabled: boolean) => {
  if (enabled) {
    await p2pManager.connect()
  } else {
    p2pManager.disconnect()
  }
  settings.setP2PEnabled(enabled)
}

const editNickname = () => {
  showDialog({
    title: '设置设备昵称',
    showCancelButton: true,
    message: '其他设备将看到此昵称',
  }).then(() => {
    // 实际实现中需要输入框
  }).catch(() => {})
}

const editMaxDevices = () => {
  // 实际实现中需要数字选择器
}
</script>

<template>
  <div class="p2p-settings-view">
    <van-nav-bar title="P2P 设置" left-arrow @click-left="safeBack" />

    <van-cell-group inset>
      <van-cell title="启用共享">
        <template #right-icon>
          <van-switch v-model="p2pEnabled" @change="toggleP2P" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset v-if="p2pEnabled" title="设备信息">
      <van-cell title="设备昵称" :value="deviceNickname" is-link @click="editNickname" />
      <van-cell title="设备 ID" :label="deviceId" />
    </van-cell-group>

    <van-cell-group inset v-if="p2pEnabled" title="设备数量限制">
      <van-cell title="最大离线设备数" :value="maxOfflineDevices" is-link @click="editMaxDevices" />
      <van-cell label="在线设备始终显示，不受数量限制">
        <template #title>
          <div class="config-hint">超过限制的离线设备将按活跃度自动清理</div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset v-if="p2pEnabled" title="在线设备">
      <van-cell :value="`${onlineCount} 台设备在线`" is-link @click="router.push('/shared')">
        <template #right-icon><van-icon name="arrow" /></template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>
.p2p-settings-view {
  min-height: 100vh;
  background: #f7f8fa;
}
.config-hint {
  font-size: 12px;
  color: #969799;
}
</style>
