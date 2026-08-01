# 全局 Loading 指示器方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 32 |
> | 文档版本 | v1.3.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-08-01 |
> | 对应功能/内容 | 全局 Loading 指示器：路由切换自动触发 + 手动控制 + 最短显示时间 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-08-01 | v1.3.0 | 新增 300ms 最短显示时间 |
> | 2026-08-01 | v1.2.0 | 实施完成 |
> | 2026-08-01 | v1.1.0 | 新增路由切换自动触发 |
> | 2026-08-01 | v1.0.0 | 初版 |

> **关联文档**：[01-架构概览.md](../architecture/01-架构概览.md)

---

## 1. 问题背景

部分点击操作（如收藏、关注、签到等）延迟较大，用户点击后无任何视觉反馈，感觉像没有点击。路由切换时也没有 loading 反馈，用户不知道页面正在加载。当前各组件各自维护 loading 状态（骨架屏/按钮 loading），缺乏统一的全局 loading 机制。

## 2. 目标

- 路由切换时自动显示全局 loading，页面加载完成后自动隐藏
- 各组件可手动调用 `show()` / `hide()` 控制显隐（如 API 请求）
- 使用 Pinia store 管理状态，支持嵌套调用（计数器模式）

## 3. 技术方案

### 3.1 新建 `src/stores/app.ts` — 全局状态管理

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

const MIN_DURATION = 300

export const useAppStore = defineStore('app', () => {
  const loading = ref(0)
  let timer: ReturnType<typeof setTimeout> | null = null
  let startTime = 0

  function show() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    startTime = Date.now()
    loading.value++
  }

  function hide() {
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_DURATION) {
      timer = setTimeout(() => {
        if (loading.value > 0) loading.value--
        timer = null
      }, MIN_DURATION - elapsed)
    } else {
      if (loading.value > 0) loading.value--
    }
  }

  return { loading, show, hide }
})
```

**设计要点**：
- 使用 `ref(0)` 计数器而非 `ref(false)`，支持多个异步操作嵌套调用
- `show()` 递增计数，`hide()` 递减计数，归零后隐藏
- 300ms 最短显示时间：避免快速路由切换时 loading 闪烁
- 不启用持久化（loading 状态无需跨会话保留）

### 3.2 新建 `src/components/common/GlobalLoading.vue` — UI 组件

```vue
<script setup lang="ts">
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>

<template>
  <Transition name="fade">
    <div v-if="appStore.loading > 0" class="global-loading">
      <van-loading size="24px" vertical>加载中</van-loading>
    </div>
  </Transition>
</template>

<style scoped>
.global-loading {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

**设计要点**：
- 固定定位在屏幕底部中央（TabBar 上方），不遮挡内容操作
- 使用 Vant `<van-loading>` 旋转图标，轻量不侵入
- `<Transition>` 包裹，进出有 0.2s 渐变动画
- `z-index: 9999` 确保在最上层

### 3.3 修改 `src/App.vue` — 挂载组件

在 `<template>` 中 `<TabBar />` 同级位置添加 `<GlobalLoading />`。

### 3.4 修改 `src/router/index.ts` — 路由守卫自动触发

在现有的 `beforeEach` 守卫中添加 `appStore.show()`，在 `afterEach` 钩子中添加 `appStore.hide()`：

```ts
import { useAppStore } from '@/stores/app'

// beforeEach 中（已有逻辑之后）
router.beforeEach((to, _from, next) => {
  const appStore = useAppStore()
  appStore.show()  // 路由切换前显示 loading

  if (isLoggedIn() || publicPages.includes(to.name as string)) {
    next()
  } else {
    next({ name: 'Login' })
  }
})

// afterEach 钩子（新增）
router.afterEach(() => {
  const appStore = useAppStore()
  appStore.hide()  // 路由切换完成后隐藏 loading
})
```

**设计要点**：
- `beforeEach` 中调用 `show()`，路由跳转开始时显示 loading
- `afterEach` 中调用 `hide()`，路由跳转完成后隐藏 loading
- loading 仅在路由切换瞬间显示，不干扰页面数据加载
- 各页面的骨架屏仍由组件自身管理，两者互不冲突

## 4. 使用方式

### 4.1 路由切换（自动）

无需任何代码，路由切换时自动显示/隐藏。

### 4.2 API 请求（手动）

```ts
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

async function handleFavorite() {
  appStore.show()
  try {
    await api.addFavorite(topicId)
    showToast('收藏成功')
  } finally {
    appStore.hide()
  }
}
```

## 5. 涉及文件

| 操作 | 文件 |
|------|------|
| 新建 | `src/stores/app.ts` |
| 新建 | `src/components/common/GlobalLoading.vue` |
| 修改 | `src/App.vue` |
| 修改 | `src/router/index.ts` |

## 6. 执行步骤

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `src/stores/app.ts` | 新建 app store（loading 计数器 + show/hide） | ✅ |
| 2 | `src/components/common/GlobalLoading.vue` | 新建全局 loading 组件（fixed 定位 + van-loading） | ✅ |
| 3 | `src/App.vue` | 导入并挂载 `<GlobalLoading />` | ✅ |
| 4 | `src/router/index.ts` | 导入 app store，beforeEach show + afterEach hide | ✅ |
| 5 | — | `pnpm run build` 构建验证 | ✅ |
| 6 | `docs/README.md` | 文档同步 | ✅ |

---

> **文档规范说明**
>
> 1. 文件名格式：`{序号}-{中文标题}.md`
> 2. 版本号格式：`v{major}.{minor}.{patch}`
>    - major：重大内容重构或范围变更
>    - minor：功能增补或章节调整
>    - patch：勘误、格式调整
> 3. 状态标记：
>    - `📋 待执行` — 已规划但未开始
>    - `🚧 进行中` — 正在实施
>    - `🏁 已完成` — 实施完毕
> 4. 新文档按类型放入对应子目录：方案 → `plans/`、架构 → `architecture/`、参考 → `references/`、指南 → `guides/`
> 5. 每更新一次内容，在「变更历史」表格中追加一行
