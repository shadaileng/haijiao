# 海角助手 — 项目文档

## 目录结构

```
docs/
├── README.md                        # 本文件：文档索引与执行总览
├── _template.md                     # 文档创建模板
├── index.md                         # VitePress 首页
├── .vitepress/                      # VitePress 配置与主题
├── plans/                           # 方案类（待执行 → 已完成）
│   ├── 01-登录功能实施方案.md
│   ├── 02-功能新增与改善方案.md
│   ├── 03-配置代理地址功能方案.md
│   ├── 04-参考haijiao-wxt界面布局方案.md
│   ├── 05-参考haijiao-wxt重构前端项目方案.md
│   ├── 06-E2E自动化测试方案.md
│   ├── 07-Worker代理适配优化方案.md
│   ├── 08-回复列表渲染方案.md
│   ├── 09-数据驱动重构方案.md
│   ├── 10-Emoji解析移植方案.md
│   ├── 11-批量图片加载模块方案.md
│   ├── 12-v-content适配Door标签方案.md
│   ├── 13-v-content适配Sell标签方案.md
├── architecture/                    # 架构类（持续维护）
│   ├── 01-架构概览.md
│   └── 02-架构演进.md
├── references/                      # 参考类（持续维护）
│   ├── 01-API 参考.md
│   ├── 02-数据字典.md
│   └── 03-Origin 代码剖析.md
├── guides/                          # 指南/手册类（持续维护）
│   ├── 01-开发指南.md
│   ├── 02-用户手册.md
│   └── 03-E2E代理踩坑排查.md
└── reference/                       # 参考代码（.gitignore，不纳入版本管理）
    ├── origin/                      # 原始 Webpack 编译产物
    │   ├── app.js
    │   └── chunk-vendors.js
    └── haijiao-wxt/                 # 参考项目源码（已 gitignore）
```

## 文档一览

| 文档 | 版本 | 类型 | 位置 | 说明 | 状态 |
|:----|:---:|:----|:----|:----|:----:|
| `_template.md` | v1.0.0 | 模板 | `./` | 文档创建模板 | 🏁 |
| `01-登录功能实施方案.md` | v1.0.0 | 方案 | `plans/` | 登录功能完整方案 | 🏁 |
| `02-功能新增与改善方案.md` | v1.0.0 | 方案 | `plans/` | 11 项新功能方案 | 📋 |
| `03-配置代理地址功能方案.md` | v1.0.0 | 方案 | `plans/` | 首页+登录页代理地址配置 | 🏁 |
| `04-参考haijiao-wxt界面布局方案.md` | v1.1.0 | 方案 | `plans/` | 参考 haijiao-wxt dev 分支布局调整 Web 界面 | 🏁 |
| `05-参考haijiao-wxt重构前端项目方案.md` | v1.1.0 | 方案 | `plans/` | 彻底重建 src/，移植视频播放与模块化能力，支持镜像源 | 🏁 |
| `06-E2E自动化测试方案.md` | v1.2.0 | 方案 | `plans/` | Playwright + 本机 Chrome 端到端测试 | 🏁 |
| `07-Worker代理适配优化方案.md` | v1.1.0 | 方案 | `plans/` | worker.ts 代理层与前端适配问题修复 | 🏁 |
| `08-回复列表渲染方案.md` | v1.0.0 | 方案 | `plans/` | 评论区回复列表递归渲染，v-content 支持 | 🏁 |
| `09-数据驱动重构方案.md` | v2.0.0 | 方案 | `plans/` | 消除硬编码、死 Store、缺骨架屏等数据驱动问题 | 🏁 |
| `10-Emoji解析移植方案.md` | v1.0.0 | 方案 | `plans/` | `[emoji]code[/emoji]` 渲染为 `<img>` 图片 | 🏁 |
| `11-批量图片加载模块方案.md` | v1.0.0 | 方案 | `plans/` | 多任务异步队列批量处理图片解码 | 🏁 |
| `12-v-content适配Door标签方案.md` | v1.1.0 | 方案 | `plans/` | v-content 插件解析 `[door]` 标签渲染跳转 | 🏁 |
| `13-v-content适配Sell标签方案.md` | v1.2.0 | 方案 | `plans/` | v-content 插件解析 `sell-btn` HTML 渲染 + 视频预览 | 🏁 |
| `01-架构概览.md` | v1.1.0 | 架构 | `architecture/` | 系统架构与请求链路 | 🏁 |
| `02-架构演进.md` | v1.0.0 | 架构 | `architecture/` | 从 Vue2/ElementUI 到 Vue3/Vant 的迁移 | 🏁 |
| `01-API 参考.md` | v1.1.0 | 参考 | `references/` | 所有 API 端点定义 | 🏁 |
| `02-数据字典.md` | v1.1.0 | 参考 | `references/` | 核心类型定义 | 🏁 |
| `03-Origin 代码剖析.md` | v1.0.0 | 参考 | `references/` | origin/app.js 与 chunk-vendors.js 深度剖析 | 🏁 |
| `01-开发指南.md` | v1.1.0 | 指南 | `guides/` | 开发、构建、部署指引 | 🏁 |
| `02-用户手册.md` | v1.1.0 | 手册 | `guides/` | 功能使用说明 | 🏁 |
| `03-E2E代理踩坑排查.md` | v1.0.0 | 指南 | `guides/` | Vite 6 + http-proxy-3 动态代理踩坑记录 | 🏁 |

