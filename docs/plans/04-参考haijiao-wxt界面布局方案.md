# 参考 haijiao-wxt 界面布局方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 04 |
> | 文档版本 | v1.1.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-10 |
> | 对应功能/内容 | 参考 haijiao-wxt (dev 分支) 界面布局调整 Web 应用 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-10 | v1.0.0 | 初版 |
| 2026-07-10 | v1.1.0 | 实施完成：新增类型/路由/组件/HotTopics/UserHomeView，调整 Topic/Follow/Search/Settings，添加 IntersectionObserver 懒加载 |

> **关联文档**：[01-架构概览.md](../architecture/01-架构概览.md) · [02-功能新增与改善方案.md](./02-功能新增与改善方案.md)

---

## 1. 背景

参考仓库 `haijiao-wxt`（Gitee: `shadaileng/haijiao-wxt`）的 `dev` 分支是一个基于 WXT 框架的 Chrome 浏览器扩展，使用 Vue 3 + Vant 4 + Pinia 技术栈。当前项目为同类型 Web 应用（Vue 3 + Vant 4 + Cloudflare Workers），技术栈高度一致。

经对比分析，参考项目的界面布局和组件设计在用户体验上有明显优势，方案据此提出 UI 改造计划。

---

## 2. 参考项目核心布局特征

### 2.1 导航架构

```
TabBar 4 项：主页(热门) | 搜索 | 关注 | 配置
```

- TabBar 通过 `route.meta.shouTabBar` 控制显隐
- 详情页（帖子详情、用户主页）隐藏 TabBar

### 2.2 页面结构

| 页面 | 说明 |
|:----|------|
| 主页 (hot) | 热门帖子无限滚动列表 |
| 搜索 (search) | 搜索栏 + 帖子列表 |
| 关注 (follow) | 搜索过滤 + 关注用户列表 |
| 配置 (settings) | 用户信息 + UID/Token/BaseUrl 配置 |
| 帖子详情 (topic) | 导航栏 + 元信息 + 用户栏 + 富文本内容 + 评论区 |
| 用户主页 (homepage) | 导航栏 + 用户信息卡片 + 帖子分页列表 |

### 2.3 核心可复用组件

| 组件 | 功能 |
|:----|------|
| `Topics.vue` | 通用帖子列表（单图/多图布局、用户栏、统计信息、无限滚动） |
| `UserInfo.vue` | 用户信息卡片（头像、昵称、统计、签名） |
| `Comment.vue` | 评论列表 + 分页 + 嵌套评论 |
| `v-headicon` 指令 | 头像懒加载（支持 base64 解码） |
| `v-content` 指令 | 富文本渲染（图片懒加载/视频播放/音频） |

### 2.4 公共 UI 元素

- `van-back-top` 全局返回顶部
- 浮层 overlay 用于图片大图查看和视频播放（DPlayer + HLS.js）
- `van-skeleton` 加载骨架屏
- `van-pagination` 分页器替代无限滚动（用于评论区、用户帖子）

---

## 3. 改造范围

### 3.1 变更汇总

| 文件 | 操作 | 说明 |
|:----|:----:|------|
| `src/views/HotTopicsView.vue` | **新增** | 热门帖子列表页（替代 HomeView 功能网格） |
| `src/views/TopicView.vue` | 重写 | 增强帖子详情（元信息、用户栏、评论区） |
| `src/views/UserHomeView.vue` | **新增** | 用户主页（信息 + 帖子分页） |
| `src/views/FollowView.vue` | 调整 | 列表项样式匹配参考风格 |
| `src/views/SearchView.vue` | 调整 | 列表项样式匹配参考风格 |
| `src/views/SettingsView.vue` | 调整 | 添加用户信息卡片 |
| `src/components/Topics.vue` | **新增** | 通用帖子列表组件 |
| `src/components/UserInfo.vue` | **新增** | 通用用户信息卡片 |
| `src/components/Comment.vue` | **新增** | 评论列表组件（分页） |
| `src/components/TopicContent.vue` | **新增** | 帖子内容渲染（图片/视频/音频） |
| `src/layouts/MainLayout.vue` | 调整 | 添加 back-top + overlay 浮层 |
| `src/App.vue` | 调整 | 移除多余容器样式 |
| `src/router/index.ts` | 调整 | 新增 `/hot`、`/homepage` 路由 |
| `src/types/index.ts` | 补充 | 补充 Topic、Comment 等类型定义 |

