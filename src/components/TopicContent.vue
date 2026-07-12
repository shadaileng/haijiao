<template>
  <div
    class="content"
    v-content="{
      topicId,
      content,
      attachments,
      handleClick,
    }"
  ></div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Attachment } from '@/types'

defineProps({
  topicId: { type: [String, Number], default: 0 },
  content: { type: String, default: '' },
  attachments: { type: Array<Attachment>, default: () => [] },
})

const handleClick = inject('overlay') as (data: any) => void
</script>

<style scoped>
.content {
  overflow: auto;
  text-align: left;
  font-size: 1.2rem;
  padding: 0 15px;
}
.content p {
  margin: 0;
}
.content img {
  width: 100%;
  height: auto;
}
</style>
