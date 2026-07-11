<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useProxyConfig } from '@/composables/useProxyConfig'
import { request } from '@/api/request'
import { showToast, showSuccessToast, showDialog as showConfirmDialog } from 'vant'
import UserInfo from '@/components/UserInfo.vue'

const router = useRouter()
const store = useUserStore()
const { showDialog: proxyDialog, proxyUrl, proxyDisplay, openConfig, saveConfig } = useProxyConfig()

const uid = ref(store.uid || '')
const token = ref(store.token || '')
const currentUser = ref<any>(null)

onMounted(async () => {
  uid.value = store.uid
  token.value = store.token
  if (store.isLoggedIn) {
    await loadCurrentUser()
  }
})

const loadCurrentUser = async () => {
  try {
    const data = await request({
      url: '/user/current',
      params: { date: Date.now() },
      headers: { 'X-User-Id': store.uid, 'X-User-Token': store.token },
    })
    if (data) {
      currentUser.value = data.user || data
    }
  } catch {
    // ignore
  }
}

const sourceUrl = computed(() => {
  if (store.proxyBase && store.proxyBase.startsWith('http')) {
    return store.proxyBase
  }
  return 'https://haijiao.com'
})

function save() {
  if (!uid.value) { showToast('UID不能为空'); return }
  if (!token.value) { showToast('Token不能为空'); return }
  store.setCredentials(uid.value, token.value)
  showSuccessToast('保存成功')
  loadCurrentUser()
}

function clear() {
  uid.value = ''
  token.value = ''
  store.setCredentials('', '')
  showSuccessToast('已清除')
}

function handleLogout() {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
  }).then(() => {
    store.logout()
    uid.value = ''
    token.value = ''
    currentUser.value = null
    showSuccessToast('已退出')
  }).catch(() => {})
}
</script>

<template>
  <div class="settings-view">
    <van-nav-bar title="配置" left-arrow @click-left="router.back()" />

    <UserInfo v-if="currentUser" :userInfo="currentUser" />

    <van-cell-group inset class="status-group">
      <van-cell title="登录状态" :value="store.isLoggedIn ? '已登录' : '未登录'" is-link>
        <template #label v-if="store.isLoggedIn">
          UID: {{ store.uid }}
        </template>
        <template #label v-else>
          <span>请在下方填写UID和Token</span>
        </template>
      </van-cell>
      <van-cell v-if="store.isLoggedIn" title="退出登录" is-link @click="handleLogout">
        <template #right-icon>
          <van-icon name="warning-o" color="#ee0a24" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset class="setting-group">
      <van-cell title="认证配置" />
      <van-field v-model="uid" label="UID" placeholder="请输入UID" clearable />
      <van-field v-model="token" label="Token" placeholder="请输入Token" type="password" clearable />
    </van-cell-group>

    <van-cell-group inset class="proxy-group">
      <van-cell title="代理地址" :value="proxyDisplay" is-link @click="openConfig" />
    </van-cell-group>

    <van-button type="primary" block round class="save-btn" @click="save">保存</van-button>
    <van-button type="warning" block round class="clear-btn" @click="clear">清除</van-button>

    <van-cell-group inset class="info-group">
      <van-cell title="数据来源">
        <template #label>{{ sourceUrl }}</template>
      </van-cell>
    </van-cell-group>

    <van-dialog v-model:show="proxyDialog" title="配置代理地址" @confirm="saveConfig" show-cancel-button>
      <van-field v-model="proxyUrl" placeholder="留空使用默认 /api" clearable label="地址" label-width="50px" />
    </van-dialog>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  background: #f7f8fa;
}
.status-group { margin: 12px; }
.setting-group { margin: 12px; }
.proxy-group { margin: 12px; }
.save-btn { margin: 16px 12px; }
.clear-btn { margin: 0 12px 16px; }
.info-group { margin: 12px; }
</style>
