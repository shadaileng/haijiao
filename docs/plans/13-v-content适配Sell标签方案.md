# v-content 适配 Sell 标签方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 13 |
> | 文档版本 | v1.2.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-15 |
> | 对应内容 | v-content 插件解析 `[sell]` 标签渲染购买信息 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-15 | v1.2.0 | 补充视频预览实现方案（参考 origin/app.js:4622-4651 + 4574-4594） |
> | 2026-07-15 | v1.1.0 | 实际 API 返回 `sell-btn` HTML，改为正则替换 `sell-btn` 元素 |
| 2026-07-15 | v1.0.0 | 初版 |

> **关联文档**：[12-v-content适配Door标签方案.md](./12-v-content适配Door标签方案.md)（同类标签适配）· [02-数据字典.md](../references/02-数据字典.md)（类型定义）

---

## 1. 背景

帖子内容中可能包含购买信息，API 返回的内容中该信息以 HTML 格式呈现：

```html
<span class="sell-btn" data-floor="0">
  <span class="sell_line1">...</span>
  <span class="sell_line2">...</span>
</span>
```

同时接口返回 `sale` 对象（含 `money_type`, `amount`, `buyCount`, `buyIndex`, `isBuy`）和 `currentUserPurchased` 标志。需要：
1. 将 `sell-btn` HTML 替换为带样式的购买信息容器（已完成）
2. 对于未购买且包含视频附件的帖子，显示 30 秒视频预览（待实现，参考 origin/app.js:4622-4651）

## 2. 数据流

```
API 响应 (含 sale 字段)
  → toCamelCase() 转换 (sale 字段保持 sale，子字段 money_type→moneyType 等)
  → TopicView.vue (topicLocal.sale)
  → TopicContent.vue (sale prop)
  → v-content 指令 (binding.value.sale)
  → 解析 [sell] 标签并渲染
```

### SaleData 结构

| 字段 | 类型 | 说明 |
|:-----|:----|:------|
| `moneyType` | number | 1=金币, 2=钻石 |
| `amount` | number | 价格（钻石时需除以100） |
| `buyCount` | number | 购买人数 |
| `buyIndex` | number | >0=已购买(序号), <0=未购买, 0=无数据 |
| `isBuy` | number | 0=未购买, 1=已购买 |

## 4. 实现步骤

| 步骤 | 文件 | 操作 |
|:----:|:-----|:-----|
| 1 | `src/types/index.ts` | 新增 `SaleData` 接口，`Topic` 添加 `sale?: SaleData` |
| 2 | `src/utils/transform.ts` | 追加 `money_type→moneyType`, `buy_index→buyIndex`, `is_buy→isBuy` |
| 3 | `src/plugins/content.ts` | 解构 `sale`，添加 `sell-btn` HTML 正则替换逻辑 |
| 4 | `src/components/TopicContent.vue` | 新增 `sale` prop 并传递给 `v-content` |
| 5 | `src/views/TopicView.vue` | 将 `topicLocal.sale` 传递给 `TopicContent` |
| 6 | `src/styles/global.scss` | 添加 `.hjsell-container` / `.hssell-title` / `.hssell-content` 样式 |
| 7 | 验证 | `pnpm run build` 类型检查 + 构建通过 |
| 8 | 文档同步 | 更新本方案状态，更新 `docs/README.md` |
| 9 | `src/plugins/content.ts` | sell 容器渲染时检测 video 附件，生成带 `data-preview="30"` 的视频缩略图 |
| 10 | `src/plugins/content.ts` | DPlayer `timeupdate`/`ended` 事件检查 `data-preview`，超限暂停+弹窗 |
| 11 | `src/api/request.ts` | 可选：添加 `/topic/buy/sell` 购买 API |
| 12 | `src/styles/global.scss` | 可选：`.preview-title` 样式 |
| 13 | 验证 | `pnpm run build` 类型检查 + 构建通过 |

---

## 5. 详细设计

### 3.1 类型定义 (`src/types/index.ts`)

```typescript
export interface SaleData {
  moneyType: number
  amount: number
  buyCount: number
  buyIndex: number
  isBuy: number
}
```

