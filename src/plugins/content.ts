import type { App, Directive } from 'vue'
import { Attachment } from '@/types'
import { loadVideoSrc, resolveRealUrl } from '@/api/request'
import { imageLoader } from '@/utils/imageLoader'
import { renderEmoji } from '@/utils/emoji'
import { LOADING_URL } from '@/utils/constant'
import DPlayer from 'dplayer'
import Hls from 'hls.js'
import router from '@/router'

let player: DPlayer | null = null

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

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
    let { topicId, content, attachments, doors, handleClick, sale } = binding.value
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

    // [door]{id}[/door] 解析
    if (content.includes('[/door]')) {
      for (const fragment of content.split('[/door]')) {
        if (!fragment.includes('[door]')) continue
        const doorId = fragment.split('[door]')[1]
        const doorData = Array.isArray(doors)
          ? doors.find((d: any) => d.type === 1 && String(d.id) === doorId)
          : null

        if (doorData && doorData.destValid) {
          const stats = `
            <span>${formatCount(doorData.viewCount)} 浏览</span>
            <span>${formatCount(doorData.commentCount)} 评论</span>
            <span>${formatCount(doorData.buyCount)} 人已购买</span>`
          const imgBlock = doorData.imgUrl
            ? `<div class="door-box-img"><img src="${LOADING_URL}" data-src="${doorData.imgUrl}" /></div>`
            : ''
          const html = `<div class="door-box" data-door="${doorData.id}">
            <div class="door-box-text">
              <h3>${doorData.title}</h3>
              <div class="door-stats">${stats}</div>
            </div>
            ${imgBlock}
          </div>`
          content = content.replace(`[door]${doorId}[/door]`, html)
        } else {
          const label = doorData ? '传送门已失效' : '传送门'
          content = content.replace(
            `[door]${doorId}[/door]`,
            `<span class="hv-door-span" data-door="${doorId}">[${label}]</span>`
          )
        }
      }
    }

    // sell-btn HTML 解析 + 后续所有 DOM 操作（可能需异步预加载 sell 视频数据）
    ;(async () => {
      let videoAtta = attachList.find(a => a.category === 'video')

      // 如果 attachList 中没有 video 附件，尝试从 sell 内容中提取 <video> ID 并主动加载
      if (!videoAtta && content.includes('class="sell-btn"')) {
        const sellBlock = content.match(/<span\s+class="sell-btn"[^>]*>[\s\S]*?<\/span>/i)?.[0] || ''
        const vidMatch = sellBlock.match(/<video[\s\S]*?data-id="(\d+)"/)
        if (vidMatch) {
          try {
            const vidId = Number(vidMatch[1])
            const data = await loadVideoSrc(vidId, topicId, '')
            videoAtta = {
              id: vidId,
              coverUrl: data.coverUrl || '',
              keyPath: data.keyPath || '',
              video_time_length: data.video_time_length || 0,
              category: 'video',
              remoteUrl: data.remoteUrl || '',
              status: 1,
            } as Attachment
          } catch {}
        }
      }

      // sell-btn HTML 解析
      if (content.includes('class="sell-btn"')) {
        content = content.replace(
          /<span\s+class="sell-btn"[^>]*>[\s\S]*?<\/span>/gi,
          () => {
            let html = '<div class="hjsell-container">'
            if (sale) {
              const unit = sale.moneyType === 1 ? '金币' : (sale.amount / 100).toFixed(2) + '钻石'
              const price = sale.moneyType === 1 ? sale.amount : (sale.amount / 100).toFixed(2)
              html += `<div class="hssell-title">此贴售价${price}${unit}，已有${formatCount(sale.buyCount || 0)}人购买</div>`
              if (sale.buyIndex > 0) {
                html += `<div class="hssell-title hssell-bought">您是第${sale.buyIndex}个购买者</div>`
              } else if (sale.buyIndex < 0) {
                html += `<div class="hssell-title hssell-not-bought">您还未购买</div>`
                if (videoAtta) {
                  html += `<div class="hv-video-div" data-id="${videoAtta.id}" id="video_${videoAtta.id}_${Date.now()}" key-path="${videoAtta.keyPath}" data-url="${videoAtta.coverUrl}">
                    <img src="${LOADING_URL}" data-id="${videoAtta.id}">
                  </div>`
                }
              }
            } else {
              html += '<div class="hssell-title">此处为购买内容</div>'
            }
            html += '</div>'
            return html
          }
        )
      }

      el.innerHTML = content

      // door 点击导航
      el.querySelectorAll<HTMLElement>('.door-box, .hv-door-span').forEach(doorEl => {
        doorEl.addEventListener('click', () => {
          const pid = doorEl.dataset.door
          if (pid) router.push('/topic/' + pid)
        })
      })

      // door 缩略图懒加载
      el.querySelectorAll<HTMLImageElement>('.door-box-img img').forEach(img => {
        const url = img.dataset.src
        if (url) imageLoader.observe(img, url)
      })

      el.querySelectorAll<HTMLImageElement>('img:not([data-emoji])').forEach(img => {
        img.style.width = '100%'
        const atta = attas.get(Number((img as HTMLElement).dataset['id']))
        if (atta) {
          if (atta.category === 'images') {
            img.dataset['src'] = atta.remoteUrl
            img.addEventListener('click', () => {
              handleClick?.({ overlayShow: true, overlayImg: img.src })
            })
            imageLoader.observe(img, atta.remoteUrl)
          }
          if (atta.category === 'video') {
            img.dataset['src'] = atta.coverUrl
            img.addEventListener('click', () => {
              const videoDiv = img.closest('.hv-video-div') as HTMLElement | null
              const keyPath = (videoDiv?.getAttribute('key-path') || '') === 'undefined' ? '' : (videoDiv?.getAttribute('key-path') || '')

              handleClick?.({ overlayShow: true, overlayVideo: true })
              loadVideoSrc(String(atta.id), String(topicId), 'normal1')
                .then((data: any) => resolveRealUrl(data.remoteUrl))
                .then((fullUrl: string) => {
                  const target = img as HTMLImageElement
                  if (player) {
                    player.destroy()
                    player = null
                  }
                  player = new DPlayer({
                    container: document.querySelector('.hv-video-container') as HTMLElement,
                    screenshot: true,
                    video: {
                      url: fullUrl,
                      pic: target.src,
                      type: 'customHls',
                      customType: {
                        customHls: (video: HTMLVideoElement) => {
                          const hls = new Hls()
                          if (keyPath) {
                            hls.on(Hls.Events.MANIFEST_PARSED, (_event, manifestData) => {
                              const fragments = manifestData.levels[0]?.details?.fragments
                              if (!fragments?.length) return
                              const f0 = fragments[0] as any
                              const keyUri = keyPath + (f0.levelkey?.reluri || f0.levelkeys?.['identity']?.uri || '')
                              for (const frag of fragments) {
                                const f = frag as any
                                if (f.levelkey) {
                                  f.levelkey.reluri = keyUri
                                } else if (f.levelkeys?.['identity']) {
                                  f.levelkeys['identity'].uri = keyUri
                                }
                                if (f.relurl && !f.relurl.startsWith('http')) {
                                  f.relurl = keyPath + f.relurl
                                }
                              }
                            })
                          }
                          hls.loadSource(video.src)
                          hls.attachMedia(video)
                        },
                      },
                    },
                  })

                  handleClick?.({ overlayShow: true, overlayVideo: true, dplayer: player })
                })
                .catch((err: any) => {
                  console.error('load video error:', err)
                })
            })
            imageLoader.observe(img, atta.coverUrl)
          }
        }
      })

    })()
  },
  unmounted(el: HTMLDivElement) {
    el.querySelectorAll<HTMLImageElement>('img:not([data-emoji])').forEach(img => {
      imageLoader.unobserve(img)
    })
  },
}

export default {
  install(app: App) {
    app.directive('content', vContent)
  },
}
