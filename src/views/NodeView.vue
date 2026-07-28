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
  router.push(`/node/${nodeId}`)
}
</script>

<template>
  <van-nav-bar title="板块" />
  <van-skeleton title avatar :row="3" :loading="loading">
    <van-empty v-if="nodes.length === 0" description="暂无板块数据" />
    <div v-else class="node-list">
      <div
        v-for="node in nodes"
        :key="node.nodeId"
        class="node-item"
        @click="goToNode(node.nodeId)"
      >
        <van-image
          v-if="node.icon"
          width="2rem"
          height="2rem"
          fit="contain"
          :src="node.icon"
          class="node-icon"
        />
        <van-icon v-else name="apps-o" size="1.5rem" color="#969799" class="node-icon" />
        <span class="node-name">{{ node.name }}</span>
        <van-icon name="arrow" size="0.8rem" color="#c8c9cc" />
      </div>
    </div>
  </van-skeleton>
</template>

<style scoped>
.node-list {
  padding: 0 12px;
}
.node-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.node-item:active {
  background: #f8f8f8;
}
.node-icon {
  margin-right: 12px;
  flex-shrink: 0;
}
.node-name {
  flex: 1;
  font-size: 14px;
  color: #323233;
}
</style>
