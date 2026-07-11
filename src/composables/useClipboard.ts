import { ref } from 'vue'

export function useClipboard() {
  const copying = ref(false)

  async function copy(text: string): Promise<boolean> {
    copying.value = true
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    } finally {
      copying.value = false
    }
  }

  return { copy, copying }
}
