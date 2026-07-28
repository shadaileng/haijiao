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
      nodeId: String(item.tagId || item.nodeId),
      name: item.tagName || item.name,
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
  <van-nav-bar title="板块" left-arrow @click-left="router.back()" />
  <van-loading v-if="loading" class="node-loading" size="24px" vertical>加载中...</van-loading>
  <van-empty v-else-if="nodes.length === 0" description="暂无板块数据" />
  <div v-else class="node-grid">
    <div
      v-for="node in nodes"
      :key="node.nodeId"
      class="node-card"
      @click="goToNode(node.nodeId)"
    >
      <van-icon v-if="node.icon" :name="node.icon" class="node-icon" />
      <van-icon v-else name="label-o" class="node-icon" />
      <span class="node-name">{{ node.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.node-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.node-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 12px;
}
.node-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}
.node-card:active {
  transform: scale(0.96);
}
.node-icon {
  font-size: 28px;
  color: #07c160;
  margin-bottom: 8px;
}
.node-name {
  font-size: 13px;
  color: #333;
  text-align: center;
  word-break: break-all;
}
</style>
