<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Toast } from 'vant'

const router = useRouter()
const store = useUserStore()

const uid = ref(store.uid || '')
const token = ref(store.token || '')

function save() {
  if (!uid.value || !token.value) {
    Toast('UID和Token不能为空')
    return
  }
  store.setCredentials(uid.value, token.value)
  Toast.success('保存成功')
  router.back()
}

function clear() {
  uid.value = ''
  token.value = ''
  store.setCredentials('', '')
  Toast.success('已清除')
}

function viewSource() {
  window.open('https://haijiao.com', '_blank')
}
</script>

<template>
  <div class="settings-page">
    <van-nav-bar title="设置" left-arrow @click-left="router.back()" />

    <van-cell-group inset class="setting-group">
      <van-cell title="UID" :value="uid" is-link @click="uid = prompt('请输入UID') || ''" />
      <van-cell title="Token" :value="token ? '******' : ''" is-link @click="token = prompt('请输入Token') || ''" />
    </van-cell-group>

    <van-button
      type="primary"
      block
      round
      class="save-btn"
      @click="save"
    >
      保存凭证
    </van-button>

    <van-button
      type="warning"
      block
      round
      class="clear-btn"
      @click="clear"
    >
      清除凭证
    </van-button>

    <van-cell-group inset class="setting-group">
      <van-cell title="数据来源" label="haijiao.com" is-link @click="viewSource" />
    </van-cell-group>

    <van-cell-group inset class="setting-group">
      <van-cell title="使用说明">
        <template #label>
          <div class="tips-text">
            <p>1. 先在设置中填写UID和Token</p>
            <p>2. 在"用户"页面查看关注列表</p>
            <p>3. 在"首页"输入帖子ID查看帖子详情</p>
            <p>4. 在"搜索"页面搜索帖子</p>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>
.settings-page {
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

.tips-text {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.tips-text p {
  margin: 4px 0;
}
</style>
