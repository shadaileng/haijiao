# v-content 适配 Door 标签方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 12 |
> | 文档版本 | v1.1.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-15 |
> | 对应功能/内容 | v-content 插件解析 `[door]` 标签，渲染门卡片并跳转目标帖子 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-15 | v1.0.0 | 初版 |
> | 2026-07-15 | v1.0.0 | 实施完成：6 个文件改动 + build 验证通过 |
> | 2026-07-15 | v1.1.0 | 修复：door 导航改用路径字符串修复跳转异常；门缩略图添加 `imageLoader.observe` 懒加载；路由参数变化改用 `watch` 监听 + `:key` 强制重建子组件；`loadTopic` 开头重置 `topicLocal` 清空旧数据 |

> **关联文档**：[01-API 参考.md](../references/01-API%20参考.md)（Topic 接口 doors 字段） · [03-Origin 代码剖析.md](../references/03-Origin%20代码剖析.md)（参考项目 door 解析逻辑） · [02-数据字典.md](../references/02-数据字典.md)（DoorData 类型）

---

## 1. 背景

参考项目 origin（`docs/reference/origin/app.js`）中，帖子内容支持 `[door]{id}[/door]` 标签，渲染为可点击的富卡片（标题、浏览/评论/购买统计、缩略图），点击后跳转到目标帖子详情页。

当前项目 `src/plugins/content.ts` 已实现 `[emoji]` 解析，但尚未处理 `[door]` 标签。API 响应的 `Topic` 接口中已有 `doors` 字段（当前类型定义为 `number[]`），但前端未使用。

### 参考项目 door 卡片视觉

```
┌────────────────────────────────────┐
│  ┌──────────────────────┬────────┐ │
│  │ 帖子标题（14px 加粗） │ ┌────┐ │ │
│  │                      │ │    │ │ │
│  │ 999 浏览  88 评论    │ │ 缩 │ │ │
│  │ 20 人已购买          │ │ 略 │ │ │
│  │                      │ │ 图 │ │ │
│  └──────────────────────┴────────┘ │
└────────────────────────────────────┘
```

卡片特点：
- 整块可点击，圆角 `8px`，浅灰背景 `#f5f5f5`，1px 边框 `#ebedf0`
- **左侧**（flex: 1）：标题（加粗 14px）+ 统计信息（灰色小字 12px：浏览/评论/购买）
- **右侧**（固定 72×72）：缩略图，圆角 4px
- **已失效状态**：标题显示「传送门已失效」，不显示统计数和缩略图
- **无数据降级**：渲染为蓝色文字 `[传送门]`

---

## 2. 当前项目现状

| 位置 | 现状 | 问题 |
|------|------|------|
| `src/types/index.ts:95` | `doors: number[]` | 类型不完整，API 实际返回对象数组 |
| `src/utils/transform.ts` | 无 `view_count`/`dest_valid`/`buy_count`/`img_url` 映射 | door 子字段保持蛇形，与驼峰类型不匹配 |
| `src/plugins/content.ts` | 无 `[door]` 处理逻辑 | 核心缺失 |
| `src/components/TopicContent.vue` | 未传递 `doors` | 指令拿不到门数据 |
| `src/views/TopicView.vue` | 已初始化 `doors: []` 但未使用 | 死代码 |
| `src/styles/global.scss:71` | `.hv-door-span` 存在 | 死样式 |
| `src/components/Comment.vue` | 使用 `v-content` 但不含 `doors` | 无需改动（评论无 door 标签） |
| `src/components/ReplyList.vue` | 同上 | 同上 |

---

## 3. 方案

### 3.1 数据流

```
API 响应 (snake_case, 含 doors[] 对象数组)
  → request() → toCamelCase()（递归转换）→ camelCase DoorData[]
    → TopicView.loadTopic() → topicLocal.doors
      → TopicContent :doors="topicLocal.doors"
        → v-content 指令 binding.value.doors
          → 解析 [door]{id}[/door] 标签
            → 从 doors[] 查找 type===1 && id 匹配
              → 有数据 & destValid → 渲染富卡片
              → 有数据 & !destValid → 渲染"已失效"状态
              → 无数据（或 doors 为空）→ 渲染简易 [传送门] 链接
             → 点击 → router.push('/topic/' + pid)（路径字符串）
```

### 3.2 涉及文件与改动明细

| # | 文件 | 改动 |
|:-:|------|------|
| 1 | `src/utils/transform.ts` | 追加 4 条 snake→camel 映射 |
| 2 | `src/types/index.ts` | 新增 `DoorData` 接口，`Topic.doors` 改为 `DoorData[]` |
| 3 | `src/plugins/content.ts` | 新增 `[door]` 解析渲染 + 点击导航逻辑 |
| 4 | `src/components/TopicContent.vue` | 新增 `doors` prop，传入 `v-content` 指令 |
| 5 | `src/views/TopicView.vue` | 传递 `:doors="topicLocal.doors"` 给 TopicContent |
| 6 | `src/styles/global.scss` | 新增 `.door-box`/`.door-box-text`/`.door-box-img`/`.door-stats` 样式 |

