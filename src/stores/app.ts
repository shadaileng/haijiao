import { defineStore } from 'pinia'
import { ref } from 'vue'

const MIN_DURATION = 300

export const useAppStore = defineStore('app', () => {
  const loading = ref(0)
  let timer: ReturnType<typeof setTimeout> | null = null
  let startTime = 0

  function show() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    startTime = Date.now()
    loading.value++
  }

  function hide() {
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_DURATION) {
      timer = setTimeout(() => {
        if (loading.value > 0) loading.value--
        timer = null
      }, MIN_DURATION - elapsed)
    } else {
      if (loading.value > 0) loading.value--
    }
  }

  return { loading, show, hide }
})