**文档类型说明**：

| 类型 | 说明 | 生命周期 |
|:----|------|---------|
| **方案** | 功能实施前的设计方案，含技术调研和实现步骤 | 实施完成后 → 🏁 已完成 |
| **架构** | 系统整体的技术架构说明 | 持续维护 |
| **参考** | API、数据字典等开发者参考信息 | 随代码更新 |
| **指南** | 开发/使用流程指引 | 持续维护 |
| **手册** | 面向最终用户的功能说明 | 随功能更新 |
| **模板** | 创建新文档的标准模板 | 按需完善 |

## 版本关联

| 应用版本 | 日期 | 说明 | 对应文档变更 |
|:-------|:----:|------|:-----------:|
| v1.9.0 | 2026-07-12 | snake→camel 全局转换、评论字段修正、keep-alive、scrollBehavior | 01-架构/01-API/02-数据字典 更新 |
| v1.8.0 | 2026-07-12 | E2E 测试 + 本地代理 | 06 创建 |
| v1.7.0 | 2026-07-12 | 重建 src/：视频播放、模块化状态、镜像源 | 05 完成，AGENTS/README/CHANGELOG/API 参考同步 |
| v1.3.0 | 2026-07-09 | 登录功能 | 01 创建 |
| v1.2.0 | 2026-07-04 | 数据源配置 | — |
| v1.1.0 | 2025-07-03 | 项目初始化 | — |

> 完整变更记录见 [CHANGELOG.md](../CHANGELOG.md)

## 执行进度

### 01-登录功能实施方案

| 步骤 | 任务 | 状态 |
|:---:|------|:----:|
| 1 | Sign 算法确认 | ✅ |
| 2 | 类型定义新增 | ✅ |
| 3 | API `login()` 函数实现 | ✅ |
| 4 | Store 登录状态管理 | ✅ |
| 5 | LoginView 页面创建 | ✅ |
| 6 | 路由与守卫配置 | ✅ |
| 7 | SettingsView 登录状态展示 | ✅ |
| 8 | HomeView 用户昵称展示 | ✅ |
| 9 | 构建验证 | ✅ |
| 10 | 文档更新 | ✅ |

> 所有步骤已完成，登录功能已上线。

### 02-功能新增与改善方案

| 阶段 | 功能 | 优先级 | 状态 |
|:---:|:----|:-----:|:----:|
| 第一波 | 每日签到 | P0 | ⬜ 未开始 |
| 第一波 | 用户帖子分类展示 | P0 | ⬜ 未开始 |
| 第一波 | 用户信息展示 | P0 | ⬜ 未开始 |
| 第一波 | Emoji 解析 | P0 | ✅ 已完成 |
| 第二波 | 帖子收藏 | P1 | ⬜ 未开始 |
| 第二波 | 关系扩展（粉丝/好友） | P1 | ⬜ 未开始 |
| 第二波 | 验证码交互 | P1 | ⬜ 未开始 |
| 第三波 | 标签浏览 | P2 | ⬜ 未开始 |
| 第三波 | 视频内联播放器 | P2 | ⬜ 未开始 |
| 第三波 | VIP 信息展示 | P2 | ⬜ 未开始 |
| 第三波 | 注册/找回密码 | P2 | ⬜ 未开始 |

