<script setup lang="ts">
import type { Attachment } from '@/types'

defineProps<{
  content: string
  attachments?: Attachment[]
}>()

const handleClick = (params: any) => {
  console.log('handleClick:', params)
}
</script>

<template>
  <div
    class="topic-content"
    v-content="{
      content,
      attachments,
      handleClick,
    }"
  ></div>
</template>

<style scoped>
.topic-content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding: 0 15px;
}
.topic-content :deep(p) {
  margin: 0;
}
.topic-content :deep(img) {
  width: 100%;
  height: auto;
}
</style>
