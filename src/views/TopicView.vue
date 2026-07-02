<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getTopic, getTopicAttachments, processImages } from '@/utils/request'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const store = useUserStore()

const pid = ref('')
const loading = ref(false)
const topicData = ref<any>(null)
const attachments = ref<any[]>([])
const contentHtml = ref('')

const topicIds = ref<string[]>(store.topicIds)

onMounted(() => {
  const routePid = route.params.pid as string
  if (routePid) {
    pid.value = routePid
    loadTopic(routePid)
  } else if (topicIds.value.length > 0) {
    pid.value = topicIds.value[0]
    loadTopic(topicIds.value[0])
  }
})

watch(pid, (newPid) => {
  if (newPid) {
    loadTopic(newPid)
  }
})

async function loadTopic(topicPid: string) {
  loading.value = true
  try {
    // Check cache first
    if (store.topicCache[topicPid]) {
      topicData.value = store.topicCache[topicPid]
      contentHtml.value = topicData.value.content || ''
      await loadAttachments(topicPid)
      return
    }

    const data = await getTopic(topicPid)
    if (!data) {
      Toast('获取帖子失败')
      return
    }

    topicData.value = data
    contentHtml.value = data.content || ''
    store.cacheTopic(topicPid, data)
    if (!topicIds.value.includes(topicPid)) {
      topicIds.value.unshift(topicPid)
    }

    await loadAttachments(topicPid)
  } catch (error: any) {
    Toast(error.message || '加载失败')
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
    Toast('没有图片资源')
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
    Toast.success('已复制')
  })
}
</script>

<template>
  <div class="topic-page">
    <van-nav-bar title="海角助手" left-arrow @click-left="router.back()" />

    <van-pull-refresh v-model="loading" @refresh="() => loadTopic(pid)">
      <!-- Search PID -->
      <van-cell-group inset class="search-section">
        <van-field
          v-model="pid"
          placeholder="输入帖子ID"
          :readonly="false"
          clearable
        >
          <template #button>
            <van-button type="primary" size="small" :loading="loading" @click="loadTopic(pid)">
              查找
            </van-button>
          </template>
        </van-field>

        <van-button
          type="primary"
          block
          round
          :disabled="!pid || loading"
          @click="loadTopic(pid)"
          class="search-btn"
        >
          查找帖子
        </van-button>

        <van-button
          type="success"
          block
          round
          :disabled="attachments.length === 0"
          @click="openImages"
          class="search-btn"
          style="margin-top: 8px;"
        >
          查看所有图片
        </van-button>
      </van-cell-group>

      <!-- Topic Content -->
      <div v-if="topicData" class="topic-content" inset>
        <van-card
          :title="topicData.title || '无标题'"
          :desc="topicData.desc || ''"
          :price="'ID: ' + topicData.topicId"
        >
          <template #thumb>
            <van-icon name="question-o" size="30" color="#999" />
          </template>
          <template #footer>
            <div class="card-footer">
              <span v-if="topicData.user?.nickname" @click="copyText(topicData.user.id || topicData.user.nickname)">
                {{ topicData.user.nickname }}
              </span>
              <span v-if="topicData.create_time">{{ topicData.create_time }}</span>
            </div>
          </template>
        </van-card>

        <!-- Topic Body -->
        <div v-if="contentHtml" class="topic-body" v-html="contentHtml"></div>

        <!-- Attachments -->
        <div v-if="attachments.length > 0" class="attachments-section">
          <van-divider content-position="left">附件资源 ({{ attachments.length }})</van-divider>
          <van-cell-group inset>
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
      </div>

      <van-empty v-else-if="!loading" description="输入帖子ID开始查找" />
    </van-pull-refresh>
  </div>
</template>

<style scoped>
.topic-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.search-section {
  margin: 12px;
}

.search-btn {
  margin: 8px 12px;
}

.topic-content {
  margin: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.card-footer span {
  cursor: pointer;
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

.attachments-section {
  margin: 12px;
}
</style>