### 3.2 路由变更

| 路径 | 组件 | 说明 |
|:----|:----|:------|
| `/` | HomeView | 保留现有首页（或改为重定向到 `/hot`） |
| `/hot` | **HotTopicsView** | 热门话题列表（TabBar 主页） |
| `/homepage/:userId/:nickname` | **UserHomeView** | 用户主页 |
| `/topic/:pid` | TopicView（增强） | 帖子详情 |
| 其余不变 | Follow/Search/Settings/ImageViewer/Login | — |

### 3.3 与现有功能的关系

本方案不修改现有功能逻辑，仅调整界面布局和组件结构。具体：

- **登录功能**：不受影响，LoginView 保持不变
- **配置代理**：不受影响，逻辑保留
- **API 请求层**：不受影响，调用方式保持不变
- **加密解密**：不受影响，`api/request.ts` 保留

---

## 4. 实施步骤

### 第一阶段：类型 + 路由 + 布局（基础准备）

| 步骤 | 操作 | 涉及文件 |
|:----:|:-----|:---------|
| 1 | 补充 Topic、Comment、Attachment、Node、Page 等类型 | `src/types/index.ts` |
| 2 | 新增路由 `/hot`、`/homepage/:userId/:nickname` | `src/router/index.ts` |
| 3 | MainLayout 添加 `van-back-top` + overlay 浮层 | `src/layouts/MainLayout.vue` |
| 4 | App.vue 简化容器样式 | `src/App.vue` |

### 第二阶段：核心组件创建

| 步骤 | 操作 | 涉及文件 |
|:----:|:-----|:---------|
| 5 | 创建 Topics 通用帖子列表组件 | `src/components/Topics.vue` |
| 6 | 创建 UserInfo 用户信息卡片组件 | `src/components/UserInfo.vue` |
| 7 | 创建 Comment 评论列表组件（分页） | `src/components/Comment.vue` |
| 8 | 创建 TopicContent 帖子内容渲染组件 | `src/components/TopicContent.vue` |

### 第三阶段：视图改造

| 步骤 | 操作 | 涉及文件 |
|:----:|:-----|:---------|
| 9 | 创建 HotTopicsView 热门帖子页 | `src/views/HotTopicsView.vue` |
| 10 | 重写 TopicView（元信息 + 用户栏 + 评论区） | `src/views/TopicView.vue` |
| 11 | 创建 UserHomeView 用户主页 | `src/views/UserHomeView.vue` |
| 12 | 调整 FollowView 列表项样式 | `src/views/FollowView.vue` |
| 13 | 调整 SearchView 列表项样式 | `src/views/SearchView.vue` |
| 14 | 调整 SettingsView 添加用户信息卡片 | `src/views/SettingsView.vue` |

### 第四阶段：验证

| 步骤 | 操作 |
|:----:|:-----|
| 15 | `pnpm run build` 构建验证 |
| 16 | 确认所有路由/页面/交互一致 |

---

## 5. 设计要点

### 5.1 帖子列表项布局

```html
<!-- 多图模式 -->
[标题]
[图][图][图]
[头像] [昵称] [评论数] [点赞数] [日期] [标签]

<!-- 单图模式 -->
[标题.......] [图]
[摘要...2行..]
[头像] [昵称] [评论数] [点赞数] [日期] [标签]
```

### 5.2 用户信息卡片

```html
[头像(圆)] [昵称(ID)]
            [帖子数] [粉丝数] [关注数]
            [签名]
```

