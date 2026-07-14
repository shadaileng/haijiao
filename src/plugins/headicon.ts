import type { App, Directive } from 'vue'
import { imageLoader } from '@/utils/imageLoader'
import { LOADING_URL } from '@/utils/constant'
import { useSettingsStore } from '@/stores/settings'

function apply(el: HTMLElement, binding: any) {
  const value = binding.value
  const imgElement = el.querySelector('img') as HTMLImageElement | null
  if (!imgElement || imgElement.dataset.lazy === 'loaded') return

  const settings = useSettingsStore()

  if (typeof value === 'string' && value.startsWith('http')) {
    imgElement.setAttribute('src', LOADING_URL)
    imageLoader.observe(imgElement, value)
    return
  }

  if (value) {
    const suffix = value === '-1' ? '.png' : '.jpg'
    imgElement.setAttribute('src', `${settings.apiBase}/imgs/headicon/${value}${suffix}`)
    imgElement.dataset.lazy = 'loading'
    imgElement.onload = () => {
      imgElement.dataset.lazy = 'loaded'
    }
  }
}

const vHeadicon: Directive = {
  mounted: (el: HTMLElement, binding: any) => apply(el, binding),
  updated: (el: HTMLElement, binding: any) => apply(el, binding),
  unmounted: (el: HTMLElement) => {
    const img = el.querySelector('img')
    if (img) imageLoader.unobserve(img)
  },
}

export default {
  install(app: App) {
    app.directive('headicon', vHeadicon)
  },
}
