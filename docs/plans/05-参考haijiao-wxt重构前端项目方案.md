# 参考 haijiao-wxt 重构前端项目方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 05 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 📋 待执行 |
> | 最后更新 | 2026-07-12 |
> | 对应功能/内容 | 彻底重建 src/，参考 WXT 扩展移植视频播放与模块化能力，部署于 Cloudflare Workers，支持可配置镜像源 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-12 | v1.0.0 | 初版 |
>
> **关联文档**：[01-API 参考.md](../references/01-API%20参考.md)（端点/加解密）· [01-架构概览.md](../architecture/01-架构概览.md)（请求流程）· [04-参考haijiao-wxt界面布局方案.md](./04-参考haijiao-wxt界面布局方案.md)（界面布局参考）

---

## 1. 背景与目标

### 1.1 现状问题（当前 `src/`）
- **视频播放完全缺失**：仅有视频封面占位与空 `hv-video-container`，`loadVideoSrc` / `getTopicAttachments` / `processImages` 为死代码。
- **存在死代码**：`layouts/MainLayout.vue`（与 `App.vue` 重复且未被引用）、`composables/useLoading`、`composables/useClipboard`（均未被引用）。
- **状态管理单一臃肿**：仅 `useUserStore` 一个 store 混合认证、代理、各缓存。
- **开发代理缺失**：`vite.config.ts` 无 `server.proxy`，`npm run dev` 无法连接后端（文档声称有，实际缺失）。

### 1.2 参考项目 `haijiao-wxt`
WXT 浏览器扩展，含可移植的优质逻辑：
- DPlayer + hls.js 视频播放
- 模块化 Pinia store（settings / UserInfo / homepage / hot）
- `v-headicon` / `v-content` 指令（头像/内容懒加载与解码）
- 图片自定义密码解码、登录/列表/关注 API 封装

但它依赖 `browser.*` 扩展 API（`browser.tabs` / `cookies` / `storage.local` / `runtime.sendMessage`）及 popup/background/content 入口，在纯 Web / CF Workers 环境不可用，必须改造。

### 1.3 目标
1. 彻底删除 `src/` 下全部文件，以 wxt 为参考重建为纯 Web 应用。
2. 保留并完善图片 / 视频 / 认证能力。
3. 支持**可配置镜像源**（默认 `haijiao.com`，可在配置页动态替换为自建后台），经 Cloudflare Worker 代理转发。
4. 继续沿用 Cloudflare Workers 部署。

---

## 2. 总体架构

```
浏览器 ── 同源 /api/* ──▶ Cloudflare Worker(worker.ts)
                            ├─ /api/proxy-image  → 后端 .txt 图片密文（server-side fetch）
                            └─ /api/**           → 后端 API（目标由 X-Backend 头指定，默认 haijiao.com）
                            └─ 其余路径           → dist/ 静态资源 (SPA fallback index.html)

构建：Vite → dist/ ；wrangler deploy 上传 dist + worker.ts
开发：wrangler dev（本地 Worker 提供 /api 代理）/ 或设置页指向已部署 Worker
```

**不使用 vite `server.proxy`**：前端所有请求走同源 `/api`（由 Worker 代理），避免浏览器直连 haijiao.com 触发 CORS；后端目标（haijiao.com 或镜像源）在配置页动态设置，经 `X-Backend` 请求头告知 Worker。

技术栈：Vue 3.5 + Vant 4.9 + Tailwind 3.4 + Pinia(+persistedstate) + vue-router 4 + **DPlayer + hls.js** + js-md5。

---

## 3. 保留 / 复用的根目录配置
`worker.ts`、`wrangler.toml`、`vite.config.ts`、`index.html`、`postcss.config.js`、`tailwind.config.js`、`tsconfig*.json`。

---

## 4. 重建后 `src/` 目录结构

