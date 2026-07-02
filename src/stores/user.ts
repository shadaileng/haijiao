import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { UserInfo, FollowUser } from '@/types'

export interface UserState {
  uid: string
  token: string
  followMap: Record<string, FollowUser[]>
  topicIds: string[]
  topicCache: Record<string, any>
  userIds: string[]
  userTopicsCache: Record<string, any>
  searchKeys: string[]
  searchTopicsCache: Record<string, any>
}

export const useUserStore = defineStore('user', () => {
  const uid = ref('')
  const token = ref('')
  const followMap = ref<Record<string, FollowUser[]>>({})
  const topicIds = ref<string[]>([])
  const topicCache = ref<Record<string, any>>({})
  const userIds = ref<string[]>([])
  const userTopicsCache = ref<Record<string, any>>({})
  const searchKeys = ref<string[]>([])
  const searchTopicsCache = ref<Record<string, any>>({})

  const isLoggedIn = computed(() => !!uid.value && !!token.value)

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('haijiao_user')
      if (raw) {
        const data = JSON.parse(raw)
        uid.value = data.uid || ''
        token.value = data.token || ''
      }
      const topicRaw = localStorage.getItem('haijiao_topic')
      if (topicRaw) {
        const data = JSON.parse(topicRaw)
        topicIds.value = data.topicIds || []
        topicCache.value = data.topic || {}
      }
      const homeRaw = localStorage.getItem('haijiao_homepage')
      if (homeRaw) {
        const data = JSON.parse(homeRaw)
        userIds.value = data.userIds || []
        userTopicsCache.value = data.topics || {}
      }
      const searchRaw = localStorage.getItem('haijiao_search')
      if (searchRaw) {
        const data = JSON.parse(searchRaw)
        searchKeys.value = data.keys || []
        searchTopicsCache.value = data.topics || {}
      }
      const followRaw = localStorage.getItem('haijiao_follow')
      if (followRaw) {
        const data = JSON.parse(followRaw)
        followMap.value = data.follow || {}
      }
    } catch (e) {
      console.error('load storage error:', e)
    }
  }

  function saveUser() {
    localStorage.setItem('haijiao_user', JSON.stringify({ uid: uid.value, token: token.value }))
  }

  function saveTopic() {
    localStorage.setItem('haijiao_topic', JSON.stringify({
      topicIds: topicIds.value,
      topic: topicCache.value,
    }))
  }

  function saveHomepage() {
    localStorage.setItem('haijiao_homepage', JSON.stringify({
      userIds: userIds.value,
      topics: userTopicsCache.value,
    }))
  }

  function saveSearch() {
    localStorage.setItem('haijiao_search', JSON.stringify({
      keys: searchKeys.value,
      topics: searchTopicsCache.value,
    }))
  }

  function saveFollow() {
    localStorage.setItem('haijiao_follow', JSON.stringify({
      follow: followMap.value,
    }))
  }

  function setCredentials(newUid: string, newToken: string) {
    uid.value = newUid
    token.value = newToken
    saveUser()
  }

  function addTopicId(pid: string) {
    if (!topicIds.value.includes(pid)) {
      topicIds.value.unshift(pid)
    }
    saveTopic()
  }

  function cacheTopic(pid: string, data: any) {
    topicCache.value[pid] = data
    saveTopic()
  }

  function addUserUid(userId: string) {
    if (!userIds.value.includes(userId)) {
      userIds.value.unshift(userId)
    }
    saveHomepage()
  }

  function cacheUserTopics(userId: string, data: any) {
    userTopicsCache.value[userId] = data
    saveHomepage()
  }

  function addSearchKey(key: string) {
    if (!searchKeys.value.includes(key)) {
      searchKeys.value.unshift(key)
    }
    saveSearch()
  }

  function cacheSearchTopics(key: string, data: any) {
    searchTopicsCache.value[key] = data
    saveSearch()
  }

  function cacheFollow(uid: string, data: any) {
    followMap.value[uid] = data
    saveFollow()
  }

  loadFromStorage()

  return {
    uid, token, followMap, topicIds, topicCache,
    userIds, userTopicsCache, searchKeys, searchTopicsCache,
    isLoggedIn,
    setCredentials, addTopicId, cacheTopic, addUserUid,
    cacheUserTopics, addSearchKey, cacheSearchTopics, cacheFollow,
  }
})
