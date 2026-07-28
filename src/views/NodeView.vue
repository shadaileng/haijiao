<script setup lang="ts">
defineOptions({ name: 'NodeView' })
import { ref, reactive, onMounted, onDeactivated, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/request'
import type { Node } from '@/types'

const router = useRouter()
const loading = ref(true)
const nodes = reactive<Node[]>([])
const scrollRef = ref<HTMLElement | null>(null)

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

onActivated(() => {
  const el = scrollRef.value
  if (el) {
    const saved = sessionStorage.getItem('scrollPos_Node')
    if (saved) {
      el.scrollTop = parseInt(saved)
      sessionStorage.removeItem('scrollPos_Node')
    }
  }
})

onDeactivated(() => {
  const el = scrollRef.value
  if (el) {
    sessionStorage.setItem('scrollPos_Node', String(el.scrollTop))
  }
})
</script>

<template>
  <van-nav-bar title="板块" />
  <van-skeleton title avatar :row="3" :loading="loading">
    <van-empty v-if="nodes.length === 0" description="暂无板块数据" />
    <div v-else ref="scrollRef" class="node-scroll">
      <van-grid :column-num="3" :border="false" :gutter="10" class="node-grid">
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
    </div>
  </van-skeleton>
</template>

<style scoped>
.node-scroll {
  height: calc(100vh - 46px - 50px);
  overflow-y: auto;
}
.node-grid {
  padding: 12px 0;
}
</style>
