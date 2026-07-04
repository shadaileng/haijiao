<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Toast } from 'vant'

const router = useRouter()
const store = useUserStore()

const uid = ref(store.uid || '')
const token = ref(store.token || '')
const apiBase = ref(store.apiBase || 'haijiao.com')

onMounted(() => {
  uid.value = store.uid
  token.value = store.token
  apiBase.value = store.apiBase
})

function save() {
  if (!uid.value) {
    Toast('UID不能为空')
    return
  }
  if (!token.value) {
    Toast('Token不能为空')
    return
  }
  if (!apiBase.value) {
    Toast('数据源不能为空')
    return
  }
  store.setCredentials(uid.value, token.value)
  store.setApiBase(apiBase.value)
  Toast.success('保存成功')
  router.back()
}

function clear() {
  uid.value = ''
  token.value = ''
  apiBase.value = 'haijiao.com'
  store.setCredentials('', '')
  store.setApiBase('haijiao.com')
  Toast.success('已清除')
}

function viewSource() {
  window.open(`https://${apiBase.value}`, '_blank')
}
</script>

<template>
  <div class="settings-view">
    <van-nav-bar title="设置" left-arrow @click-left="router.back()" />

    <van-cell-group inset class="setting-group">
      <van-field v-model="uid" label="UID" placeholder="输入用户ID" clearable />
      <van-field v-model="token" label="Token" placeholder="输入登录Token" type="password" clearable />
      <van-field v-model="apiBase" label="数据源" placeholder="例如: haijiao.com" clearable />
    </van-cell-group>

    <van-button type="primary" block round class="save-btn" @click="save">
      保存
    </van-button>

    <van-button type="warning" block round class="clear-btn" @click="clear">
      清除
    </van-button>

    <van-cell-group inset class="info-group">
      <van-cell title="数据来源" :label="apiBase" is-link @click="viewSource" />
      <van-cell title="使用说明">
        <template #label>
          <div class="tips-text">
            <p>1. 在设置中填写UID、Token和数据源</p>
            <p>2. 在"关注"页面查看关注列表</p>
            <p>3. 在"首页"输入帖子ID查看帖子详情</p>
            <p>4. 在"搜索"页面搜索帖子</p>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>
.settings-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.setting-group {
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