### 03-配置代理地址功能方案

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `src/stores/user.ts` | 新增 proxyBase 状态 + setProxyBase() | ✅ |
| 2 | `src/api/request.ts` | API_BASE 硬编码改为动态 getProxyBase() | ✅ |
| 3 | `src/composables/useProxyConfig.ts` | 新增 composable 封装共享逻辑 | ✅ |
| 4 | `src/views/LoginView.vue` | 添加配置入口 + 对话框模板 | ✅ |
| 5 | `src/views/HomeView.vue` | 添加配置入口 + 对话框模板 | ✅ |
| 6 | 验证 | `vite build` 构建验证 | ✅ |

### 05-参考haijiao-wxt重构前端项目方案

| 阶段 | 步骤 | 操作 | 状态 |
|:----:|:----:|:-----|:----:|
| 一 | 1 | 删除 `src/` 全部文件（含废弃 layouts/useLoading） | ✅ |
| 一 | 2 | 依赖与配置（dplayer/hls.js/persistedstate，移除 vite proxy） | ✅ |
| 二 | 3 | `types/index.ts` + `utils/image.ts`（cipher） | ✅ |
| 二 | 4 | `api/request.ts`（镜像源 X-Backend、视频、登录、列表 API） | ✅ |
| 二 | 5 | 模块化 `stores/`（settings/user/homepage/hot） | ✅ |
| 三 | 6 | `plugins/`（headicon、content+DPlayer）、`components/` | ✅ |
| 三 | 7 | `views/` + `router/` + `App.vue` + `main.ts` | ✅ |
| 三 | 8 | 镜像源设置 UI（SettingsView/LoginView/useProxyConfig） | ✅ |
| 四 | 9 | `worker.ts` 支持 `X-Backend` 镜像源 | ✅ |
| 四 | 10 | 验证（`pnpm run build` 类型检查 + 打包通过） | ✅ |
| 四 | 11 | 文档同步（AGENTS/README/CHANGELOG/API 参考） | ✅ |

### 04-参考haijiao-wxt界面布局方案

| 阶段 | 步骤 | 操作 | 状态 |
|:----:|:----:|:-----|:----:|
| 一 | 1 | 补充 Topic/Comment 等类型定义 | ✅ |
| 一 | 2 | 新增 `/hot`、`/homepage` 路由 | ✅ |
| 一 | 3 | App.vue 添加 back-top + overlay + TabBar | ✅ |
| 一 | 4 | 全局样式补充 utility classes | ✅ |
| 二 | 5 | 创建 Topics 帖子列表组件 | ✅ |
| 二 | 6 | 创建 UserInfo 用户信息卡片 | ✅ |
| 二 | 7 | 创建 Comment 评论列表组件 | ✅ |
| 二 | 8 | 创建 TopicContent 内容渲染组件 (IntersectionObserver) | ✅ |
| 三 | 9 | 创建 HotTopicsView 热门列表页 | ✅ |
| 三 | 10 | 重写 TopicView 帖子详情 | ✅ |
| 三 | 11 | 创建 UserHomeView 用户主页 | ✅ |
| 三 | 12 | 调整 FollowView 列表项样式 | ✅ |
| 三 | 13 | 调整 SearchView 列表项样式 | ✅ |
| 三 | 14 | 调整 SettingsView 添加用户信息 | ✅ |
| 四 | 15 | 构建验证 | ✅ |

### 06-E2E自动化测试方案

| 阶段 | 步骤 | 操作 | 状态 |
|:----:|:----:|:-----|:----:|
| 一 | 1 | `e2e/config.ts` 测试参数配置 | ✅ |
| 一 | 2 | `vite.config.ts` 自定义中间件代理 | ✅ |
| 一 | 3 | `playwright.config.ts` + `package.json` 脚本 | ✅ |
| 二 | 4 | `public.spec.ts` 公开页冒烟 | ✅ |
| 二 | 5 | `auth.spec.ts` 登录态链路 | ✅ |
| 二 | 6 | `topic.spec.ts` 帖子详情（视频+图片） | ✅ |
| 二 | 7 | `mirror.spec.ts` 镜像源 X-Backend | ✅ |
| 三 | 8 | 文档同步 | ✅ |

