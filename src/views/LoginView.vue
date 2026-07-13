<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { api } from '@/api/request'

const router = useRouter()
const settings = useSettingsStore()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const customApiBase = ref(settings.apiBase)
const apiBaseEditing = ref(false)

async function handleLogin() {
  if (!username.value.trim()) {
    showToast('请输入邮箱或用户名')
    return
  }
  if (!password.value) {
    showToast('请输入密码')
    return
  }
  // 保存数据源配置
  if (customApiBase.value.trim()) {
    settings.setApiBase(customApiBase.value.trim())
  }
  loading.value = true
  const resp = await api.login({
    username: username.value.trim(),
    password: password.value,
  })
  loading.value = false
  if (!resp.success) {
    showToast(resp.message || '登录失败')
    return
  }
  showSuccessToast('登录成功')
  if (resp.data) {
    userStore.loginFromApi(resp.data)
  }
  router.replace('/hot')
}

function toggleApiBaseEdit() {
  apiBaseEditing.value = !apiBaseEditing.value
  if (!apiBaseEditing.value) {
    customApiBase.value = settings.apiBase
  }
}

function saveApiBase() {
  if (customApiBase.value.trim()) {
    settings.setApiBase(customApiBase.value.trim())
    showToast('数据源已保存')
  }
  apiBaseEditing.value = false
}

function resetApiBase() {
  customApiBase.value = settings.apiBase
  apiBaseEditing.value = false
}

function goToSettings() {
  router.push('/settings')
}
</script>

<template>
  <div class="login-view">
    <van-nav-bar title="海角助手 - 登录" />

    <div class="login-content">
      <div class="logo-area">
        <van-icon name="manager-o" size="64" color="#07c160" />
        <h2>海角助手</h2>
        <p>登录后自动获取认证信息</p>
      </div>

      <van-cell-group inset class="login-form">
        <van-field
          v-model="username"
          label="邮箱"
          placeholder="请输入邮箱或用户名"
          clearable
          left-icon="envelop-o"
          :disabled="loading"
        />
        <van-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="密码"
          placeholder="请输入密码"
          clearable
          left-icon="lock"
          :disabled="loading"
        >
          <template #button>
            <van-icon :name="showPassword ? 'eye-o' : 'closed-eye'" size="20" @click="showPassword = !showPassword" />
          </template>
        </van-field>
        <van-cell-group inset class="api-base-section">
          <van-field
            v-model="customApiBase"
            :readonly="!apiBaseEditing"
            label="数据源"
            placeholder="请输入数据源地址"
            clearable
            left-icon="globe-o"
          >
            <template #button>
              <div class="api-base-actions">
                <van-icon
                  v-if="!apiBaseEditing"
                  name="edit"
                  size="18"
                  color="#1989fa"
                  @click="toggleApiBaseEdit()"
                />
                <template v-else>
                  <van-icon name="check" size="18" color="#07c160" @click="saveApiBase()" />
                  <van-icon name="close" size="18" color="#ee0a24" @click="resetApiBase()" style="margin-left: 8px;" />
                </template>
              </div>
            </template>
          </van-field>
        </van-cell-group>
      </van-cell-group>

      <van-button type="primary" block round class="login-btn" :loading="loading" loading-text="登录中..." @click="handleLogin">
        登录
      </van-button>

      <van-button plain block round class="settings-btn" @click="goToSettings">
        手动配置 UID / Token / 镜像源
      </van-button>

      <div class="tips">
        <p>如已有 UID 和 Token，可跳过登录直接在配置页填写</p>
        <p>当前数据源：{{ settings.apiBase }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  background: #f7f8fa;
}
.login-content {
  padding: 24px 16px;
}
.logo-area {
  text-align: center;
  padding: 32px 0 24px;
}
.logo-area h2 {
  margin: 12px 0 4px;
  font-size: 22px;
  color: #323233;
}
.logo-area p {
  margin: 0;
  font-size: 14px;
  color: #969799;
}
.login-form {
  margin-bottom: 24px;
}
.login-btn {
  margin-bottom: 12px;
}
.settings-btn {
  margin-bottom: 16px;
}
.tips {
  text-align: center;
}
.tips p {
  margin: 0;
  font-size: 12px;
  color: #969799;
}
.api-base-section {
  margin-bottom: 16px;
}
.api-base-actions {
  display: flex;
  align-items: center;
}
</style>
