# API 参考

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 04 |
> | 文档版本 | v1.4.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-08-03 |
> | 对应内容 | 所有 API 端点定义、参数、响应 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-08-03 | v1.4.0 | 修复 getFollowList 参数、signIn 描述、补充已实现端点清单 |
> | 2026-08-03 | v1.3.0 | 修复 signIn 错误静默问题，更新已实现端点清单 |
> | 2026-07-31 | v1.2.0 | 添加 getTaskStatus API，修正签到状态判断逻辑 |
> | 2026-07-12 | v1.1.0 | 移除 proxy-image 引用、添加 toCamelCase 说明、修复重复章节 |
> | 2026-07-10 | v1.0.0 | 初版，基于代码和参考分析整理 |
>
> **关联文档**：[01-架构概览.md](../architecture/01-架构概览.md)（请求流程）· [02-数据字典.md](./02-数据字典.md)（类型定义）· [01-登录功能实施方案.md](../plans/01-登录功能实施方案.md)（登录流程）

---

## 1. 通用说明

### 1.1 请求路径

所有 API 通过 Cloudflare Worker 代理，前端请求路径格式：

```
/api/{path}  →  Worker  →  https://{后端}/{path}
```

默认后端为 `HAIJIAO_API_BASE`（env，默认 `https://haijiao.com`）。配置自定义镜像源时，前端在请求头携带 `X-Backend: <镜像源>`，Worker 据此将 `/api/**` 代理到该镜像源；未携带或非法值时回退 `HAIJIAO_API_BASE`。

> 不再使用 vite `server.proxy`：前端所有请求走同源 `/api`，由 Worker 代理，避免浏览器直连触发 CORS。

图片直连请求（`loadImg`）直接 fetch 原始 URL 获取加密字符串，经 `customDecode()` 解码。

### 1.2 通用请求头

| 头 | 值 | 说明 |
|:---|:----|------|
| `Content-Type` | `application/json` | POST/PUT 请求 |
| `X-User-Id` | `{uid}` | 需认证的接口 |
| `X-User-Token` | `{token}` | 需认证的接口 |
| `X-Backend` | `{镜像源域名}` | Worker 代理目标 |

### 1.3 通用响应格式

```typescript
interface ApiResult<T = any> {
  success: boolean        // 是否成功
  data: T | string        // 数据（加密时返回 string）
  isEncrypted?: boolean   // data 是否加密
  errorCode?: number      // 错误码（0=成功）
  message?: string        // 错误消息
}
```

加密数据经过三层 Base64 解码后 JSON.parse 得到原始数据。snake_case 字段自动转换为 camelCase。

### 1.4 函数调用约定

所有 API 函数通过 `src/api/request.ts` 导出，调用方式：

```typescript
import { getTopic } from '@/api/request'
const data = await getTopic('12345')
```

---

## 2. 帖子 API

### 2.1 获取帖子详情

| 项目 | 值 |
|------|-----|
| **函数** | `getTopic(topicId)` |
| **URL** | `GET /api/topic/{topicId}` |
| **参数** | `topicId: string`（路径参数） |
| **认证** | 否 |
| **响应** | `TopicItem`（含 attachments 数组） |

### 2.2 获取帖子附件

| 项目 | 值 |
|------|-----|
| **函数** | `getTopicAttachments(topicId)` |
| **说明** | 包装 `getTopic()`，额外解析视频附件信息 |
| **响应** | `AttachmentItem[]` |

### 2.3 获取帖子列表（用户）

| 项目 | 值 |
|------|-----|
| **函数** | `getUserTopics(userId, page, limit?)` |
| **URL** | `GET /api/topic/node/topics` |
| **参数** | `userId: string`、`page: number`、`limit: number`（默认15） |
| **认证** | 否 |
| **响应** | `TopicListResponse` |

### 2.4 搜索帖子

| 项目 | 值 |
|------|-----|
| **函数** | `searchTopics(key, page, nodeId?)` |
| **URL** | `GET /api/topic/searchV2` |
| **参数** | `key: string`、`page: number`、`node_id: number`（默认0） |
| **认证** | 否 |
| **响应** | `SearchResponse` |

---

## 3. 认证 API

### 3.1 登录

| 项目 | 值 |
|------|-----|
| **函数** | `login(params)` |
| **URL** | `POST /api/login/signin` |
| **请求头** | `pcver: 2` |
| **请求体** | `LoginParams`（Username、Password、Sign、CaptchaCode/CaptchaId/Ref 可选） |
| **认证** | 否 |
| **响应** | `LoginResponse` |

> 详见 [01-登录功能实施方案.md](../plans/01-登录功能实施方案.md) §2-3

### 3.2 Sign 生成算法

```
Sign = MD5(Username + Password + navigator.userAgent)
```

使用 `js-md5` 库，输出 32 位小写 hex。

---

## 4. 任务 API

### 4.1 获取任务状态

| 项目 | 值 |
|------|-----|
| **函数** | `getTaskStatus()` |
| **URL** | `GET /api/task/getTaskStatus` |
| **认证** | 否 |
| **响应** | `TaskStatus`（含 `goldSignIn.status` 等） |

**状态语义：**
- `status: true` = 可以执行（任务未完成，按钮可点击）
- `status: false` = 已完成（任务已完成，按钮禁用）

