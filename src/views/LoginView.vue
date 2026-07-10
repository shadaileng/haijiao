<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/request'
import { useProxyConfig } from '@/composables/useProxyConfig'
import { Toast } from 'vant'

const router = useRouter()
const store = useUserStore()
const { showDialog, proxyUrl, proxyDisplay, openConfig, saveConfig } = useProxyConfig()

const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  if (!username.value.trim()) {
    Toast('请输入邮箱或用户名')
    return
  }
  if (!password.value) {
    Toast('请输入密码')
    return
  }

  loading.value = true
  try {
    const data = await login({
      username: username.value.trim(),
      password: password.value,
    })
    store.loginFromApi(data)
    Toast.success('登录成功')
    router.replace('/')
  } catch (e: any) {
    Toast(e.message || '登录失败')
  } finally {
    loading.value = false
  }
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
            <van-icon
              :name="showPassword ? 'eye-o' : 'closed-eye'"
              size="20"
              @click="showPassword = !showPassword"
            />
          </template>
        </van-field>
      </van-cell-group>

      <van-button
        type="primary"
        block
        round
        class="login-btn"
        :loading="loading"
        loading-text="登录中..."
        @click="handleLogin"
      >
        登录
      </van-button>

      <van-button
        plain
        block
        round
        class="settings-btn"
        @click="goToSettings"
      >
        手动配置 UID / Token
      </van-button>

      <van-cell
        title="代理地址"
        :value="proxyDisplay"
        is-link
        class="proxy-cell"
        @click="openConfig"
      />

      <div class="tips">
        <p>如已有 UID 和 Token，可跳过登录直接手动配置</p>
      </div>
    </div>

    <van-dialog v-model:show="showDialog" title="配置代理地址" @confirm="saveConfig" show-cancel-button>
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
</style>