### 5.3 评论结构

```html
[头像] [昵称] [楼层] [时间]
[富文本内容]
  └─ [嵌套评论列表]
[分页器]
```

### 5.4 图片懒加载（IntersectionObserver）

参考项目所有图片均通过 IntersectionObserver 实现懒加载：

- **头像 (`v-headicon` 指令)**：`img` 初始 `src` 设为 loading 占位图（`LOADING_URL`），`data-src` 存真实 URL。进入视口后替换 `src` 并 `unobserve`
- **内容区图片 (`v-content` 指令)**：同样的机制。内容通过 `el.innerHTML = content` 渲染后，查询所有 `<img>`，将 `src` 替换为 `LOADING_URL`，`data-src` 指向真实 URL，进入视口后加载

```html
<!-- 初始化 -->
<img src="loading.gif" data-src="真实URL" data-lazy="loading" />

<!-- IntersectionObserver 回调 -->
if (entry.isIntersecting) {
  img.src = img.dataset.src
  img.dataset.lazy = 'loaded'
  observer.unobserve(img)
}
```

### 5.5 浮层 overlay

```html
<van-overlay :show="overlayShow" @click="overlayShow = false">
  <img v-if="overlayImg" :src="overlayImg" @click.stop />
  <div v-if="overlayVideo" class="hv-video-container" @click.stop></div>
</van-overlay>
```

---

## 6. 注意事项

1. **参考来源**：haijiao-wxt `dev` 分支（commit `2348fcf`），非 `master` 分支
2. **技术差异**：参考项目使用 `browser.storage.local`（Chrome 扩展 API），当前项目使用 `localStorage`，持久化方式不同但不影响界面布局迁移
3. **富文本渲染**：参考项目 `v-content` 指令包含大量特殊处理（base64 解码、HLS 视频、door 标签等）。实现时需注意：
   - 所有图片初始使用 loading 占位图，通过 IntersectionObserver 进入视口后才加载真实 URL
   - 图片加载上采 IntersectionObserver 方案，而非简单的 `v-html`
4. **视频播放**：参考使用 DPlayer + HLS.js，当前可按需引入或保持简单链接跳转
5. **骨架屏**：使用 `van-skeleton` 作为加载状态，替代当前的手动 loading 条件渲染

---

## 7. 参考代码内容

克隆自 `https://gitee.com/shadaileng/haijiao-wxt.git`（`dev` 分支），源代码位于 `/tmp/haijiao-wxt/`。

关键文件列表：

| 文件 | 用途 |
|:----|:-----|
| `src/entrypoints/sidepanel1/App.vue` | 主布局（TabBar + overlay） |
| `src/entrypoints/sidepanel1/main.ts` | 应用入口（注册路由/Pinia/指令） |
| `src/router/index.ts` | 6 条路由定义 |
| `src/views/hot.vue` | 热门列表页 |
| `src/views/search.vue` | 搜索页 |
| `src/views/follow.vue` | 关注列表页 |
| `src/views/settings.vue` | 配置页 |
| `src/views/topic.vue` | 帖子详情页 |
| `src/views/homepage.vue` | 用户主页 |
| `src/components/Topics.vue` | 帖子列表组件 |
| `src/components/Topic.vue` | popup 帖子查询组件 |
| `src/components/UserInfo.vue` | 用户信息卡片 |
| `src/components/UserTopics.vue` | 用户帖子列表（分页） |
| `src/components/Comment.vue` | 评论组件 |
| `src/components/User.vue` | 用户卡片（未使用） |
| `src/stores/` | 5 个 Pinia store |
| `src/types/` | 5 个类型定义文件 |
| `src/plugins/headicon.ts` | 头像懒加载指令 |
| `src/plugins/content.ts` | 富文本渲染指令 |
| `src/utils/haijiao.ts` | API handler（所有接口调用） |
| `src/utils/constant.ts` | 常量定义 |
| `src/utils/api.ts` | Chrome 扩展 API 封装 |
