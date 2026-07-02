import { ref, onMounted, onUnmounted } from 'vue'

export function useLoading() {
  const loading = ref(false)

  async function wrap(asyncFn: (...args: any[]) => Promise<any>, ...args: any[]) {
    loading.value = true
    try {
      const result = await asyncFn(...args)
      return result
    } finally {
      loading.value = false
    }
  }

  return { loading, wrap }
}
