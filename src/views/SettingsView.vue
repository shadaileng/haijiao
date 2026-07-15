<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useMirrorConfig } from '@/composables/useMirrorConfig'
import { showSuccessToast, showDialog as showConfirmDialog, showToast } from 'vant'
import UserInfo from '@/components/UserInfo.vue'
import { useClipboard } from '@/composables/useClipboard'

const router = useRouter()
const settings = useSettingsStore()
const userStore = useUserStore()
const { showDialog, mirrorUrl, mirrorDisplay, openConfig, saveConfig } = useMirrorConfig()
const { copy } = useClipboard()

const currentUser = ref<any>(null)
const loadingUser = ref(settings.isLoggedIn)

onMounted(async () => {
  if (settings.isLoggedIn) {
    await loadCurrentUser()
    loadingUser.value = false
  }
})

const loadCurrentUser = async () => {
  const data = await userStore.fetchCurrent()
  if (data) currentUser.value = data
}

function handleLogout() {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
  })
    .then(() => {
      userStore.logout()
      currentUser.value = null
      showSuccessToast('已退出')
    })
    .catch(() => {})
}

async function handleCopyCredentials() {
  if (!settings.isLoggedIn) return
  const text = JSON.stringify({ uid: settings.uid, token: settings.token })
  const ok = await copy(text)
  if (ok) showSuccessToast('Token 已复制')
  else showToast('复制失败')
}

async function handlePasteCredentials() {
  try {
    const text = await navigator.clipboard.readText()
    const data = JSON.parse(text)
    if (data.uid && data.token) {
      settings.setCredentials(data.uid, data.token)
      showSuccessToast('Token 已粘贴')
    } else {
      showToast('剪贴板内容格式无效')
    }
  } catch {
    showToast('读取剪贴板失败或格式无效')
  }
}
</script>

<template>
  <div class="settings-view">
    <van-nav-bar title="配置" left-arrow @click-left="router.back()" />

    <van-skeleton title avatar :row="3" :loading="loadingUser">
      <UserInfo v-if="currentUser" :userInfo="currentUser" />
    </van-skeleton>

    <van-cell-group inset class="status-group">
      <van-cell title="登录状态" :value="settings.isLoggedIn ? '已登录' : '未登录'">
        <template #label v-if="settings.isLoggedIn">UID: {{ settings.uid }}</template>
        <template #label v-else><span>请在下方填写 UID 和 Token，或前往登录</span></template>
      </van-cell>
      <van-cell v-if="settings.isLoggedIn" title="退出登录" is-link @click="handleLogout">
        <template #right-icon><van-icon name="warning-o" color="#ee0a24" /></template>
      </van-cell>
      <van-cell v-else title="去登录" is-link @click="router.push('/login')">
        <template #right-icon><van-icon name="arrow" /></template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset class="setting-group">
      <van-cell title="认证配置" />
      <van-field :model-value="settings.uid" label="UID" readonly />
      <van-field :model-value="settings.token" label="Token" type="password" readonly />
      <van-cell>
        <template #title>
          <div class="flex gap-3">
            <van-button size="small" type="primary" :disabled="!settings.isLoggedIn" @click="handleCopyCredentials">复制 Token</van-button>
            <van-button size="small" @click="handlePasteCredentials">粘贴 Token</van-button>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset class="mirror-group">
      <van-cell title="镜像源（数据源地址）" :value="mirrorDisplay()" is-link @click="openConfig" />
    </van-cell-group>

    <van-cell-group inset class="info-group">
      <van-cell title="数据来源">
        <template #label>
          <div>{{ settings.apiBase }}</div>
          <div class="source-hint">官方域名国内被屏蔽，请填写后台提供的可用镜像地址</div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-dialog v-model:show="showDialog" title="配置镜像源" @confirm="saveConfig" show-cancel-button>
      <van-field v-model="mirrorUrl" placeholder="https://你的镜像域名" clearable label="地址" label-width="60px" />
    </van-dialog>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  background: #f7f8fa;
}
.status-group {
  margin: 12px;
}
.setting-group {
  margin: 12px;
}
.mirror-group {
  margin: 12px;
}
.source-hint {
  margin-top: 4px;
  color: #ee0a24;
  font-size: 12px;
}
.info-group {
  margin: 12px;
}
</style>
