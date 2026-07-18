# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.24.0] - 2026-07-18

### Added

- 主页无限滚动改为分页模式
  - `src/components/Topics.vue`：新增 `mode` prop（`scroll`/`pagination`），分页模式渲染 `van-pagination`
  - `src/views/HotTopicsView.vue`：从 `van-list` 无限滚动重构为分页模式，`sessionStorage` 记住页码与滚动位置
  - `src/router/index.ts`：`scrollBehavior` 支持 `sessionStorage` 保存/恢复滚动位置
  - `src/types/index.ts`：`Page` 接口新增 `totalPage` 字段

## [1.23.0] - 2026-07-15

### Added

- 配置页新增复制/粘贴 Token 功能
  - `src/views/SettingsView.vue`：新增 `handleCopyCredentials()` / `handlePasteCredentials()` 函数，认证配置区增加复制/粘贴按钮
  - 剪贴板格式：`JSON.stringify({ uid, token })`

## [1.22.0] - 2026-07-15

### Added

- 视频播放优化：preview.m3u8 自动解析为完整视频
  - `api/request.ts`：新增 `resolveRealUrl()` 下载 preview m3u8 → 提取 code → 返回完整视频 URL
  - `plugins/content.ts`：视频播放自动调用 `resolveRealUrl` 转换 remoteUrl；HLS keyPath 片段路径修正（origin 兼容）；`"undefined"` 的 keyPath 值过滤
  - 移除前端线路按钮和测试按钮（所有 line 均返回 preview，resolveRealUrl 统一解析）
- sell 内容视频预加载：扫描 sell-btn 内的 `<video data-id>` → 主动调用 `loadVideoSrc` 获取元数据 → 嵌套缩略图
  - `plugins/content.ts`：sell 处理前先提取 videoId，attachList 中不存在时异步调 API 补全

### Fixed

- 服务端返回 `key-path="undefined"` 导致 HLS 片段 URL 出现 `undefined` 前缀 → 过滤为空字符串

## [1.21.0] - 2026-07-15

### Added

- `v-content` 插件适配 `sell-btn` HTML 渲染购买信息与视频预览
  - `types/index.ts`：新增 `SaleData` 接口，`Topic.sale` 字段
  - `utils/transform.ts`：追加 `money_type/buy_index/is_buy` 蛇形→驼峰映射
  - `plugins/content.ts`：正则替换 `<span class="sell-btn">` 为 `.hjsell-container` 容器，显示售价/购买人数/购买状态；未购买且有视频附件时生成 `data-preview="30"` 视频缩略图；DPlayer `timeupdate`/`ended` 事件超限暂停+弹窗提示购买
  - `TopicContent.vue`：新增 `sale` prop
  - `TopicView.vue`：传递 `sale` 给 TopicContent
  - `global.scss`：`.hjsell-container` / `.hssell-title` / `.hssell-bought` / `.hssell-not-bought` / `.preview-title` 样式
  - `docs/plans/13-v-content适配Sell标签方案.md`：方案文档，包含基础购买信息展示 + 视频预览实现

## [1.20.0] - 2026-07-15

### Added

- `v-content` 插件适配 `[door]{id}[/door]` 标签，渲染门卡片（标题 + 浏览/评论/购买统计 + 缩略图），点击跳转到目标帖子
  - `types/index.ts`：新增 `DoorData` 接口，`Topic.doors` 从 `number[]` 改为 `DoorData[]`
  - `utils/transform.ts`：追加 `dest_valid/view_count/buy_count/img_url` 蛇形→驼峰映射
  - `utils/imageLoader.ts`：`formatCount` 数字格式化辅助
  - `plugins/content.ts`：`[door]` 解析渲染 + `imageLoader.observe` 缩略图懒加载 + `router.push` 导航
  - `TopicContent.vue`：新增 `doors` prop
  - `TopicView.vue`：`watch(() => route.params.pid)` 替代 `onMounted`，参数变化自动重载；`loadTopic` 开头重置 `topicLocal` 清空旧数据；`:key` 强制子组件重建
  - `global.scss`：`.door-box` 门卡片系列样式

## [1.19.1] - 2026-07-14

### Fixed

- 移除 IntersectionObserver 的 rootMargin 预加载（300px），恢复为仅在视口内加载，解决页面卡顿问题
- 补齐 VitePress sidebar 中 plans 目录缺失的 08-11 条目
- 补齐 docs/index.md features 列表全部 22 篇文档入口

## [1.19.0] - 2026-07-14

### Added

- `src/utils/imageLoader.ts`：多任务异步队列批量图片加载模块
  - AsyncQueue 并发控制（默认 6 路，3 优先级 bucket：high/medium/low）
  - 指数退避重试（1s→2s→4s，最多 3 次）
  - 内存缓存去重（Map<url, result>，加载中并发自动去重）
  - IntersectionObserver 统一管理
  - WeakMap 元素追踪，指令 unmounted 自动清理
