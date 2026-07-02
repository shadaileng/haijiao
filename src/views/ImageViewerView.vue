<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()

const imageUrl = ref('')
const loading = ref(true)

onMounted(() => {
  const url = route.query.url as string
  if (url) {
    imageUrl.value = url
  } else {
    Toast('没有图片URL')
    router.back()
  }
})

function downloadImage() {
  if (!imageUrl.value) return
  const a = document.createElement('a')
  a.href = imageUrl.value
  a.download = 'image.jpg'
  a.target = '_blank'
  a.click()
}
</script>

<template>
  <div class="image-viewer-page">
    <van-nav-bar title="图片查看" left-arrow @click-left="router.back()" />

    <div class="image-container">
      <van-loading v-if="loading" size="24px" vertical>加载中...</van-loading>
      <img
        v-else
        :src="imageUrl"
        alt="image"
        class="viewer-image"
        @load="loading = false"
      />
    </div>
  </div>
</template>

<style scoped>
.image-viewer-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.viewer-image {
  max-width: 100%;
  max-height: calc(100vh - 80px);
  object-fit: contain;
  border-radius: 4px;
}
</style>
