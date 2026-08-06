declare module 'dplayer' {
  export default class DPlayer {
    constructor(options: any)
    play(): void
    pause(): void
    destroy(): void
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


