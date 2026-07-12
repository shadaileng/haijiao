<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchImageThroughProxy } from '@/utils/image'

const route = useRoute()
const imgUrl = ref('')

onMounted(async () => {
  const url = (route.query.url as string) || ''
  if (!url) return
  const dataUri = await fetchImageThroughProxy(url)
  if (dataUri) imgUrl.value = dataUri
})

const onClickLeft = () => history.back()
</script>

<template>
  <van-nav-bar title="图片查看" left-text="返回" left-arrow @click-left="onClickLeft" :fixed="true" :placeholder="true" />
  <div class="image-viewer">
    <img v-if="imgUrl" :src="imgUrl" class="hv-img-view" />
    <van-empty v-else description="无图片" />
  </div>
</template>

<style scoped>
.image-viewer {
  padding: 10px;
  text-align: center;
}
.hv-img-view {
  width: 100%;
  height: auto;
}
</style>
