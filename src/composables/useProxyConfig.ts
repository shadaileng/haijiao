import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { Toast } from 'vant'

export function useProxyConfig() {
  const store = useUserStore()
  const showDialog = ref(false)
  const proxyUrl = ref('')

  const proxyDisplay = computed(() => store.proxyBase || '/api（默认）')

  function openConfig() {
    proxyUrl.value = store.proxyBase
    showDialog.value = true
  }

  function saveConfig() {
    store.setProxyBase(proxyUrl.value)
    showDialog.value = false
    Toast.success('代理地址已更新')
  }

  return { showDialog, proxyUrl, proxyDisplay, openConfig, saveConfig }
}
