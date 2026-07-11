import type { App } from 'vue'
import { fetchImageThroughProxy } from '@/utils/image'
import { useUserStore } from '@/stores/user'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement
      if (img.dataset.src && img.dataset.lazy !== 'loaded') {
        const url = img.dataset.src
        if (url.startsWith('http')) {
          fetchImageThroughProxy(url)
            .then((dataUri) => {
              if (dataUri) {
                img.src = dataUri
              }
              img.dataset.lazy = 'loaded'
              observer.unobserve(img)
            })
            .catch(() => {
              img.dataset.lazy = 'loaded'
              observer.unobserve(img)
            })
        } else {
          img.src = url
          img.dataset.lazy = 'loaded'
          observer.unobserve(img)
        }
      }
    }
  })
})

export default {
  install(app: App) {
    app.directive('headicon', {
      updated(el: HTMLElement, binding: { value: string }) {
        const img = el.querySelector('img')
        if (!img || img.dataset.lazy === 'loaded' || !binding.value) return

        if (binding.value.startsWith('http')) {
          img.src = LOADING_URL
          img.dataset.src = binding.value
          img.dataset.lazy = 'loading'
          observer.observe(img)
        } else {
          const store = useUserStore()
          const baseUrl = store.proxyBase || 'https://haijiao.com'
          const extension = binding.value === '-1' ? '.png' : '.jpg'
          img.src = `${baseUrl}/imgs/headicon/${binding.value}${extension}`
          img.dataset.lazy = 'loading'
          img.onload = () => {
            img.dataset.lazy = 'loaded'
          }
        }
      },
    })
  },
}
