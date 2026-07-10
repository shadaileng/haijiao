import type { App, DirectiveBinding } from 'vue'
import { fetchImageThroughProxy } from '@/utils/image'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

interface ContentOptions {
  content: string
  attachments?: any[]
  handleClick?: (params: any) => void
  topicId?: number
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement
      if (img.dataset.src && img.dataset.lazy !== 'loaded') {
        const url = img.dataset.src
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
      }
    }
  })
})

const vContent: { install: (app: App) => void } = {
  install(app: App) {
    app.directive('content', {
      mounted(el: HTMLDivElement, binding: DirectiveBinding) {
        if (!binding.value) return
        const { content: rawContent, attachments, handleClick } = binding.value as ContentOptions
        
        let attas = new Map<number, any>()
        if (attachments) {
          attas = attachments.reduce((map: Map<number, any>, attachment: any) => {
            map.set(attachment.id, attachment)
            return map
          }, new Map<number, any>())
        }

        let content = rawContent

        if (content.includes('<img') || content.includes('</video>') || content.includes('</audio>')) {
          content = content
            .replace(/src="(\S)*\.hj"/gi, `src="${LOADING_URL}"`)
            .replace(/src="(\S)*\.jpg.txt"/gi, `src="${LOADING_URL}"`)
            .replace(/src="(\S)*\.jpeg.txt"/gi, `src="${LOADING_URL}"`)
            .replace(/src="(\S)*\.png.txt"/gi, `src="${LOADING_URL}"`)
            .replace(/src="(\S)*\.gif.txt"/gi, `src="${LOADING_URL}"`)
            .replace(/src=""/gi, `src="${LOADING_URL}"`)
          
          const attachsVideo = attachments?.filter((a: any) => a.category === 'video')
          if (attachsVideo && attachsVideo.length > 0) {
            const attachment = attachsVideo[0]
            const videoHtml = `
              <div class="hv-video-div"
                   data-id="${attachment.id}"
                   id="video_${attachment.id}_${Date.now()}"
                   key-path="${attachment.keyPath}"
                   data-url="${attachment.coverUrl}">
                <img src="${LOADING_URL}" data-id="${attachment.id}">
              </div>`
            content = content.replace(
              /\<video([\s\S]*)data-id=\"(\d+)\"><\/video>/gi,
              videoHtml
            )
          }

          const imgCount = (content.match(/<img/g) || []).length
          const attachImg = attachments?.filter((a: any) => a.category === 'images') || []
          if (imgCount !== attachImg.length) {
            for (let i = imgCount; i < attachImg.length; i++) {
              content += `<img src="${LOADING_URL}" data-id="${attachImg[i].id}">`
            }
          }

          const audioCount = (content.match(/<\/audio>/g) || []).length
          const attachAudio = attachments?.filter((a: any) => a.category === 'audio') || []
          if (audioCount !== attachAudio.length) {
            for (let i = attachImg.length; i < attachAudio.length; i++) {
              content += `
                <audio controls="controls" preload="none" data-id="${attachAudio[i].id}">
                  <source src="${attachAudio[i].remoteUrl}" type="audio/mpeg">
                </audio>`
            }
          }
        } else {
          if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
              if (attachment.category === 'video') {
                content += `
                  <div class="hv-video-div"
                       data-id="${attachment.id}"
                       id="video_${attachment.id}_${Date.now()}"
                       key-path="${attachment.keyPath}"
                       data-url="${attachment.coverUrl}">
                    <img src="${LOADING_URL}" data-id="${attachment.id}">
                  </div>`
              } else if (attachment.category === 'images') {
                content += `<img src="${LOADING_URL}" data-id="${attachment.id}">`
              } else if (attachment.category === 'audio') {
                content += `
                  <audio controls="controls" preload="none" data-id="${attachment.id}">
                    <source src="${attachment.remoteUrl}" type="audio/mpeg">
                  </audio>`
              }
            }
          }
        }

        el.innerHTML = content

        el.querySelectorAll('img').forEach((img: Element) => {
          const imgEl = img as HTMLImageElement
          imgEl.style.width = '100%'
          const atta = attas.get(Number(imgEl.dataset['id']))
          if (atta) {
            if (atta.category === 'images') {
              imgEl.dataset['src'] = atta.remoteUrl
              imgEl.addEventListener('click', () => {
                handleClick?.({
                  overlayShow: true,
                  overlayImg: imgEl.src,
                })
              })
            }
            if (atta.category === 'video') {
              imgEl.dataset['src'] = atta.coverUrl
              imgEl.addEventListener('click', () => {
                handleClick?.({
                  overlayShow: true,
                  overlayVideo: true,
                })
              })
            }
          }
          imgEl.setAttribute('lazy', 'loading')
          observer.observe(imgEl)
        })
      },
    })
  },
}

export default vContent