```
src/
├─ main.ts                      # 挂载 router/pinia/指令插件/provide('$api', api)
├─ App.vue                      # RouterView + TabBar + 图片/视频 overlay
├─ api/request.ts               # 统一请求、多层base64解密、登录/列表/关注/视频/图片 API
├─ utils/image.ts               # customDecode 自定义密码 + fetchImageThroughProxy
├─ utils/cipher.ts              # (可选) 图片密码算法独立抽出便于测试
├─ stores/
│  ├─ settings.ts               # 镜像源 apiBase / uid / token（持久化）
│  ├─ user.ts                   # 当前用户信息、关注列表缓存
│  ├─ homepage.ts               # 用户主页信息/帖子缓存
│  └─ hot.ts                    # 热门帖子缓存
├─ composables/
│  ├─ useProxyConfig.ts         # 镜像源/后端地址设置（由“代理”概念升级为“镜像源”）
│  └─ useClipboard.ts           # 复制 uid 等（接回实际调用）
├─ plugins/
│  ├─ headicon.ts               # v-headicon 头像懒加载+解码
│  └─ content.ts                # v-content 内容渲染 + 图片/视频/音频 + DPlayer（修复 LOADING_URL）
├─ components/
│  ├─ Topics.vue                # LiteTopic 列表（热门/搜索）
│  ├─ TopicContent.vue          # 包装 v-content
│  ├─ Comment.vue               # 评论分页+递归
│  ├─ UserInfo.vue              # 用户卡片
│  └─ common/TabBar.vue         # Vant TabBar（主页/搜索/关注/配置）
├─ views/
│  ├─ HomeView.vue              # 首页（重定向到 /hot 或流量入口）
│  ├─ HotTopicsView.vue         # 热门
│  ├─ TopicView.vue             # 帖子详情（含视频）
│  ├─ UserView.vue              # 按 uid 查帖子
│  ├─ UserHomeView.vue          # 用户主页
│  ├─ FollowView.vue            # 关注列表
│  ├─ SearchView.vue            # 搜索
│  ├─ LoginView.vue             # 登录 + 镜像源设置入口
│  ├─ SettingsView.vue          # 镜像源/uid/token/当前用户
│  └─ ImageViewerView.vue       # 图片查看
├─ router/index.ts              # createWebHistory + TabBar meta
├─ types/index.ts               # 全部 TS 接口
└─ styles/global.scss           # Tailwind + Vant 主题 + .hv-* 工具类
```

---

## 5. 关键模块设计

### 5.1 API 层 (`api/request.ts`)
- 统一 `request()`：走同源 `/api` 前缀；响应 `isEncrypted` 时 `decodeMultiBase64`（三层 atob + UTF8）后 `JSON.parse`。
- 读取 `settings` store 的 `apiBase`（镜像源）：非默认时请求携带 `X-Backend: <apiBase>` 头；Worker 据此选择代理目标。
- 导出函数：`getTopic`、`getTopicAttachments`、`loadVideoSrc`（**修复认证来源**：统一用 `settings`/`user` store 的 uid/token，弃用 wxt 中未填充的 `browser.storage 'user'`）、`getHotTopics`、`getUserTopics`、`searchTopics`、`getFollowList`、`login`（md5 sign，沿用现有逻辑）、`processImages`。

### 5.2 图片解码 (`utils/image.ts`)
- 复用现有 `customDecode`（字符集 `ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890`）与 `fetchImageThroughProxy`（请求 Worker `/api/proxy-image?url=<.txt>`）。保持逻辑，清理未用导出。

### 5.3 视频播放（移植 wxt）
- 新增依赖 `dplayer` + `hls.js`。
- `v-content` 中为 `category==='video'` 的附件渲染封面占位；点击时调用 `loadVideoSrc(id, topicId)` 取 `remoteUrl`，实例化 `DPlayer`（`customHls` 用 `Hls()` 加载 m3u8），挂载到 `App.vue` 的 `.hv-video-container` overlay。
- 修复 wxt `content.ts` 缺失 `LOADING_URL` 导入的 bug。

