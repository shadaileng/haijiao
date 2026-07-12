import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserCurrent, FollowUser } from '@/types'
import { api } from '@/api/request'

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

    return { current, follow, setCurrent, getFollow, setFollow, fetchCurrent }
  },
  {
    persist: true,
  }
)