在 `Topic` 接口中添加 `sale?: SaleData`。

### 3.2 字段映射 (`src/utils/transform.ts`)

```typescript
money_type: 'moneyType',
buy_index: 'buyIndex',
is_buy: 'isBuy',
```

### 3.3 指令解析 (`src/plugins/content.ts`)

在 `mounted` 中解构 `sale`，在 `[door]` 解析之后、`el.innerHTML = content` 之前添加 `[sell]` 解析逻辑。

### 3.4 组件传递

`TopicContent.vue` 新增 `sale` prop，`TopicView.vue` 传递 `topicLocal.sale`。

### 3.5 样式 (`src/styles/global.scss`)

```scss
.hjsell-container {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  background: #f5f5f5;
}
.hssell-title {
  font-size: 12px;
  color: #969799;
  margin-bottom: 8px;
}
.hssell-bought,
.hssell-not-bought {
  color: red;
}
.hssell-content {
  font-size: 14px;
  color: #323233;
}
```

## 6. 视频预览方案（待实现）

### 6.1 参考实现

参考 `docs/reference/origin/app.js:4622-4651`（sell-btn 视频预览）和 `app.js:4574-4594`（preview 限时逻辑）。

### 6.2 检测条件

```
content 含 class="sell-btn" → 已替换为 sell 容器
sale 数据存在 (sale.buyIndex < 0 表示未购买)
attachments 存在 video 附件
```

### 6.3 预览 HTML 结构

替换 sell 容器后，额外在容器内生成一个带预览限制的视频缩略图：

```html
<div class="hjsell-container">
  <div class="hssell-title">此贴售价15.00钻石，已有604人购买</div>
  <div class="hssell-title hssell-not-bought">您还未购买</div>
  <div class="preview-title">出售内容包含[23分钟]视频，以下是预览30秒视频</div>
  <div class="hv-video-div" data-id="{id}" data-preview="30" key-path="{keyPath}" data-url="{coverUrl}">
    <img src="{loadingUrl}" data-id="{id}">
  </div>
</div>
```

关键：video-div 上带 `data-preview="30"` 属性。

### 6.4 播放限制逻辑

在 DPlayer 的 `timeupdate` 事件中检查 `data-preview`：

```javascript
// 读取 preview 限制
const previewSeconds = Number(el.getAttribute('data-preview')) || 0

// DPlayer timeupdate 事件
player.on('timeupdate', () => {
  if (previewSeconds > 0 && player.video.currentTime > previewSeconds) {
    player.pause()
    showDialog({ message: '请购买出售内容，观看完整视频' })
  }
})

// ended 事件
player.on('ended', () => {
  if (previewSeconds > 0) {
    showDialog({ message: '请购买出售内容，观看完整视频' })
  }
})
```

### 6.5 涉及文件

| 文件 | 变更 |
|:-----|:------|
| `src/plugins/content.ts` | sell 容器内渲染预览 video-div，带 `data-preview="30"` |
| `src/plugins/content.ts` | DPlayer 初始化后读取 `data-preview`，注册 `timeupdate`/`ended` 事件限时 |
| `src/api/request.ts` | 可选：添加购买 API `POST /topic/buy/sell` |
| `src/styles/global.scss` | 可选：`.preview-title` 样式 |

## 7. 边界情况

- `sell-btn` HTML 仅出现在帖子详情（TopicView）中，评论/回复中不会出现，因此 `Comment.vue` 和 `ReplyList.vue` 不需要改动
- 基础购买信息展示已完成（v1.1.0），视频预览待实现（v1.2.0+）
- 内容始终显示（不隐藏），顶部显示购买状态信息
- 不处理 `[link]` 等其他标签

---

> **文档规范说明**
>
> 1. 文件名格式：`{序号}-{中文标题}.md`
> 2. 版本号格式：`v{major}.{minor}.{patch}`
> 3. 状态标记：`📋 待执行` / `🚧 进行中` / `🏁 已完成`
> 4. 新文档按类型放入对应子目录
> 5. 每更新一次内容，在「变更历史」表格中追加一行
