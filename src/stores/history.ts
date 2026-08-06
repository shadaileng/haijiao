import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HistoryItem {
  type: 'user' | 'topic'
  id: string
  title: string
  time: number
}

const MAX_RECORDS = 100

export const useHistoryStore = defineStore(
  'history',
  () => {
    const records = ref<HistoryItem[]>([])

    const userRecords = computed(() =>
      records.value
        .filter(r => r.type === 'user')
        .sort((a, b) => b.time - a.time)
    )

    const topicRecords = computed(() =>
      records.value
        .filter(r => r.type === 'topic')
        .sort((a, b) => b.time - a.time)
    )

    const addRecord = (type: 'user' | 'topic', id: string, title: string) => {
      if (!id) return
      const idx = records.value.findIndex(r => r.type === type && r.id === id)
      if (idx >= 0) {
        records.value.splice(idx, 1)
      }
      records.value.unshift({ type, id, title, time: Date.now() })
      if (records.value.length > MAX_RECORDS) {
        records.value.length = MAX_RECORDS
      }
    }

    const removeRecord = (type: 'user' | 'topic', id: string) => {
      const idx = records.value.findIndex(r => r.type === type && r.id === id)
      if (idx >= 0) records.value.splice(idx, 1)
    }

    const clearRecords = () => {
      records.value = []
    }

    return { records, userRecords, topicRecords, addRecord, removeRecord, clearRecords }
  },
  {
    persist: true,
  }
)
