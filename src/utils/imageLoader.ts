import { customDecode } from './image'

const PRIORITY_MAP = { high: 3, medium: 2, low: 1 } as const
const RETRY_DELAYS = [1000, 2000, 4000]
const DEFAULT_CONCURRENCY = 6

interface ImageTask {
  url: string
  priority: number
  resolve: (result: string | null) => void
  reject: (err: Error) => void
}

export interface LoadOptions {
  priority?: 'high' | 'medium' | 'low'
  concurrency?: number
}

export interface LoadCallbacks {
  onProgress?: (completed: number, total: number, failed: number) => void
}

export interface QueueStatus {
  pending: number
  loading: number
  completed: number
  failed: number
  cached: number
}

class AsyncQueue {
  private high: ImageTask[] = []
  private medium: ImageTask[] = []
  private low: ImageTask[] = []
  private active = 0
  private max: number

  constructor(concurrency = DEFAULT_CONCURRENCY) {
    this.max = concurrency
  }

  setMaxConcurrency(n: number) {
    this.max = n
    this.process()
  }

  get pendingCount() {
    return this.high.length + this.medium.length + this.low.length
  }

  get activeCount() {
    return this.active
  }

  enqueue(url: string, priority: number): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const task: ImageTask = { url, priority, resolve, reject }
      const bucket = priority === 3 ? this.high : priority === 2 ? this.medium : this.low
      bucket.push(task)
      this.process()
    })
  }

  cancel(urls?: string[]) {
    const buckets = [this.high, this.medium, this.low]
    for (const bucket of buckets) {
      if (urls) {
        const set = new Set(urls)
        for (let i = bucket.length - 1; i >= 0; i--) {
          if (set.has(bucket[i].url)) {
            bucket[i].reject(new Error('cancelled'))
            bucket.splice(i, 1)
          }
        }
      } else {
        for (const t of bucket) t.reject(new Error('cancelled'))
        bucket.length = 0
      }
    }
  }

  private process() {
    while (this.active < this.max) {
      const task = this.high.shift() ?? this.medium.shift() ?? this.low.shift()
      if (!task) break
      this.active++
      this.execute(task)
    }
  }

  private async execute(task: ImageTask) {
    try {
      const result = await this.fetchWithRetry(task.url)
      task.resolve(result)
    } catch (err: any) {
      task.reject(err)
    } finally {
      this.active--
      this.process()
    }
  }

  private async fetchWithRetry(url: string): Promise<string | null> {
    for (let attempt = 0; attempt <= 3; attempt++) {
      try {
        const resp = await fetch(url)
        const text = await resp.text()
        if (!text) return null
        const decoded = customDecode(text)
        if (!decoded) return url
        const base64Part = decoded.split('base64,')[1] || ''
        const trim = base64Part.length % 4 || 0
        return decoded.substring(0, decoded.length - trim)
      } catch {
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]))
        }
      }
    }
    return null
  }
}

class ImageLoader {
  private queue: AsyncQueue
  private cache = new Map<string, string>()
  private inflight = new Map<string, Promise<string | null>>()
  private completedCount = 0
  private failedCount = 0
  private observer: IntersectionObserver
  private observedElements = new WeakMap<HTMLImageElement, string>()

  constructor() {
    this.queue = new AsyncQueue(DEFAULT_CONCURRENCY)
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const img = entry.target as HTMLImageElement
          const url = this.observedElements.get(img)
          if (!url) continue
          this.observer.unobserve(img)
          img.dataset.lazy = 'loading'
          this.load([url], { priority: 'high' }).then(map => {
            const result = map.get(url)
            if (result) img.src = result
            img.dataset.lazy = 'loaded'
          })
        }
      },
      { }
    )
  }

  async load(urls: string[], options?: LoadOptions & LoadCallbacks): Promise<Map<string, string>> {
    const total = urls.length
    let completed = 0
    let failed = 0
    const results = new Map<string, string>()

    if (options?.concurrency) {
      this.queue.setMaxConcurrency(options.concurrency)
    }
    const priority = PRIORITY_MAP[options?.priority ?? 'low']

    const promises = urls.map(async url => {
      if (this.cache.has(url)) {
        results.set(url, this.cache.get(url)!)
        return
      }

      if (this.inflight.has(url)) {
        const result = await this.inflight.get(url)!
        if (result !== null) results.set(url, result)
        return
      }

      const promise = this.queue.enqueue(url, priority)
      this.inflight.set(url, promise)
      const result = await promise
      this.inflight.delete(url)
      if (result !== null) {
        this.cache.set(url, result)
        results.set(url, result)
        this.completedCount++
        completed++
      } else {
        this.failedCount++
        failed++
      }
      options?.onProgress?.(completed, total, failed)
    })

    await Promise.allSettled(promises)
    return results
  }

  observe(el: HTMLImageElement, url: string) {
    this.observedElements.set(el, url)
    el.dataset.imgSrc = url
    el.dataset.lazy = 'loading'
    this.observer.observe(el)
  }

  unobserve(el: HTMLImageElement) {
    this.observedElements.delete(el)
    this.observer.unobserve(el)
  }

  getStatus(): QueueStatus {
    return {
      pending: this.queue.pendingCount,
      loading: this.queue.activeCount,
      completed: this.completedCount,
      failed: this.failedCount,
      cached: this.cache.size,
    }
  }

  cancel(urls?: string[]) {
    this.queue.cancel(urls)
  }

  clearCache() {
    this.cache.clear()
  }
}

export const imageLoader = new ImageLoader()