### 07-Worker代理适配优化方案

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `worker.ts` | 删除 `/api/proxy-image` 端点 | ✅ |
| 2 | `worker.ts` | `origin` 头改用 `backend` 变量 | ✅ |
| 3 | `vite.config.ts` | 缺少 `X-Backend` 时回退默认后端 | ✅ |
| 4 | 验证 | `pnpm run build` 构建通过 | ✅ |
| 5 | 文档 | 更新方案文档状态 | ✅ |

### 08-回复列表渲染方案

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `src/components/ReplyList.vue` | 新建递归组件 | ✅ |
| 2 | `src/components/Comment.vue` | 替换内联回复渲染 | ✅ |
| 3 | — | 构建验证 | ✅ |

### 09-数据驱动重构方案

| 阶段 | 步骤 | 操作 | 优先级 | 状态 |
|:----:|:----:|:-----|:-----:|:----:|
| 一 | 1 | TabBar 配置改为响应式数据驱动 | P1 | ✅ |
| 一 | 2 | TabBar 按登录态显示/隐藏 | P2 | ✅ |
| 一 | 3 | FollowView 移除硬编码占位图 | P1 | ✅ |
| 二 | 4 | 删除 `stores/hot.ts` | P1 | ✅ |
| 二 | 5 | 删除 `stores/homepage.ts` | P1 | ✅ |
| 二 | 6 | 构建验证 | P0 | ✅ |
| 三 | 7 | UserView 新增骨架屏 | P1 | ✅ |
| 三 | 8 | SettingsView 新增骨架屏 | P2 | ✅ |
| 四 | 9 | Comment 删除空 onLoad，改用纯分页 | P1 | ✅ |
| 四 | 10 | SearchView 修复 api 类型 | P2 | ✅ |
| 四 | 11 | UserInfo 修复 prop 类型 | P2 | ✅ |
| 五 | 12 | 提取 Api 接口类型 | P3 | ✅ |
| 五 | 13 | 统一注入模式（统一为`import { api }`，移除`provide('$api')`） | P3 | ✅ |

### 10-Emoji解析移植方案

| 步骤 | 文件 | 操作 | 状态 |
|:---:|:-----|:-----|:----:|
| 1 | `src/utils/emoji.ts` | 新建：映射表 + `renderEmoji()` | ✅ |
| 2 | `src/plugins/content.ts` | 集成渲染 + 修复 CSS 冲突 | ✅ |
| 3 | `src/main.ts` | 挂载 `$emoji` 全局方法 | ✅ |
| 4 | `src/components/ReplyList.vue` | 折叠预览渲染 + CSS | ✅ |
| 5 | `src/components/Comment.vue` | `.hv-emoji` CSS | ✅ |
| 6 | `src/types/emoji.d.ts` | 新建：类型声明 | ✅ |
| 7 | 验证 | `pnpm run build` | ✅ |
| 8 | 文档同步 | 更新状态标记 | ✅ |

### 11-批量图片加载模块方案

| 步骤 | 任务 | 状态 |
|:---:|------|:----:|
| 1 | 新建 `src/utils/imageLoader.ts`：AsyncQueue + Cache + Observer + ImageLoader | ✅ |
| 2 | `image.ts` 添加 `@deprecated` 标记 | ✅ |
| 3 | 改造 `headicon.ts`：改用 `imageLoader.observe()` | ✅ |
| 4 | 改造 `content.ts`：改用 `imageLoader.observe()` | ✅ |
| 5 | 改造 `ImageViewerView.vue`：改用 `imageLoader.load()` | ✅ |
| 6 | 验证：`pnpm run build` 类型检查 + 构建通过 | ✅ |
| 7 | 文档同步：更新本方案状态为 🏁，更新 `docs/README.md` | ✅ |

| `12-v-content适配Door标签方案.md` | v1.1.0 | 方案 | `plans/` | v-content 插件解析 `[door]` 标签渲染跳转 | 🏁 |
| `13-v-content适配Sell标签方案.md` | v1.0.0 | 方案 | `plans/` | v-content 插件解析 `[sell]` 标签渲染购买信息 | 🏁 |

