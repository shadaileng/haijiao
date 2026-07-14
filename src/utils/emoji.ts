import { useSettingsStore } from '@/stores/settings'

export interface EmojiEntry {
  showName: string
  img: string
}

export const EMOJI_CDN_PATH = '/images/emoji/'

export const emojiMap: Record<string, EmojiEntry> = {
  '001': { showName: '[Emm]', img: 'emoji_001.png' },
  '002': { showName: '[白眼]', img: 'emoji_002.png' },
  '003': { showName: '[悲伤]', img: 'emoji_003.png' },
  '004': { showName: '[打脸]', img: 'emoji_004.png' },
  '005': { showName: '[大哭]', img: 'emoji_005.png' },
  '006': { showName: '[呆]', img: 'emoji_006.png' },
  '007': { showName: '[呆滞]', img: 'emoji_007.png' },
  '008': { showName: '[得意]', img: 'emoji_008.png' },
  '009': { showName: '[对眼]', img: 'emoji_009.png' },
  '010': { showName: '[愤怒]', img: 'emoji_010.png' },
  '011': { showName: '[尴尬]', img: 'emoji_011.png' },
  '012': { showName: '[狗带]', img: 'emoji_012.png' },
  '013': { showName: '[狗头]', img: 'emoji_013.png' },
  '014': { showName: '[坏笑]', img: 'emoji_014.png' },
  '015': { showName: '[挤眉]', img: 'emoji_015.png' },
  '016': { showName: '[惊呆]', img: 'emoji_016.png' },
  '017': { showName: '[惊讶]', img: 'emoji_017.png' },
  '018': { showName: '[囧]', img: 'emoji_018.png' },
  '019': { showName: '[渴望]', img: 'emoji_019.png' },
  '020': { showName: '[裂开]', img: 'emoji_020.png' },
  '021': { showName: '[亲亲]', img: 'emoji_021.png' },
  '022': { showName: '[色]', img: 'emoji_022.png' },
  '023': { showName: '[调皮]', img: 'emoji_023.png' },
  '024': { showName: '[偷笑]', img: 'emoji_024.png' },
  '025': { showName: '[吐]', img: 'emoji_025.png' },
  '026': { showName: '[无语]', img: 'emoji_026.png' },
  '027': { showName: '[笑哭]', img: 'emoji_027.png' },
  '028': { showName: '[斜眼笑]', img: 'emoji_028.png' },
  '029': { showName: '[疑问]', img: 'emoji_029.png' },
  '030': { showName: '[晕头]', img: 'emoji_030.png' },
  '031': { showName: '[皱眉]', img: 'emoji_031.png' },
  '032': { showName: '[猪头]', img: 'emoji_032.png' },
  '101': { showName: '[晕]', img: 'emoji_101.png' },
  '102': { showName: '[渴求]', img: 'emoji_102.png' },
  '103': { showName: '[阴险]', img: 'emoji_103.png' },
  '104': { showName: '[调皮蛋]', img: 'emoji_104.png' },
  '105': { showName: '[流泪]', img: 'emoji_105.png' },
  '106': { showName: '[惊]', img: 'emoji_106.png' },
  '107': { showName: '[淡然]', img: 'emoji_107.png' },
  '108': { showName: '[可怜]', img: 'emoji_108.png' },
  '109': { showName: '[亲一下]', img: 'emoji_109.png' },
  '110': { showName: '[微笑]', img: 'emoji_110.png' },
  '201': { showName: '[赞]', img: 'emoji_201.png' },
  '202': { showName: '[恋爱]', img: 'emoji_202.png' },
  '203': { showName: '[认真]', img: 'emoji_203.png' },
  '204': { showName: '[瞪眼]', img: 'emoji_204.png' },
  '205': { showName: '[卑微]', img: 'emoji_205.png' },
  '206': { showName: '[色眼]', img: 'emoji_206.png' },
  '207': { showName: '[闭眼笑]', img: 'emoji_207.png' },
  '208': { showName: '[飞吻]', img: 'emoji_208.png' },
  '301': { showName: '[开心]', img: 'emoji_301.png' },
  '302': { showName: '[唱歌]', img: 'emoji_302.png' },
  '303': { showName: '[可爱]', img: 'emoji_303.png' },
  '304': { showName: '[哼]', img: 'emoji_304.png' },
  '305': { showName: '[可乐]', img: 'emoji_305.png' },
  '306': { showName: '[比心]', img: 'emoji_306.png' },
  '307': { showName: '[吃手手]', img: 'emoji_307.png' },
  '308': { showName: '[不约]', img: 'emoji_308.png' },
  '309': { showName: '[略略略]', img: 'emoji_309.png' },
}

const EMOJI_RE = /\[emoji\](\d{3})\[\/emoji\]/g

export function renderEmoji(content: string): string {
  if (typeof content !== 'string' || !content) return content
  if (content.indexOf('[emoji]') === -1) return content

  const store = useSettingsStore()
  const cdnBase = store.apiBase + EMOJI_CDN_PATH

  return content.replace(EMOJI_RE, (_, id: string) => {
    return `<img data-emoji="${id}" src="${cdnBase}emoji_${id}.png" class="hv-emoji">`
  })
}
