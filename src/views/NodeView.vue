<script setup lang="ts">
defineOptions({ name: 'NodeView' })
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/request'
import type { Node } from '@/types'

const router = useRouter()
const loading = ref(true)
const nodes = reactive<Node[]>([])

onMounted(async () => {
  const result = await api.nodes()
  if (result.success && result.data) {
    const list = Array.isArray(result.data) ? result.data : (result.data.results || [])
    nodes.splice(0, nodes.length, ...list.map((item: any) => ({
      nodeId: String(item.nodeId || item.id),
      name: item.nodeName || item.name || item.tagName,
      icon: item.icon || '',
    })))
  }
  loading.value = false
})

const goToNode = (nodeId: string) => {
  router.push(`/node/${nodeId}`)
}
</script>

<template>
  <van-skeleton title avatar :row="3" :loading="loading">
    <van-empty v-if="nodes.length === 0" description="暂无板块数据" />
    <van-grid v-else :column-num="3" :border="false" :gutter="10" class="node-grid">
      <van-grid-item
        v-for="node in nodes"
        :key="node.nodeId"
        :text="node.name"
        @click="goToNode(node.nodeId)"
      />
    </van-grid>
  </van-skeleton>
</template>

<style scoped>
.node-grid {
  padding: 12px;
}
</style>