### 3.3 各步骤详细实现

#### 步骤 1：`src/utils/transform.ts` — 补充 door 字段映射

```typescript
const snakeToCamelMap: Record<string, string> = {
  // ... 已有映射
  dest_valid: 'destValid',
  view_count: 'viewCount',
  buy_count: 'buyCount',
  img_url: 'imgUrl',
}
```

> `comment_count` 已在映射表中（`→ commentCount`），door 对象中同名字段会被递归自动转换。

#### 步骤 2：`src/types/index.ts` — 新增类型

```typescript
export interface DoorData {
  id: number
  type: number
  title: string
  destValid: boolean
  viewCount: number
  commentCount: number
  buyCount: number
  imgUrl: string
}
```

`Topic.doors` 类型变更：

```typescript
// 修改前
doors: number[]

// 修改后
doors: DoorData[]
```

#### 步骤 3：`src/plugins/content.ts` — 核心 door 解析逻辑

**导入：**
```typescript
import router from '@/router'
```

**binding value 解构：**
```typescript
let { topicId, content, attachments, doors, handleClick } = binding.value
```

**渲染流程（在 `renderEmoji(content)` 之后、`el.innerHTML = content` 之前插入）：**

```typescript
if (typeof content === 'string' && content.includes('[/door]')) {
  const fragments = content.split('[/door]')
  for (const fragment of fragments) {
    if (!fragment.includes('[door]')) continue
    const doorId = fragment.split('[door]')[1]
    const doorData = Array.isArray(doors)
      ? doors.find(d => d.type === 1 && String(d.id) === doorId)
      : null

    if (doorData && doorData.destValid) {
      const stats = `
        <span>${formatCount(doorData.viewCount)} 浏览</span>
        <span>${formatCount(doorData.commentCount)} 评论</span>
        <span>${formatCount(doorData.buyCount)} 人已购买</span>`
      const imgBlock = doorData.imgUrl
        ? `<div class="door-box-img"><img src="${LOADING_URL}" data-src="${doorData.imgUrl}" /></div>`
        : ''
      const html = `<div class="door-box" data-door="${doorData.id}">
        <div class="door-box-text">
          <h3>${doorData.title}</h3>
          <div class="door-stats">${stats}</div>
        </div>
        ${imgBlock}
      </div>`
      content = content.replace(`[door]${doorId}[/door]`, html)
    } else {
      const label = doorData ? '传送门已失效' : '传送门'
      content = content.replace(
        `[door]${doorId}[/door]`,
        `<span class="hv-door-span" data-door="${doorId}">[${label}]</span>`
      )
    }
  }
}
```

**点击事件绑定（在 `el.innerHTML = content` 之后追加）：**

```typescript
el.querySelectorAll<HTMLElement>('.door-box, .hv-door-span').forEach(el => {
  el.addEventListener('click', () => {
    const pid = el.dataset.door
    if (pid) router.push('/topic/' + pid)
  })
})
```

**缩略图懒加载（紧随点击事件绑定）：**

```typescript
el.querySelectorAll<HTMLImageElement>('.door-box-img img').forEach(img => {
  const url = img.dataset.src
  if (url) imageLoader.observe(img, url)
})
```

**`formatCount` 辅助函数：**

```typescript
function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
```

#### 步骤 4：`src/components/TopicContent.vue` — 传递 doors

```vue
<script setup lang="ts">
defineProps({
  topicId: { type: [String, Number], default: 0 },
  content: { type: String, default: '' },
  attachments: { type: Array<Attachment>, default: () => [] },
  doors: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="content" v-content="{
    topicId,
    content,
    attachments,
    doors,
    handleClick,
  }"></div>
</template>
```

#### 步骤 5：`src/views/TopicView.vue` — 路由参数监听 + 数据重置

**核心改动：**

```typescript
const defaultTopic = (): Topic => ({
  topicId: 0, likeCount: 0, title: '', user: null,
  content: '', attachments: [], createTime: '',
  node: null, commentCount: 0, doors: [],
})

const topicLocal = ref<Topic>(defaultTopic())

const loadTopic = async (topicPid: string) => {
  if (!topicPid) return
  topicLocal.value = defaultTopic()  // ← 立即清空旧数据，销毁子组件
  loading.value = true
  const resp = await api.topic({ params: { topicId: topicPid } })
  if (!resp.success) {
    showToast(resp.message || '加载主题失败')
    loading.value = false
    return
  }
  Object.assign(topicLocal.value, resp.data)
  loading.value = false
}

// 路由参数变化自动重载（immediate 首次加载）
watch(() => route.params.pid, async (newPid) => {
  if (newPid) {
    pid.value = newPid as string
    await loadTopic(pid.value)
  }
}, { immediate: true })
```

**模板中使用 `:key` 强制子组件重建：**

```vue
<TopicContent
  :key="topicLocal.topicId"
  :topicId="topicLocal.topicId"
  :content="topicLocal.content"
  :attachments="topicLocal.attachments"
  :doors="topicLocal.doors"
/>
<Comment
  :key="topicLocal.topicId"
  :topicId="topicLocal.topicId"
  @loaded="onCommentLoaded"
/>
```

