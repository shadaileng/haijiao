import 'vue'

interface EmojiUtil {
  render: (content: string) => string
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $emoji: EmojiUtil
  }
}
