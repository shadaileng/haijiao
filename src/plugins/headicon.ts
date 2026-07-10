import type { App } from 'vue'
import { fetchImageThroughProxy } from '@/utils/image'

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
              } else {
                img.src = url + '.txt'
              }
              img.dataset.lazy = 'loaded'
              observer.unobserve(img)
            })
            .catch(() => {
              img.src = url + '.txt'
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
          img.src = binding.value
          img.dataset.lazy = 'loaded'
        }
      },
    })
  },
}
