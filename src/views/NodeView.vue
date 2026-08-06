<script setup lang="ts">
defineOptions({ name: 'NodeView' })
import { ref, reactive, onMounted, onActivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/request'
import type { Node } from '@/types'

const router = useRouter()
const loading = ref(true)
const nodes = reactive<Node[]>([])

let savedScrollY = 0

function captureScroll() { savedScrollY = window.scrollY }

onMounted(async () => {
  window.addEventListener('scroll', captureScroll, { capture: true, passive: true })
  const result = await api.nodes()
  if (result.success && result.data) {
    const list = Array.isArray(result.data)
      ? result.data
      : (result.data.list || result.data.results || [])
    nodes.splice(0, nodes.length, ...list.map((item: any) => ({
      nodeId: String(item.nodeId),
      name: item.name,
      icon: item.icon || '',
    })))
  }
  loading.value = false
})

const goToNode = (nodeId: string) => {
  sessionStorage.setItem('scrollPos_Node', String(savedScrollY))
  router.push(`/node/${nodeId}`)
}

onActivated(() => {
  window.addEventListener('scroll', captureScroll, { capture: true, passive: true })
  const saved = Number(sessionStorage.getItem('scrollPos_Node') || '0')
  sessionStorage.removeItem('scrollPos_Node')
  nextTick(() => {
    if (saved > 0) window.scrollTo(0, saved)
  })
})
</script>

<template>
  <div class="node-container">
    <div class="node-header-sticky">
      <van-nav-bar title="板块" />
    </div>
    <van-skeleton title avatar :row="3" :loading="loading">
      <van-empty v-if="nodes.length === 0" description="暂无板块数据" />
      <van-grid v-else :column-num="3" :border="false" :gutter="10" class="node-grid">
        <van-grid-item
          v-for="node in nodes"
          :key="node.nodeId"
          :text="node.name"
          @click="goToNode(node.nodeId)"
        >
          <template #icon>
            <van-image
              v-if="node.icon"
              width="2.5rem"
              height="2.5rem"
              fit="contain"
              :src="node.icon"
            />
            <van-icon v-else name="apps-o" size="2rem" color="#969799" />
          </template>
        </van-grid-item>
      </van-grid>
    </van-skeleton>
  </div>
</template>

<style scoped>
.node-container {}
.node-header-sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}
.node-grid {
  padding: 12px 0;
}
</style>