- 原 `loadImg()` 标记 `@deprecated`，保留完整代码供回退
- `v-headicon` / `v-content` 指令改用 `imageLoader.observe()` 统一加载
- `ImageViewerView` 改用 `imageLoader.load()` 并自动清理

## [1.18.0] - 2026-07-14

### Added

- Emoji 解析渲染：`[emoji]code[/emoji]` 替换为 `<img>` 内联图片，支持 4 组 59 个表情
- `src/utils/emoji.ts`：映射表 + `renderEmoji()` 纯函数，通过 settings store apiBase 拼接 CDN 路径
- v-content 指令集成 emoji 渲染，emoji 图片跳过 IntersectionObserver 懒加载
- ReplyList 折叠预览也渲染 emoji 为图片
- 全局 `.hv-emoji` 样式控制内联尺寸（1.2em），覆盖组件作用域的宽高强制

## [1.17.0] - 2026-07-14

### Added

- 评论头部重构为 flexbox 紧凑布局：头像固定尺寸，用户名/时间左对齐，楼号 margin-left:auto 推右，间距不随容器宽度伸缩
- ReplyList 新增折叠/展开功能：折叠态显示首条回复摘要（头像 + 用户名 + 正文预览 + 发布时间），点击展开全部回复，点击箭头收回
- 回复项与顶层评论样式统一：用户名 + 灰色冒号 + 正文 inline flex-wrap 同行显示，发布时间独立一行居左
- 正文内容与回复列表缩进对齐（padding-left: calc(3rem + 10px)），与用户名/时间列平齐，形成清晰左对齐层级
- 评论内容与回复面板之间增加 van-divider 浅灰分隔线
- App.vue 增加 max-width: 768px 容器约束 + 左右居中，大屏显示不再拉伸

## [1.16.0] - 2026-07-14

### Added

- 评论区回复列表递归渲染组件 ReplyList：支持头像展示、v-content 富内容渲染（图片/视频/音频）、无限嵌套回复
- 修复 API snake_case 字段 `commend_list` / `reply_id` 未转换导致回复无法显示的问题
- 修复回复昵称点击误跳至父评论作者的问题

## [1.13.10] - 2026-07-12

### Fixed

- 修复搜索返回结果后 van-list `onLoad` 再次触发搜索导致骨架屏反复显示的问题，仅首次搜索显示骨架

## [1.13.9] - 2026-07-12

### Fixed

- 搜索完成后使用 `nextTick` 等待 DOM 更新再调用 `endLoad`，避免 Topics 组件未渲染导致加载状态卡住

## [1.13.8] - 2026-07-12

### Fixed

- 添加 `@vant/touch-emulator` 解决 PC 端 van-search 清空按钮失效问题（Vant 清空按钮仅监听 touch 事件）

## [1.13.7] - 2026-07-12

### Fixed

- 恢复 `watch(key)` 监听，手动删除字符清空后回到标签页

## [1.13.6] - 2026-07-12

### Fixed

- 搜索框清空按钮添加 `clear-trigger="always"` 确保失焦后也能显示清空图标
- 修复搜索 API `results` 为 null 时崩溃

## [1.13.5] - 2026-07-12

### Fixed

- 搜索框清空按钮改用 `@click-icon` 手动清空 key 并重置搜索状态

## [1.13.4] - 2026-07-12

### Fixed

- 搜索框清空改为 `watch(key)` 监听，清空时自动回退到标签页

## [1.13.3] - 2026-07-12

### Fixed

- 修复搜索框清空按钮不回退到标签页的问题

## [1.13.2] - 2026-07-12

### Fixed

- 修复标签显示空白，字段名由 `name` 修正为 `tagName`

## [1.13.1] - 2026-07-12

### Fixed

- 修复标签 API 返回格式兼容，支持 `array` 和 `{ results: [...] }` 两种格式

## [1.13.0] - 2026-07-12

### Added

- 新增 `getTags` API（`GET /tag/tags`），搜索页标签从 API 动态获取

## [1.12.0] - 2026-07-12

### Added

- 搜索页添加热门标签快捷搜索，点击标签直接搜索

### Fixed

- 修复搜索页初始状态显示"加载中"的问题

## [1.11.1] - 2026-07-12

### Fixed

- 修复骨架屏导致 `topicsDom` 未渲染时 `endLoad` 调用崩溃，移除不必要的 `onMounted` 调用

## [1.11.0] - 2026-07-12

### Added

- 所有列表页添加骨架屏 loading：UserHomeView、HotTopicsView、FollowView、SearchView 在数据加载前显示占位布局
- `Topics` 组件新增 `skeletonLoading` prop，由父组件控制骨架屏显示

