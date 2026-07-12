import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { showSuccessToast } from 'vant'

export function useMirrorConfig() {
  const store = useSettingsStore()
  const showDialog = ref(false)
  const mirrorUrl = ref('')

  const mirrorDisplay = () => store.apiBase

  function openConfig() {
    mirrorUrl.value = store.apiBase
    showDialog.value = true
  }

  function saveConfig() {
    store.setApiBase(mirrorUrl.value.trim())
    showDialog.value = false
    showSuccessToast('镜像源已更新')
  }

  return { showDialog, mirrorUrl, mirrorDisplay, openConfig, saveConfig }
}
