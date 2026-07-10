<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { getFollowList } from '@/api/request'
import type { FollowUser } from '@/types'

const LOADING_URL = 'https://haijiao.com/images/common/project/loading.gif'

const store = useUserStore()

const username = ref('')
const itemsAll = reactive<FollowUser[]>([])
const items = ref<FollowUser[]>([])
const loading = ref(false)
const finished = ref(false)

onMounted(async () => {
  if (store.followMap[store.uid]) {
    itemsAll.splice(0, itemsAll.length, ...store.followMap[store.uid])
    filterItems()
  }
  if (store.isLoggedIn) {
    await loadFollow()
  }
})

const loadFollow = async () => {
  loading.value = true
  try {
    const data = await getFollowList(store.token, store.uid)
    if (!data || !Array.isArray(data)) {
      showToast('加载关注列表失败')
      return
    }
    itemsAll.splice(0, itemsAll.length, ...data)
    store.cacheFollow(store.uid, data)
    filterItems()
  } catch (e: any) {
    showToast(e.message || '加载关注列表失败')
  } finally {
    loading.value = false
    finished.value = true
  }
}

const filterItems = () => {
  if (!username.value) {
    items.value = [...itemsAll]
  } else {
    items.value = itemsAll.filter(item =>
      (item as any).nickname?.includes(username.value)
    )
  }
}

</script>

<template>
  <van-search
    v-model="username"
    @search="filterItems"
    placeholder="输入昵称搜索"
  />
  <van-pull-refresh v-model="loading">
    <van-list
      :loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadFollow"
    >
      <van-cell v-for="item in items" :key="(item as any).userId">
        <template #value>
          <div class="card">
            <van-row>
              <van-col span="6">
                <van-image
                  round
                  width="4rem"
                  height="4rem"
                  :src="LOADING_URL"
                  v-headicon="((item as any).avatar?.startsWith('http') ? (item as any).avatar + '.txt' : (item as any).avatar)"
                />
              </van-col>
              <van-col span="16" class="hv-text-start">
                <van-row>
                  <van-col span="16">
                    <a
                      class="hv-link"
                      @click="$router.push(`/homepage/${(item as any).userId}/${(item as any).nickname}`)"
                    >
                      {{ (item as any).nickname }}
                    </a>
                  </van-col>
                  <van-col span="8">
                    <van-tag plain type="primary">{{ (item as any).fansCount }}</van-tag>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col span="24" class="hv-sign">
                    签名:{{ (item as any).description || '这家伙很懒什么也没留下' }}
                  </van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
        </template>
      </van-cell>
    </van-list>
    <van-back-top />
  </van-pull-refresh>
</template>

<style scoped>
.card {
  text-align: center;
  padding: 0;
}
.hv-link {
  color: #29253b;
  text-decoration: none;
  cursor: pointer;
  color: #505050;
}
</style>
