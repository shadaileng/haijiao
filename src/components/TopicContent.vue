<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import type { Attachment } from '@/types'

const props = defineProps<{
  content: string
  attachments?: Attachment[]
}>()

const contentRef = ref<HTMLDivElement>()

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement
      if (img.dataset.src) {
        img.src = img.dataset.src
        img.dataset.lazy = 'loaded'
        observer.unobserve(img)
      }
    }
  })
})

onMounted(() => {
  nextTick(() => {
    if (!contentRef.value) return
    const imgs = contentRef.value.querySelectorAll('img[data-src]')
    imgs.forEach((img) => {
      observer.observe(img)
    })
  })
})

watch(() => props.content, () => {
  nextTick(() => {
    if (!contentRef.value) return
    const imgs = contentRef.value.querySelectorAll('img[data-src]')
    imgs.forEach((img) => {
      observer.observe(img)
    })
  })
})
</script>

<template>
  <div
    ref="contentRef"
    class="topic-content"
    v-html="content"
  ></div>
</template>

<style scoped>
.topic-content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding: 0 15px;
}
.topic-content :deep(p) { margin: 0; }
.topic-content :deep(img) {
  width: 100%;
  height: auto;
}
</style>
