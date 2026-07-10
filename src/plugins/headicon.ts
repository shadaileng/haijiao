import type { App } from 'vue'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement
      if (img.dataset.src) {
        const url = img.dataset.src
        img.src = url.startsWith('http') ? url + '.txt' : url
        img.dataset.lazy = 'loaded'
        observer.unobserve(img)
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
