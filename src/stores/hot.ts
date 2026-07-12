import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { LiteTopic } from '@/types'

export const useHotStore = defineStore(
  'hot',
  () => {
    const refresh = ref(false)
    const index = ref(1)
    const topics = reactive<LiteTopic[]>([])

    const setTopics = (items: LiteTopic[]) => {
      topics.splice(0, topics.length, ...items)
    }

    const appendTopics = (items: LiteTopic[]) => {
      topics.push(...items)
    }

    return { refresh, index, topics, setTopics, appendTopics }
  },
  {
    persist: true,
  }
)
