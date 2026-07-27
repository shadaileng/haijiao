# 21-首页 Tab 系统实现方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 21 |
> | 文档版本 | v1.2.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-27 |
> | 对应功能/内容 | HotTopicsView 添加 Tab 切换，对齐原版首页 tab 系统 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-27 | v1.2.0 | 吸顶改用 CSS `position: sticky` 替代 Vant JS sticky，避免切换竞态 |
> | 2026-07-27 | v1.1.0 | 每个 Tab 独立缓存数据与滚动位置 |
> | 2026-07-27 | v1.0.0 | 初版 |
>
> **关联文档**：[03-Origin 代码剖析.md](../references/03-Origin%20代码剖析.md)（原版 Tab 系统）

---

## 1. 背景

当前首页 `/hot` 只加载 `/topic/hot/topics`（热门帖子），无 Tab 切换能力。原版参考项目（`app.js:4924-4932`）通过 `s[t]` 映射表支持多 Tab 切换（热门/最新/指定板块/精华/悬赏/全部等），本次实现其中 3 个基础 Tab。

## 2. 改动范围

| 文件 | 改动 |
|:-----|:------|
| `src/api/request.ts` | 新增 `TAB_CONFIG` 映射表 + `getTabTopics()` 函数 + `api.tabTopics()` 方法 + `Api` 接口 |
| `src/views/HotTopicsView.vue` | 替换为 `van-tabs` + `van-tab` + sticky 布局 + tab 分页状态管理 |
| `src/utils/constant.ts` | 可选：导出 `TAB_LIST` 配置 |

## 3. 详细设计

### 3.1 Tab 配置表

在 `src/api/request.ts` 中新增，对齐原版 `app.js:4924-4932`：

```typescript
export const TAB_CONFIG: Record<number, { url: string; label: string }> = {
  0: { url: '/topic/hot/topics',                    label: '热门' },
  1: { url: '/topic/node/news',                     label: '最新' },
  2: { url: '/topic/node/topics?type=1&nodeId=0',   label: '全部' },
}
```

### 3.2 API 函数

```typescript
export async function getTabTopics(tabIndex: number, page: number, limit = 20): Promise<any> {
  const cfg = TAB_CONFIG[tabIndex] || TAB_CONFIG[0]
  return request({ url: cfg.url, params: { page, limit } })
}
```

`request()` 的 `buildUrl()` 会在已有 query string 上追加 `page`/`limit`，例如：
- 热门 → `/api/topic/hot/topics?page=1&limit=20`
- 最新 → `/api/topic/node/news?page=1&limit=20`
- 全部 → `/api/topic/node/topics?type=1&nodeId=0&page=1&limit=20`

### 3.3 Api 接口与对象

在 `Api` 接口新增：

```typescript
tabTopics(params: { params: { tabIndex: number; page: number; limit?: number } }): Promise<ApiResult>
```

在 `api` 对象新增实现，调用 `getTabTopics()`。

### 3.4 HotTopicsView.vue

**模板结构**：单个 Topics 组件在 `van-tabs` 下方，通过 `topicsMap[activeTab]` 切换数据。

> 吸顶使用 CSS `position: sticky` 包裹容器，而非 Vant 的 JS 版 `sticky` prop。原因：Vant 的 `sticky` 用 `position: fixed` + JS 滚动监听模拟吸顶，Tab 切换时内部 `setRootScrollTop()` 与我们的 `scrollTo` 产生竞态，导致吸顶失败。

```vue
<template>
  <div class="hot-container">
    <div class="hot-tabs-sticky">
      <van-tabs v-model:active="activeTab" @change="onTabChange" />
    </div>
    <Topics
      mode="pagination"
      :topics="topicsMap[activeTab] || []"
      :skeletonLoading="loading"
      :pageIndex="pageMap[activeTab] || 1"
      :totalItems="totalMap[activeTab] || 0"
      :pageSize="pageSize"
      @pageChange="(p: number) => loadPage(p)"
    />
  </div>
</template>

<style scoped>
.hot-tabs-sticky {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
}
</style>
```

与 v1.0.0 的区别：不在 `van-tab` 内嵌 Topics，用单个 Topics + 数据映射切换。避免了 Vant Tabs 切换时销毁子组件导致数据丢失。

**数据结构**：每个 Tab 独立存储，互不干扰。

```typescript
const topicsMap: Record<number, LiteTopic[]> = {}      // 每个 tab 的帖子列表
const pageMap: Record<number, number> = {}               // 每个 tab 的当前页码
const totalMap: Record<number, number> = {}               // 每个 tab 的总条数
const scrollMap: Record<number, number> = {}              // 每个 tab 的滚动位置
```

**脚本逻辑**：

- `activeTab`：`ref(Number(sessionStorage.getItem('hotActiveTab')) || 0)`，变化时持久化
- `TAB_LIST`：从 `api/request.ts` 导入 `TAB_CONFIG` 转换的数组
**`loadPage(page)`**：

```typescript
const loadPage = async (page: number) => {
  loading.value = true
  const tab = activeTab.value
  const result = await api.tabTopics({ params: { tabIndex: tab, page, limit: pageSize } })
  if (!result.success) {
    showToast(result.message || '加载失败')
    loading.value = false
    return
  }
  topicsMap[tab] = result.data.results
  pageMap[tab] = page
  totalMap[tab] = result.data.page.total
  loading.value = false
}
```

**`onTabChange(newTab)`** — 切换时的核心逻辑：

```typescript
const onTabChange = (newTab: number) => {
  scrollMap[activeTab.value] = window.scrollY
  activeTab.value = newTab
  sessionStorage.setItem('hotActiveTab', String(newTab))
  if (!topicsMap[newTab]) {
    loadPage(1)
  } else {
    nextTick(() => {
      window.scrollTo({ top: scrollMap[newTab] || 0 })
    })
  }
}
```

**状态保持效果**：

```
Tab 热门（page=3, scrollY=1250）
  → 切换到 Tab 最新
    → scrollMap[0] = 1250（保存）
    → topicsMap[1] 有缓存 → 直接显示，scrollTo(scrollMap[1] || 0)
  → 切回 Tab 热门
    → scrollMap[1] = 800（保存）
    → topicsMap[0] 有缓存 → 直接显示，scrollTo(1250)
```

各 Tab **首次访问时才发请求**，之后切换零请求，滚动位置精确恢复。`keep-alive` 已缓存 `HotTopicsView` 组件本身，不销毁。

## 4. 实施步骤

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `src/api/request.ts` | 新增 `TAB_CONFIG` 映射表 | ✅ |
| 2 | `src/api/request.ts` | 新增 `getTabTopics()` 导出函数 | ✅ |
| 3 | `src/api/request.ts` | `Api` 接口新增 `tabTopics` | ✅ |
| 4 | `src/api/request.ts` | `api` 对象新增 `tabTopics` 方法 | ✅ |
| 5 | `src/views/HotTopicsView.vue` | 重构：`topicsMap`/`pageMap`/`totalMap`/`scrollMap` 四映射 + CSS `position: sticky` 包裹容器（替代 Vant JS sticky）+ 单个 Topics + `onTabChange` 保存/恢复滚动 | ✅ |
| 6 | — | `pnpm run build` 类型检查 + 构建验证 | ✅ |

---

> **关联文档**：[03-Origin 代码剖析.md](../references/03-Origin%20代码剖析.md)（§2.5.3 首页 Tab 系统）
