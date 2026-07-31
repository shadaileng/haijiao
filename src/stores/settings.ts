import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_BASE = 'https://haijiao.com'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const apiBase = ref(DEFAULT_BASE)
    const uid = ref('')
    const token = ref('')
    const p2pEnabled = ref(false)
    const deviceNickname = ref('')
    const maxOfflineDevices = ref(10)

    const isLoggedIn = computed(() => !!uid.value && !!token.value)

    const getConfig = () => ({
      apiBase: apiBase.value,
      uid: uid.value,
      token: token.value,
      p2pEnabled: p2pEnabled.value,
      deviceNickname: deviceNickname.value,
      maxOfflineDevices: maxOfflineDevices.value,
    })

    const setConfig = (config: Partial<{ apiBase: string; uid: string; token: string; p2pEnabled: boolean; deviceNickname: string; maxOfflineDevices: number }>) => {
      if (config.apiBase) apiBase.value = config.apiBase
      if (config.uid !== undefined) uid.value = config.uid
      if (config.token !== undefined) token.value = config.token
      if (config.p2pEnabled !== undefined) p2pEnabled.value = config.p2pEnabled
      if (config.deviceNickname !== undefined) deviceNickname.value = config.deviceNickname
      if (config.maxOfflineDevices !== undefined) maxOfflineDevices.value = config.maxOfflineDevices
    }

    const setApiBase = (base: string) => {
      apiBase.value = base || DEFAULT_BASE
    }

    const setCredentials = (newUid: string, newToken: string) => {
      uid.value = newUid
      token.value = newToken
    }

    const setP2PEnabled = (enabled: boolean) => {
      p2pEnabled.value = enabled
    }

    const setDeviceNickname = (nickname: string) => {
      deviceNickname.value = nickname
    }

    const setMaxOfflineDevices = (max: number) => {
      maxOfflineDevices.value = max
    }

    const logout = () => {
      uid.value = ''
      token.value = ''
    }

    return {
      apiBase,
      uid,
      token,
      p2pEnabled,
      deviceNickname,
      maxOfflineDevices,
      isLoggedIn,
      getConfig,
      setConfig,
      setApiBase,
      setCredentials,
      setP2PEnabled,
      setDeviceNickname,
      setMaxOfflineDevices,
      logout,
    }
  },
  {
    persist: true,
  }
)