**注意：** `goldSignIn.status` 字段语义与其他任务（如 `vipChat`）相反，是设计特性，不是 bug。

### 4.2 每日签到

| 项目 | 值 |
|------|-----|
| **函数** | `signIn()` |
| **URL** | `POST /api/user/user_sign_in` |
| **认证** | 是（X-User-Id + X-User-Token） |
| **响应** | `SignInResult` |

> 注意：`api.signIn()` 不捕获异常，调用方需自行 try/catch 处理错误。

---

## 5. 用户/关注 API

### 5.1 获取关注列表

| 项目 | 值 |
|------|-----|
| **函数** | `getFollowList()` |
| **URL** | `GET /api/user/favorite/users` |
| **认证** | 自动（X-User-Id + X-User-Token 由 getAuthHeaders 注入） |
| **响应** | `FollowUser[]` |

---

## 6. 视频 API

### 6.1 加载视频源

| 项目 | 值 |
|------|-----|
| **函数** | `loadVideoSrc(id, resourceId)` |
| **URL** | `POST /api/attachment`（经 Worker 代理） |
| **请求头** | `X-Backend: <镜像源>`、`X-User-Id`、`X-User-Token` |
| **请求体** | `{ id, resource_id, resource_type: "topic", line: "normal1" }` |
| **响应** | 视频信息（含 `remoteUrl` m3u8、`keyPath` 等） |
| **播放** | 前端用 DPlayer + hls.js 加载 `remoteUrl`（customHls） |

---

## 7. 图片 API

### 7.1 处理图片

| 项目 | 值 |
|------|-----|
| **函数** | `loadImg(url)` |
| **说明** | 直连 fetch 原始 URL 获取加密字符串，执行自定义 Base64 解码（`customDecode`） |
| **字符集** | `ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890` |
| **返回** | `Promise<string>` data URI |

---

## 8. 已实现端点

以下端点已在 `src/api/request.ts` 中实现：

| 端点 | 方法 | 用途 | 实现位置 |
|:-----|:----:|------|:---------|
| `/topic/{topicId}` | GET | 获取帖子详情 | `getTopic()` |
| `/topic/node/topics` | GET | 获取用户帖子列表 | `getUserTopics()` |
| `/topic/searchV2` | GET | 搜索帖子 | `searchTopics()` |
| `/topic/nodes_by_ver/v2` | GET | 获取板块列表 | `getNodes()` |
| `/tag/tags` | GET | 获取标签 | `getTags()` |
| `/attachment` | POST | 获取视频资源地址 | `loadVideoSrc()` |
| `/comment/reply_list` | GET | 获取评论列表 | `getComments()` |
| `/user/current` | GET | 获取当前用户信息 | `getCurrentUser()` |
| `/user/user_sign_in` | POST | 每日签到 | `signIn()` |
| `/user/wealth` | GET | 获取用户财富信息 | `wealth()` |
| `/user/favorite/users` | GET | 获取关注列表 | `getFollowList()` |
| `/user/favorite` | POST | 关注用户 | `addFollow()` |
| `/user/favorite` | DELETE | 取消关注 | `cancelFollow()` |
| `/favorite/v2/add` | GET | 收藏帖子 | `addFavorite()` |
| `/favorite/v2/delete` | GET | 取消收藏 | `delFavorite()` |
| `/favorite/v2/check` | GET | 检查收藏状态 | `checkFavorite()` |
| `/favorite/v2/folderList` | GET | 获取收藏夹列表 | `getFavoriteFolders()` |
| `/favorite/v2/topics` | GET | 获取收藏帖子列表 | `getFavoriteTopics()` |
| `/task/getTaskStatus` | GET | 获取任务状态 | `getTaskStatus()` |
| `/login/signin` | POST | 用户登录 | `login()` |

> 详见 [02-功能新增与改善方案.md](../plans/02-功能新增与改善方案.md)

---

## 9. 环境变量

| 变量 | 类型 | 默认值 | 说明 |
|-----|:----:|:------:|------|
| `HAIJIAO_API_BASE` | string | `https://haijiao.com` | Cloudflare Worker 环境变量，默认后端域名 |

---

## 10. 代理配置

### Cloudflare Worker（worker.ts）

```
/api/*    → 后端（X-Backend 指定镜像源，否则 HAIJIAO_API_BASE）   （添加 CORS 头）
非 /api 路径 → index.html                                              （SPA 回落）
```

### 镜像源（X-Backend）

前端在 `settings` store 配置 `apiBase`，请求时携带 `X-Backend: <apiBase>`；Worker 校验为合法 https 域名后作为代理目标，否则回退 `HAIJIAO_API_BASE`。

### 开发代理（vite.config.ts）

生产不使用 vite `server.proxy`：`pnpm run dev` 默认仅作静态页面服务，后端经已部署 Worker 或 `pnpm run cf:dev` 本地代理。本地 E2E 测试（`pnpm run test:e2e`）会临时启用 `vite.config.ts` 的自定义中间件插件，读取请求头 `X-Backend`（即配置页「数据源字段」）动态转发到镜像源，与生产 Worker 行为对齐，且仅 `pnpm run dev` 生效、不进入 `dist/` 产物。

本地 E2E 代理通过 Vite 插件的 `configureServer` 钩子注入自定义中间件，直接用 `node:https` 模块发请求，完全控制代理行为。
