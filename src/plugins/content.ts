import type { App, Directive } from 'vue'
import { Attachment } from '@/types'
import { loadVideoSrc } from '@/api/request'
import { loadImg } from '@/utils/image'
import { renderEmoji } from '@/utils/emoji'
import { LOADING_URL } from '@/utils/constant'
import DPlayer from 'dplayer'
import Hls from 'hls.js'

let player: DPlayer | null = null

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

function buildAttaMap(attachments: any): Map<number, Attachment> {
  const map = new Map<number, Attachment>()
  if (!Array.isArray(attachments)) return map
  for (const a of attachments) {
    if (a && typeof a.id === 'number') map.set(a.id, a)
  }
  return map
}

const vContent: Directive = {
  mounted(el: HTMLDivElement, binding: any) {
    if (!binding.value) return
    let { topicId, content, attachments, handleClick } = binding.value
    if (typeof content !== 'string') content = ''

    const attas = buildAttaMap(attachments)
    const attachList: Attachment[] = Array.isArray(attachments) ? attachments : []

    if (content.includes('<img') || content.includes('</video>') || content.includes('</audio>')) {
      content = content
        .replace(/src="(\S)*\.hj"/gi, `src="${LOADING_URL}"`)
        .replace(/src="(\S)*\.jpg.txt"/gi, `src="${LOADING_URL}"`)
        .replace(/src="(\S)*\.jpeg.txt"/gi, `src="${LOADING_URL}"`)
        .replace(/src="(\S)*\.png.txt"/gi, `src="${LOADING_URL}"`)
        .replace(/src="(\S)*\.gif.txt"/gi, `src="${LOADING_URL}"`)
        .replace(/src=""/gi, `src="${LOADING_URL}"`)

      const attachsVideo = attachList.filter(a => a.category === 'video')
      if (attachsVideo.length > 0) {
        const attachment = attachsVideo[0]
        const videoHtml = `
          <div class="hv-video-div" data-id="${attachment.id}" id="video_${attachment.id}_${Date.now()}" key-path="${attachment.keyPath}" data-url="${attachment.coverUrl}">
            <img src="${LOADING_URL}" data-id="${attachment.id}">
          </div>`
        content = content.replace(/\<video([\s\S]*)data-id=\"(\d+)\"><\/video>/gi, videoHtml)
      }

      const imgCount = (content.match(new RegExp('<img', 'g')) || []).length
      const attachImg = attachList.filter(a => a.category === 'images')
      if (imgCount !== attachImg.length) {
        for (let i = imgCount; i < attachImg.length; i++) {
          content += `<img src="${LOADING_URL}" data-id="${attachImg[i].id}">`
        }
      }
    } else if (attachList.length > 0) {
      for (const attachment of attachList) {
        if (attachment.category === 'video') {
          content += `
          <div class="hv-video-div" data-id="${attachment.id}" id="video_${attachment.id}_${Date.now()}" key-path="${attachment.keyPath}" data-url="${attachment.coverUrl}">
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

    content = renderEmoji(content)
    el.innerHTML = content

    el.querySelectorAll<HTMLImageElement>('img:not([data-emoji])').forEach(img => {
      img.style.width = '100%'
      const atta = attas.get(Number((img as HTMLElement).dataset['id']))
      if (atta) {
        if (atta.category === 'images') {
          img.dataset['src'] = atta.remoteUrl
          img.addEventListener('click', () => {
            handleClick?.({ overlayShow: true, overlayImg: img.src })
          })
        }
        if (atta.category === 'video') {
          img.dataset['src'] = atta.coverUrl
          img.addEventListener('click', () => {
            handleClick?.({ overlayShow: true, overlayVideo: true })
            loadVideoSrc(String(atta.id), String(topicId))
              .then((data: any) => {
                const target = img as HTMLImageElement
                if (player) {
                  player.destroy()
                  player = null
                }
                player = new DPlayer({
                  container: document.querySelector('.hv-video-container') as HTMLElement,
                  screenshot: true,
                  video: {
                    url: data.remoteUrl,
                    pic: target.src,
                    type: 'customHls',
                    customType: {
                      customHls: (video: HTMLVideoElement) => {
                        const hls = new Hls()
                        hls.loadSource(video.src)
                        hls.attachMedia(video)
                      },
                    },
                  },
                })
                handleClick?.({ overlayShow: true, overlayVideo: true })
              })
              .catch((err: any) => {
                console.error('load video error:', err)
              })
          })
        }
      }
      img.setAttribute('lazy', 'loading')
      observer.observe(img)
    })
  },
}

export default {
  install(app: App) {
    app.directive('content', vContent)
  },
}
