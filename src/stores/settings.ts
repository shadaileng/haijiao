import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_BASE = 'https://haijiao.com'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const apiBase = ref(DEFAULT_BASE)
    const uid = ref('')
    const token = ref('')

    const isLoggedIn = computed(() => !!uid.value && !!token.value)

    const getConfig = () => ({
      apiBase: apiBase.value,
      uid: uid.value,
      token: token.value,
    })

    const setConfig = (config: Partial<{ apiBase: string; uid: string; token: string }>) => {
      if (config.apiBase) apiBase.value = config.apiBase
      if (config.uid !== undefined) uid.value = config.uid
      if (config.token !== undefined) token.value = config.token
    }

    const setApiBase = (base: string) => {
      apiBase.value = base || DEFAULT_BASE
    }

    const setCredentials = (newUid: string, newToken: string) => {
      uid.value = newUid
      token.value = newToken
    }

    const logout = () => {
      uid.value = ''
      token.value = ''
    }

    return { apiBase, uid, token, isLoggedIn, getConfig, setConfig, setApiBase, setCredentials, logout }
  },
  {
    persist: true,
  }
)