## [1.10.1] - 2026-07-12

### Fixed

- 修复 `UserHomeView` keep-alive 缓存后切换用户不更新数据的问题，添加 `watch(route.params.userId)`

## [1.10.0] - 2026-07-12

### Added

- `FollowView` 加入 `keep-alive` 缓存，返回关注列表不重载，恢复滚动位置

### Fixed

- 修复 `UserHomeView`、`UserView` 中 `data.results` 为空导致 `is not iterable` 崩溃

## [1.9.0] - 2026-07-12

### Added

- `src/utils/transform.ts`：新增 `toCamelCase()` 全局 snake_case → camelCase 转换器，`request()` 对所有 API 响应自动执行
- `keep-alive` 缓存列表页：HotTopicsView、UserHomeView、SearchView 在 App.vue 中注册
- `scrollBehavior` 恢复滚动位置：后退导航自动回到上次浏览位置

### Fixed

- 修复评论组件字段名未适配 `toCamelCase` 导致用户主页跳转 `uid` 为 undefined
- 修复 `CommentItem` 类型定义字段名（`user_id`→`userId`、`reply_id`→`replyId`、`commend_list`→`commendList`）
- 移除 `request` 层 `errorCode=1` 全局拦截，避免将普通请求失败误判为未登录
- 修复 Topics 组件单附件/无附件标题行缺少 `@click` 跳转

### Changed

- 设置页移除手动保存/清除按钮，UID/Token/当前用户改为只读展示
- 开发代理从 Vite `server.proxy` 改为自定义中间件插件，完全控制代理行为
- 图片加载改为直连 fetch 原始 URL（`loadImg`），移除 `/api/proxy-image`

## [1.8.2] - 2026-07-12

### Fixed

- 修复 `fetchImageThroughProxy` 缺少 `X-Backend` 头导致图片代理 404 的问题
- 修复 E2E 测试：`addInitScript` 每次导航覆盖登录凭据、视频测试选择器/断言错误，测试从 4/10 提升到 10/10 通过

## [1.8.0] - 2026-07-12

### Added

- 本地端到端测试：新增 `playwright.config.ts` + `e2e/`（public/auth/video/mirror 四规格），驱动本机 Chrome，参数集中于 `e2e/config.ts`
- 本地 E2E 代理：`vite.config.ts` 新增 `server.proxy['/api']`，`router` 读取请求头 `X-Back-end`（即配置页「数据源字段」）动态转发到镜像源，与生产 `worker.ts` 行为对齐，仅 `pnpm run dev` 生效

### Changed

- 镜像源 composable 重命名 `useProxyConfig` → `useMirrorConfig`，消除「代理地址」概念残留
- 设置页「镜像源（后端地址）」改为「镜像源（数据源地址）」，placeholder 改为 `https://你的镜像域名`，数据来源处增加「官方域名国内被屏蔽」提示
- 文档（README/AGENTS/API 参考）同步说明 haijiao.com 国内被屏蔽、实际须填后台可用镜像

## [1.7.0] - 2026-07-12

### Added

- 视频播放能力：移植 wxt 的 DPlayer + hls.js，点击视频封面经 `/api/attachment` 解析 m3u8 并播放
- 模块化 Pinia 状态：`settings`(镜像源/uid/token) / `user`(当前用户+关注) / `homepage` / `hot`，统一 `pinia-plugin-persistedstate` 持久化到 localStorage
- 可配置镜像源：设置页可填写后端地址，请求经 `X-Backend` 头告知 Worker 代理目标，回退 `HAIJIAO_API_BASE`
- `v-content` 指令支持图片/视频/音频渲染，`v-headicon` 头像懒加载与解码

### Changed

- 彻底重建 `src/`：参考 haijiao-wxt 重构，移除 `browser.*` 扩展依赖
- API 层统一走同源 `/api`，加密解密兼容 1/2/3 层 Base64
- 视频认证统一使用 `settings`/`user` store 的 uid/token（修复 wxt 中未填充的 `browser.storage 'user'`）
- 不再使用 vite `server.proxy`，后端地址在配置页动态配置

### Fixed

- 修复 wxt `content.ts` 缺失 `LOADING_URL` 导入的 bug（改用本地 data URI 占位图）
- 清理死代码：`layouts/MainLayout.vue`、`composables/useLoading` 已删除

### Removed

- 移除扩展专属逻辑：`getCurrentTab`、`cookiesGet`、新标签页打开图片/链接等

## [1.6.2] - 2026-07-10

### Fixed

- `fetchImageThroughProxy` 直接使用 `remoteUrl` 原值 + `.txt` 后缀 fetch + customDecode，不再做路径解构和代理前缀拼装

