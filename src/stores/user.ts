import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserCurrent, FollowUser, LoginResponse } from '@/types'
import { api } from '@/api/request'
import { useSettingsStore } from '@/stores/settings'

export const useUserStore = defineStore(
  'user',
  () => {
    const current = ref<UserCurrent | null>(null)
    const follow = ref<FollowUser[]>([])

    const setCurrent = (data: UserCurrent) => {
      current.value = data
    }

    const getFollow = () => follow.value

    const setFollow = (items: FollowUser[]) => {
      follow.value.splice(0, follow.value.length, ...items)
    }

    const fetchCurrent = async (): Promise<UserCurrent | null> => {
      const resp = await api.current()
      if (!resp.success) return null
      const data = (resp.data?.user || resp.data) as UserCurrent
      current.value = data
      return data
    }

    // 登录成功后调用，保存凭证并设置当前用户
    function loginFromApi(data: LoginResponse) {
      const settings = useSettingsStore()
      settings.setCredentials(String(data.user.id), data.token)
      current.value = data.user as UserCurrent
    }

    // 退出登录，清除所有用户数据
    function logout() {
      const settings = useSettingsStore()
      settings.logout()
      current.value = null
    }

    return { current, follow, setCurrent, getFollow, setFollow, fetchCurrent, loginFromApi, logout }
  },
  {
    persist: true,
  }
)
