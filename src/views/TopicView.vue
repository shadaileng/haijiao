<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getTopic, getTopicAttachments } from '@/api/request'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const pid = ref('')
const loading = ref(false)
const topicData = ref<any>(null)
const attachments = ref<any[]>([])
const contentHtml = ref('')

const defaultPid = computed(() => route.params.pid as string || '')

onMounted(() => {
  const routePid = route.params.pid as string
  if (routePid) {
    pid.value = routePid
    loadTopic(routePid)
  } else if (store.topicIds.length > 0) {
    pid.value = store.topicIds[0]
    loadTopic(store.topicIds[0])
  }
})

watch(pid, (newPid) => {
  if (newPid) {
    loadTopic(newPid)
  }
})

async function loadTopic(topicPid: string) {
  if (!topicPid) return
  loading.value = true
  try {
    if (store.topicCache[topicPid]) {
      topicData.value = store.topicCache[topicPid]
      contentHtml.value = topicData.value.content || ''
      await loadAttachments(topicPid)
      return
    }

    const data = await getTopic(topicPid)
    if (!data) {
      showToast('获取帖子失败')
      return
    }

    topicData.value = data
    contentHtml.value = data.content || ''
    store.cacheTopic(topicPid, data)
    if (!store.topicIds.includes(topicPid)) {
      store.topicIds.unshift(topicPid)
    }

    await loadAttachments(topicPid)
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

async function loadAttachments(topicPid: string) {
  try {
    const atts = await getTopicAttachments(topicPid)
    attachments.value = atts.filter((a: any) => a.category === 'images' || a.category === 'video')
  } catch (error: any) {
    console.error('load attachments error:', error)
    attachments.value = []
  }
}

function openImages() {
  const imageItems = attachments.value.filter((a: any) => a.category === 'images')
  if (imageItems.length === 0) {
    showToast('没有图片资源')
    return
  }
  router.push({ path: '/images', query: { items: JSON.stringify(imageItems) } })
}

function openAttachment(item: any) {
  if (item.category === 'images') {
    router.push({ path: '/image-viewer', query: { url: item.remoteUrl } })
  } else if (item.category === 'video') {
    const videoUrl = item.play_info?.cdn_url || item.video_url || item.url
    if (videoUrl) {
      window.open(videoUrl, '_blank')
    }
  } else {
    if (item.remoteUrl) {
      window.open(item.remoteUrl, '_blank')
    }
  }
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccessToast('已复制')
  })
}
</script>

<template>
  <div class="topic-view">
    <van-nav-bar title="帖子详情" left-arrow @click-left="router.back()" />

    <van-search
      v-model="pid"
      placeholder="输入帖子ID"
      shape="round"
      @search="loadTopic(pid)"
      class="search-bar"
    />

    <van-button
      type="primary"
      block
      round
      :loading="loading"
      @click="loadTopic(pid)"
      class="search-btn"
    >
      查找帖子
    </van-button>

    <van-button
      v-if="attachments.length > 0"
      type="success"
      block
      round
      @click="openImages"
      class="open-images-btn"
    >
      查看所有图片 ({{ attachments.filter((a: any) => a.category === 'images').length }})
    </van-button>

    <div v-if="topicData" class="topic-detail">
      <van-cell-group inset>
        <van-cell :title="topicData.title || '无标题'" />
        <van-cell label="ID: " :value="topicData.topicId || topicData.id" />
        <van-cell label="用户: " :value="topicData.user?.nickname || '未知'" />
        <van-cell label="时间: " :value="topicData.create_time || topicData.createTime || ''" />
      </van-cell-group>

      <div v-if="contentHtml" class="topic-body" v-html="contentHtml"></div>

      <van-cell-group v-if="attachments.length > 0" inset class="attachments-group">
        <van-cell title="附件资源" :label="`${attachments.length} 个文件`" />
        <van-cell
          v-for="item in attachments"
          :key="item.id"
          :title="item.name || '附件'"
          :label="item.category"
          is-link
          @click="openAttachment(item)"
        >
          <template #icon>
            <van-icon
              :name="item.category === 'images' ? 'photo-o' : item.category === 'video' ? 'play-o' : 'download-o'"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-empty v-else-if="!loading" description="输入帖子ID开始查找" />
  </div>
</template>

<style scoped>
.topic-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.search-bar {
  margin: 12px;
  background: #f7f8fa;
}

.search-btn {
  margin: 8px 12px;
}

.open-images-btn {
  margin: 12px;
}

.topic-detail {
  margin-top: 12px;
}

.topic-body {
  margin: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  word-wrap: break-word;
  word-break: break-all;
}

.topic-body img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.attachments-group {
  margin: 12px;
}
</style>