## [1.6.1] - 2026-07-10

### Fixed

- 图片加载改为走代理地址：`v-headicon` 指令通过 `getApiPrefix()` + `customDecode()` 解码加载，不再直连源站

### Changed

- 提取 `customDecode` / `fetchImageThroughProxy` 到 `src/utils/image.ts` 共享工具
- `request.ts` 的 `processImages` 复用了相同的代理+解码逻辑

## [1.6.0] - 2026-07-10

### Added

- 参考 haijiao-wxt 界面布局：热点列表页 `/hot` 替换首页功能网格
- 用户主页 `/homepage/:userId/:nickname`（用户信息 + 帖子分页）
- Topics 通用帖子列表组件（单图/多图布局、用户栏、统计信息）
- UserInfo 用户信息卡片组件（头像、昵称、统计、签名）
- Comment 评论列表组件（分页）
- TopicContent 富文本渲染组件（IntersectionObserver 图片懒加载）
- v-headicon 图片懒加载指令（IntersectionObserver 实现）
- 全局 van-back-top 返回顶部按钮
- 全局 overlay 浮层用于图片大图查看
- 全局 TabBar 统一导航栏（主页/搜索/关注/配置）

### Changed

- App.vue 重构为主布局容器：TabBar + overlay + back-top
- 路由调整：`/` 重定向到 `/hot`，新增 `/hot`、`/homepage` 路由，路由元 `showTabBar` 控制 TabBar 显隐
- TopicView 重构：元信息行（标签/评论/点赞）、用户栏（头像/昵称/时间、可跳转主页）、评论区
- FollowView 改用 Vant 列表卡片样式（头像 + 昵称 + 粉丝 + 签名）
- SearchView 改用 Topics 组件渲染搜索结果
- SettingsView 添加当前用户信息卡片展示
- 全局样式增加 `hv-` utility classes（from haijiao-wxt）
- 新增 `getHotTopics()` API 函数

### Fixed

- HomeView 重复 `ref` 声明和 Options API 混用导致编译错误
- main.ts `Toast()` 不可调用警告
- 各组件/视图未使用的 import 清理

## [1.5.0] - 2026-07-10

### Changed

- 代理地址统一接管 API 和资源请求：`getApiHost()` 从 `proxyBase` 推导域名，资源直链自动跟随代理地址
- 设置页新增代理地址配置入口，替换原有的"数据源"字段
- 首页移除代理地址配置入口（迁移至设置页）

### Removed

- 移除 Store 中 `apiBase` 状态和 `setApiBase()` 方法，取消独立的数据源配置

## [1.4.2] - 2026-07-10

### Fixed

- 修复 Sign 生成算法：实现 MD5(Username + Password + UserAgent)，使用 js-md5 库匹配服务器校验逻辑

## [1.4.1] - 2026-07-10

### Fixed

- 修复自定义代理地址 CORS 错误：自动追加 `/api` 路径前缀匹配 Worker 规则
- 修复 Vant 4.9 `Toast()` 不可调用问题：全项目迁移为 `showToast()` / `showSuccessToast()`

## [1.4.0] - 2026-07-10

### Added

- 首页和登录页新增代理地址配置功能
- 可自定义 API 请求代理地址，默认使用 `/api`
- `useProxyConfig()` composable 封装代理配置逻辑

### Changed

- `request.ts` 中 `API_BASE` 由硬编码改为动态读取 `store.proxyBase`
- Store 新增 `proxyBase` 状态及 `setProxyBase()` 方法，持久化到 localStorage

## [1.3.0] - 2026-07-09

### Added

- 登录页面 `/login`，支持邮箱/用户名 + 密码登录
- 路由守卫：未登录时自动跳转登录页
- 设置页面显示登录状态和用户信息
- 退出登录功能
- 首页显示用户昵称

### Changed

- 设置页面重构：区分登录状态区和高级配置区
- Pinia Store 新增 `nickname`、`loginFromApi()`、`logout()` 方法

## [1.2.0] - 2026-07-04

### Added

- 设置页面新增数据源配置功能，可自定义 API 主机地址

## [1.1.0] - 2025-07-03

### Added

- 初始化海角助手 Web 应用项目
- 基于 Vue 3 + Vant 4 + Cloudflare Workers 架构
- 7 个页面视图：首页、帖子详情、用户帖子、关注列表、搜索、设置、图片查看
- API 请求层封装，支持 Base64 多层加密数据自动解密
- Pinia 状态管理，localStorage 数据持久化
- Cloudflare Worker API 代理，解决 CORS 问题
- 帖子/用户/搜索历史记录本地缓存
- TypeScript 严格模式类型检查
- Tailwind CSS + SCSS 混合样式方案
- 移动端响应式设计和 TabBar 导航