### 5.4 状态管理（模块化，pinia-plugin-persistedstate → localStorage）
- `settings`：镜像源 `apiBase`（默认 `https://haijiao.com`）、`uid`、`token`。
- `user`：当前用户 `UserCurrent`、关注列表。
- `homepage` / `hot`：对应缓存。
- 删除 wxt 的 `browser.storage.local` 适配器，统一 `window.localStorage`。

### 5.5 路由
- `createWebHistory()`；路由表与现有一致（含 `/image-viewer`、`/login`）；`meta.showTabBar` 控制 TabBar；公开页白名单。Worker 已做 SPA fallback，web history 可正常工作。

### 5.6 指令插件
- `v-headicon`（头像懒加载解码）、`v-content`（内容渲染+媒体+视频），移植 wxt 逻辑，去除 `browser.*`。

### 5.7 配置页（镜像源）
- `SettingsView` 增加“后端地址/镜像源”输入框 + 保存（持久化到 `settings` store → localStorage），展示当前生效地址。
- `LoginView` 移除原代理弹窗，统一到设置页配置。

### 5.8 删除 wxt 专属
- `getCurrentTab`、`cookiesGet`、`sendMessage`(runtime)、`openTabWithImages/openTabWithUrl`（扩展新标签页），改为应用内 `/image-viewer` 路由或 modal。

---

## 6. Worker 代理增强（支持镜像源）

`worker.ts` `proxyApi`：
- 读取请求头 `X-Backend`（由前端在配置了镜像源时携带）；若存在且为合法 https 域名则作为代理目标，否则回退 `env.HAIJIAO_API_BASE`。
- 保留 `/api/proxy-image` 端点（转发 `.txt` 密文），同样支持镜像源。
- 维持 cookie 转发与 CORS 头注入。
- `wrangler.toml` 保留 `HAIJIAO_API_BASE` 默认值 `https://haijiao.com`。

---

## 7. 开发联调（不使用 vite proxy）

- 删除 vite `server.proxy` 配置（用户明确要求不使用）。
- 开发时通过 `wrangler dev`（本地 Worker 提供 `/api` 代理）联调；或在设置页将“镜像地址”指向已部署的 Worker / 可访问后台。
- 浏览器不再直连后端，`npm run dev` 仅作静态页面服务。

---

## 8. 实施步骤（原子提交）

1. 删除 `src/` 全部文件（保留根目录配置）。
2. 依赖与配置：安装 `dplayer`、`hls.js`、`pinia-plugin-persistedstate`；确认 `vite.config.ts` 不含 server.proxy、`tailwind`/`scss` 就绪。
3. `types/index.ts` + `utils/image.ts`（cipher）。
4. `api/request.ts`（含镜像源 `X-Backend`、视频、登录、列表 API）。
5. 模块化 `stores/`（settings/user/homepage/hot）。
6. `plugins/`（headicon、content+DPlayer）、`components/`。
7. `views/` + `router/` + `App.vue` + `main.ts`。
8. 镜像源设置 UI（`SettingsView`/`LoginView`/`useProxyConfig`）。
9. `worker.ts` 支持 `X-Backend` 镜像源。
10. 验证：`npm run build`（含 vue-tsc）、`wrangler dev` 联调。
11. 文档：本方案写入 `docs/plans/05-*.md`；同步更新 `AGENTS.md`、`README.md`、`CHANGELOG.md`、API 参考（视频/镜像源章节）。

---

## 9. 风险与注意

- wxt `loadVideoSrc` 原使用 `browser.storage 'user'`（从未写入），重建时统一用 `settings`/`user` store 的 uid/token；视频请求头 `X-User-Id`/`X-User-Token` 由 Worker 服务端注入（浏览器无法跨域携带凭证）。
- 交互逻辑中出现的 `browser.*` 全部移除，图片/视频 `.txt` 与 API 一律经 Worker 代理，避免 CORS。
- `content.ts` 的 `LOADING_URL` 缺失导入 bug 在重建时修复。
- 登录 Sign 算法 `MD5(username+password+UA)` 沿用现有实现。
- 不使用 vite `server.proxy`；后端地址在配置页动态配置，经 `X-Backend` 头透传至 Worker。