### 12-v-content适配Door标签方案

| 步骤 | 任务 | 状态 |
|:---:|------|:----:|
| 1 | `transform.ts` 追加 4 条字段映射 | ✅ |
| 2 | `types/index.ts` 新增 `DoorData` 接口 | ✅ |
| 3 | `plugins/content.ts` door 解析渲染 + 点击导航 | ✅ |
| 4 | `components/TopicContent.vue` 新增 `doors` prop | ✅ |
| 5 | `views/TopicView.vue` 传递 `doors` 给 TopicContent | ✅ |
| 6 | `styles/global.scss` 门卡片样式 | ✅ |
| 7 | 验证：`pnpm run build` 类型检查 + 构建通过 | ✅ |
| 8 | 文档同步：更新状态标记 + README.md | ✅ |

### 13-v-content适配Sell标签方案

| 步骤 | 任务 | 状态 |
|:---:|------|:----:|
| 1 | `types/index.ts` 新增 `SaleData` 接口，`Topic` 添加 `sale` 字段 | ✅ |
| 2 | `transform.ts` 追加 3 条字段映射 | ✅ |
| 3 | `plugins/content.ts` 添加 `sell-btn` HTML 正则替换逻辑 | ✅ |
| 4 | `components/TopicContent.vue` 新增 `sale` prop | ✅ |
| 5 | `views/TopicView.vue` 传递 `sale` 给 TopicContent | ✅ |
| 6 | `styles/global.scss` sell 容器/标题/内容样式 | ✅ |
| 7 | 验证：`pnpm run build` 类型检查 + 构建通过 | ✅ |
| 8 | 文档同步：更新状态标记 + README.md | ✅ |
| 9 | `plugins/content.ts` sell 容器内生成 `data-preview="30"` 视频缩略图 | ✅ |
| 10 | `plugins/content.ts` DPlayer `timeupdate`/`ended` 限时逻辑 | ✅ |
| 11 | `plugins/content.ts` 导入 `showDialog` + `formatDuration` 辅助函数 | ✅ |
| 12 | `styles/global.scss` `.preview-title` 样式 | ✅ |
| 13 | 验证：`pnpm run build` 类型检查 + 构建通过 | ✅ |

## 参考代码

`reference/` 目录包含从 haijiao.com 生产环境提取的 Webpack 编译产物：

| 文件 | 说明 | 关键内容 |
|:----|:------|:--------|
| `app.js` | 主应用入口 + 业务模块 | 登录、关系、用户主页、VIP、表情、视频播放、API 封装等 |
| `chunk-vendors.js` | 第三方依赖 | Vue、Element UI、Axios、core-js 等 |

分析结论：原始应用基于 **Vue 2 + Element UI + Webpack** 构建，与当前项目的 Vue 3 + Vant 技术栈不同，但 API 契约保持一致。

## 约定

- 文档文件名使用 `{序号}-{中文标题}.md` 格式，序号范围：01-99
- 状态标记：`🏁 已完成` · `🚧 进行中` · `📋 待执行`
- 每个文档开头必须包含「本页信息」表格，说明文档编号、版本、状态
- 每次更新须在「变更历史」中追加一行
- 版本号格式 `v{major}.{minor}.{patch}`，重大内容变更升 major，功能增补升 minor，勘误升 patch
- 相关文档之间添加交叉引用链接（`→ 详见 {文档标题}`）
- 创建新文档请复制 `_template.md` 到对应子目录并填写「本页信息」
- 新文档按类型放入对应子目录：方案 → `plans/`、架构 → `architecture/`、参考 → `references/`、指南 → `guides/`

## 文档生命周期

```
📋 待执行 → 🚧 进行中 → 🏁 已完成 → （持续维护/归档）
```

- **📋 待执行**：已规划但未开始实施（方案类文档初始状态）
- **🚧 进行中**：正在实施（方案类文档进入实施后更新）
- **🏁 已完成**：实施完毕，内容冻结（方案类文档终态）
- 架构/参考/指南/手册类文档持续维护，不设终态
	- 过时或废弃的文档在信息表中标注"⏳ 已归档"
