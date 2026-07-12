import type { App, Directive } from 'vue'
import { loadImg } from '@/utils/image'
import { LOADING_URL } from '@/utils/constant'
import { useSettingsStore } from '@/stores/settings'

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const imgElement = entry.target as HTMLImageElement
      if (imgElement?.dataset['src']) {
        loadImg([{ remoteUrl: imgElement.dataset['src'] }])
          .then(data => {
            if (data[0]?.remoteUrl) imgElement.setAttribute('src', data[0].remoteUrl)
          })
          .finally(() => {
            imgElement.dataset.lazy = 'loaded'
            observer.unobserve(entry.target)
          })
      }
    }
  })
})

function apply(el: HTMLElement, binding: any) {
  const value = binding.value
  const imgElement = el.querySelector('img') as HTMLImageElement | null
  if (!imgElement || imgElement.dataset.lazy === 'loaded') return

  const settings = useSettingsStore()

  if (typeof value === 'string' && value.startsWith('http')) {
    imgElement.setAttribute('src', LOADING_URL)
    imgElement.dataset.src = value
    imgElement.dataset.lazy = 'loading'
    observer.observe(imgElement)
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
}

export default {
  install(app: App) {
    app.directive('headicon', vHeadicon)
  },
}