> 原代码只有 `onMounted` 加载数据，同组件内路由参数变化时组件复用，`onMounted` 不触发。改用 `watch` + `:key` 后实现：参数变化 → 立即重置数据（旧评论区销毁）→ 骨架屏 → 新数据到达（组件重建）。

#### 步骤 6：`src/styles/global.scss` — 门卡片样式

```scss
.door-box {
  display: flex;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  background: #f5f5f5;
  cursor: pointer;
  align-items: center;
}
.door-box-text {
  flex: 1;
  min-width: 0;
}
.door-box-text h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #323233;
}
.door-stats {
  font-size: 12px;
  color: #969799;
}
.door-stats span {
  margin-right: 16px;
}
.door-box-img {
  width: 72px;
  height: 72px;
  margin-left: 12px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #e8e8e8;
}
.door-box-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 4. 边界情况处理

| 场景 | 表现 | 逻辑 |
|------|------|------|
| API 返回 `doors: number[]`（仅 ID） | 渲染单击 `[传送门]` 链接 | `doorData` 为 null，走降级分支 |
| API 返回 `DoorData[]` 但 ID 不匹配 | 同上 | `Array.isArray` 为 true，但 `find` 返回 undefined |
| `doorData.destValid === false` | 渲染灰色 `[传送门已失效]` 链接 | 不展示统计数和缩略图 |
| 内容中无 `[door]` | 跳过解析，零性能开销 | `includes('[/door]')` 短路 |
| 多个 `[door]` 标签 | 逐一替换，各自的卡片独立渲染 | 循环处理每个 fragment |
| Comment/ReplyList 使用 `v-content` | 不传 `doors`，`doors` 为 undefined | `Array.isArray(doors)` 为 false，直接跳过 |

---

## 5. 不涉及范围

- `[book]` 书城门（type === 2）不在本次范围内，如有需求可后续扩展
- 列表页（HotTopicsView 等）的 `liteContent` 不含 door 标签，不做处理
- Comment/ReplyList 组件不传递 `doors`，不处理 door 标签
- 不对 `toCamelCase` 做通用重构，仅追加 door 所需映射

---

## 6. 执行步骤与验证

| 步骤 | 操作 | 预期结果 |
|:----:|:-----|:---------|
| 1 | 修改 `src/utils/transform.ts` | 追加 4 条映射 |
| 2 | 修改 `src/types/index.ts` | 新增 `DoorData`，更新 `Topic.doors` |
| 3 | 修改 `src/plugins/content.ts` | door 解析 + 渲染 + 导航 |
| 4 | 修改 `src/components/TopicContent.vue` | 接收并传递 `doors` |
| 5 | 修改 `src/views/TopicView.vue` | 传入 `doors` prop |
| 6 | 修改 `src/styles/global.scss` | 门卡片样式 |
| 7 | 执行 `pnpm run build` | 类型检查 + 构建通过 |
| 8 | 文档同步 | 更新本方案状态 + README.md |

---

## 7. 实施中修复的问题

以下问题在首次实施后的测试中发现并修复：

| # | 问题 | 根因 | 修复 |
|:-:|------|------|------|
| 1 | 点击 door 地址栏变了但帖子内容不刷新 | 同组件内路由参数变化时 `onMounted` 不触发 | 改用 `watch(() => route.params.pid, ...)` + `:key` |
| 2 | 点击 door 缩略图不加载 | `data-src` 设置了但未调用 `imageLoader.observe` | 添加 `.door-box-img img` 的 `imageLoader.observe` 调用 |
| 3 | 点击 door 导航不跳转 | 命名路由参数绑定问题 | 改用路径字符串 `router.push('/topic/' + pid)` |
| 4 | 跳转后旧评论区残留到新数据到达 | `topicLocal` 重置在 API 请求之后 | `loadTopic` 开头调用 `topicLocal.value = defaultTopic()` |
| 5 | `Cannot access 'loadTopic' before initialization` | `watch` 的 `immediate: true` 在 setup 阶段同步执行，`const loadTopic` 未被提升 | 将 `loadTopic` 定义移到 `watch` 之前 |

## 8. 附录

### 7.1 参考项目 door 解析源码位置

来源：`docs/reference/origin/app.js`

| 逻辑 | 行号 |
|:-----|:----:|
| door 解析与渲染 | 4654–4665 |
| 点击事件绑定 | 6831–6842 |
| 纯文本降级替换 | 952 |
| door 事件名定义 | 6757 |

### 7.2 关键字段对照

| 蛇形（API） | 驼峰（TypeScript） | 说明 |
|:-----------|:------------------|:-----|
| `id` | `id` | 门 ID / 目标帖子 ID |
| `type` | `type` | 1=帖子门，2=书城门 |
| `dest_valid` | `destValid` | 目标帖子是否有效 |
| `view_count` | `viewCount` | 浏览量 |
| `comment_count` | `commentCount` | 评论数 |
| `buy_count` | `buyCount` | 购买数 |
| `img_url` | `imgUrl` | 缩略图 URL |
