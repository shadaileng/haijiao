<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useProxyConfig } from '@/composables/useProxyConfig'
import { showToast, showSuccessToast, showDialog as showConfirmDialog } from 'vant'

const router = useRouter()
const store = useUserStore()
const { showDialog: proxyDialog, proxyUrl, proxyDisplay, openConfig, saveConfig } = useProxyConfig()

const uid = ref(store.uid || '')
const token = ref(store.token || '')

onMounted(() => {
  uid.value = store.uid
  token.value = store.token
})

const sourceUrl = computed(() => {
  if (store.proxyBase && store.proxyBase.startsWith('http')) {
    return store.proxyBase
  }
  return 'https://haijiao.com'
})

function save() {
  if (!uid.value) {
    showToast('UID不能为空')
    return
  }
  if (!token.value) {
    showToast('Token不能为空')
    return
  }
  store.setCredentials(uid.value, token.value)
  showSuccessToast('保存成功')
  router.back()
}

function clear() {
  uid.value = ''
  token.value = ''
  store.setCredentials('', '')
  showSuccessToast('已清除')
}

function viewSource() {
  window.open(sourceUrl.value, '_blank')
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
    showSuccessToast('已退出')
  }).catch(() => {})
}
</script>

<template>
  <div class="settings-view">
    <van-nav-bar title="设置" left-arrow @click-left="router.back()" />

    <van-cell-group v-if="store.isLoggedIn" inset class="status-group">
      <van-cell title="登录状态" value="已登录" is-link>
        <template #label>
          <div class="login-info">
            <p v-if="store.nickname">昵称: {{ store.nickname }}</p>
            <p>UID: {{ store.uid }}</p>
          </div>
        </template>
      </van-cell>
      <van-cell title="退出登录" is-link @click="handleLogout">
        <template #right-icon>
          <van-icon name="warning-o" color="#ee0a24" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group v-else inset class="status-group">
      <van-cell title="登录状态" value="未登录" is-link @click="router.push('/login')">
        <template #label>
          <span>点击前往登录</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset class="setting-group">
      <van-cell title="高级配置" label="手动设置 UID 和 Token" />
      <van-field v-model="uid" label="UID" placeholder="输入用户ID" clearable />
      <van-field v-model="token" label="Token" placeholder="输入登录Token" type="password" clearable />
    </van-cell-group>

    <van-cell-group inset class="proxy-group">
      <van-cell
        title="代理地址"
        :value="proxyDisplay"
        is-link
        @click="openConfig"
      />
    </van-cell-group>

    <van-button type="primary" block round class="save-btn" @click="save">
      保存
    </van-button>

    <van-button type="warning" block round class="clear-btn" @click="clear">
      清除
    </van-button>

    <van-cell-group inset class="info-group">
      <van-cell title="数据来源" :label="sourceUrl" is-link @click="viewSource" />
      <van-cell title="使用说明">
        <template #label>
          <div class="tips-text">
            <p>1. 推荐使用登录功能自动获取认证信息</p>
            <p>2. 也可在下方手动填写 UID、Token</p>
            <p>3. 在"关注"页面查看关注列表</p>
            <p>4. 在"首页"输入帖子ID查看帖子详情</p>
            <p>5. 在"搜索"页面搜索帖子</p>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-dialog v-model:show="proxyDialog" title="配置代理地址" @confirm="saveConfig" show-cancel-button>
      <van-field
        v-model="proxyUrl"
        placeholder="留空使用默认 /api"
        clearable
        label="地址"
        label-width="50px"
      />
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

.login-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

.setting-group {
  margin: 12px;
}

.proxy-group {
  margin: 12px;
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

.tips-text {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.tips-text p {
  margin: 4px 0;
}
</style>
