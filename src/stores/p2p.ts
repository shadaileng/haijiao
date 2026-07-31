import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SharedItem {
  deviceId: string
  timestamp: number
  type: 'footprint' | 'recommendation'
  itemType: 'topic' | 'user'
  id: string
  title: string
  reason?: string
}

export interface PeerDevice {
  id: string
  nickname: string
  status: 'online' | 'offline' | 'connecting'
  lastHeartbeat: number
  activityScore: number
}

export const useP2PStore = defineStore(
  'p2p',
  () => {
    const status = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
    const devices = ref<Record<string, PeerDevice>>({})
    const sharedItems = ref<SharedItem[]>([])
    const receivedItems = ref<SharedItem[]>([])

    const onlineDevices = computed(() => {
      return Object.values(devices.value)
        .filter(d => d.status === 'online')
    })

    const sortedDevices = computed(() => {
      return Object.values(devices.value)
        .sort((a, b) => {
          if (a.status === 'online' && b.status !== 'online') return -1
          if (a.status !== 'online' && b.status === 'online') return 1
          return b.activityScore - a.activityScore
        })
    })

    const onlineCount = computed(() => onlineDevices.value.length)

    function setStatus(newStatus: 'disconnected' | 'connecting' | 'connected'): void {
      status.value = newStatus
    }

    function updateDeviceStatus(deviceId: string, deviceStatus: 'online' | 'offline', nickname?: string): void {
      const existing = devices.value[deviceId]

      if (existing) {
        devices.value[deviceId] = {
          ...existing,
          status: deviceStatus,
          lastHeartbeat: Date.now(),
          activityScore: deviceStatus === 'online' ? existing.activityScore + 10 : existing.activityScore,
          nickname: nickname || existing.nickname,
        }
      } else {
        devices.value = {
          ...devices.value,
          [deviceId]: {
            id: deviceId,
            nickname: nickname || `设备 ${deviceId.slice(0, 8)}`,
            status: deviceStatus,
            lastHeartbeat: Date.now(),
            activityScore: deviceStatus === 'online' ? 10 : 0,
          },
        }
      }
    }

    function removeDevice(deviceId: string): void {
      const { [deviceId]: _, ...rest } = devices.value
      devices.value = rest
    }

    function addSharedItem(item: SharedItem): void {
      const exists = sharedItems.value.some(
        i => i.deviceId === item.deviceId && i.id === item.id && i.type === item.type
      )
      if (exists) {
        sharedItems.value = sharedItems.value.map(i =>
          i.deviceId === item.deviceId && i.id === item.id && i.type === item.type
            ? { ...i, timestamp: item.timestamp }
            : i
        )
      } else {
        sharedItems.value.unshift(item)
      }
    }

    function addReceivedItem(item: SharedItem): void {
      const exists = receivedItems.value.some(
        i => i.deviceId === item.deviceId && i.id === item.id && i.type === item.type
      )
      if (exists) {
        receivedItems.value = receivedItems.value.map(i =>
          i.deviceId === item.deviceId && i.id === item.id && i.type === item.type
            ? { ...i, timestamp: item.timestamp }
            : i
        )
      } else {
        receivedItems.value.unshift(item)
      }
    }

    function clearDevices(): void {
      devices.value = {}
    }

    function clearSharedItems(): void {
      sharedItems.value = []
    }

    function clearReceivedItems(): void {
      receivedItems.value = []
    }

    return {
      status,
      devices,
      sharedItems,
      receivedItems,
      onlineDevices,
      sortedDevices,
      onlineCount,
      setStatus,
      updateDeviceStatus,
      removeDevice,
      addSharedItem,
      addReceivedItem,
      clearDevices,
      clearSharedItems,
      clearReceivedItems,
    }
  },
  {
    persist: false,
  }
)
