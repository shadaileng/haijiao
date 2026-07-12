import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { User } from '@/types'

export const useHomepageStore = defineStore(
  'homepage',
  () => {
    const userInfo = reactive(new Map<string, User>())
    const topics = reactive(new Map<string, any[]>())

    const setUserInfo = (user: User) => {
      userInfo.set(user.userId + '', user)
    }

    const getUserInfo = (userId: number): User | undefined => {
      return userInfo.get(userId + '')
    }

    const setTopics = (newTopics: any[], userId: number) => {
      topics.set(userId + '', newTopics)
    }

    const getTopics = (userId: number): any[] => {
      return topics.get(userId + '') || []
    }

    return { userInfo, topics, setUserInfo, getUserInfo, setTopics, getTopics }
  },
  {
    persist: true,
  }
)
