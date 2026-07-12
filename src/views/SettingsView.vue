<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useMirrorConfig } from '@/composables/useMirrorConfig'
import { showToast, showSuccessToast, showDialog as showConfirmDialog } from 'vant'
import UserInfo from '@/components/UserInfo.vue'

const router = useRouter()
const settings = useSettingsStore()
const userStore = useUserStore()
const { showDialog, mirrorUrl, mirrorDisplay, openConfig, saveConfig } = useMirrorConfig()

const uid = ref(settings.uid || '')
const token = ref(settings.token || '')
const currentUser = ref<any>(userStore.current)

onMounted(async () => {
  uid.value = settings.uid
  token.value = settings.token
  if (settings.isLoggedIn) {
    await loadCurrentUser()
  }
})

const loadCurrentUser = async () => {
  const data = await userStore.fetchCurrent()
  if (data) currentUser.value = data
}

function save() {
  if (!uid.value) {
    showToast('UID不能为空')
    return
  }
  if (!token.value) {
    showToast('Token不能为空')
    return
  }
  settings.setCredentials(uid.value, token.value)
  showSuccessToast('保存成功')
  loadCurrentUser()
}

function clear() {
  uid.value = ''
  token.value = ''
  settings.logout()
  currentUser.value = null
  showSuccessToast('已清除')
}

function handleLogout() {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
  })
    .then(() => {
      settings.logout()
      userStore.current = null
      currentUser.value = null
      uid.value = ''
      token.value = ''
      showSuccessToast('已退出')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="settings-view">
    <van-nav-bar title="配置" left-arrow @click-left="router.back()" />

    <UserInfo v-if="currentUser" :userInfo="currentUser" />

    <van-cell-group inset class="status-group">
      <van-cell title="登录状态" :value="settings.isLoggedIn ? '已登录' : '未登录'">
        <template #label v-if="settings.isLoggedIn">UID: {{ settings.uid }}</template>
        <template #label v-else><span>请在下方填写 UID 和 Token</span></template>
      </van-cell>
      <van-cell v-if="settings.isLoggedIn" title="退出登录" is-link @click="handleLogout">
        <template #right-icon><van-icon name="warning-o" color="#ee0a24" /></template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset class="setting-group">
      <van-cell title="认证配置" />
      <van-field v-model="uid" label="UID" placeholder="请输入UID" clearable />
      <van-field v-model="token" label="Token" placeholder="请输入Token" type="password" clearable />
    </van-cell-group>

    <van-cell-group inset class="mirror-group">
      <van-cell title="镜像源（数据源地址）" :value="mirrorDisplay()" is-link @click="openConfig" />
    </van-cell-group>

    <van-button type="primary" block round class="save-btn" @click="save">保存</van-button>
    <van-button type="warning" block round class="clear-btn" @click="clear">清除</van-button>

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
.save-btn {
  margin: 16px 12px;
}
.clear-btn {
  margin: 0 12px 16px;
}
.info-group {
  margin: 12px;
}
</style>
