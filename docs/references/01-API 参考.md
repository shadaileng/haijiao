# API 参考

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 04 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-10 |
> | 对应内容 | 所有 API 端点定义、参数、响应 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-10 | v1.0.0 | 初版，基于代码和参考分析整理 |

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

直连请求仅用于图片 `.txt` 密文（经 Worker `/api/proxy-image` 代理）：

```
/api/proxy-image?url=<.txt 完整或相对地址>
```

### 1.2 通用请求头

| 头 | 值 | 说明 |
|:---|:----|------|
| `Content-Type` | `application/json` | 所有 API 请求 |
| `X-User-Id` | `{uid}` | 需认证的接口 |
| `X-User-Token` | `{token}` | 需认证的接口 |

### 1.3 通用响应格式

```typescript
interface ApiResult<T = any> {
  success: boolean        // 是否成功
  data: T | string        // 数据（加密时返回 string）
  isEncrypted?: boolean   // data 是否加密
  message?: string        // 错误消息
}
```

加密数据经过三层 Base64 解码后 JSON.parse 得到原始数据。

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

## 4. 用户/关注 API

### 4.1 获取关注列表

| 项目 | 值 |
|------|-----|
| **函数** | `getFollowList(token, uid)` |
| **URL** | `GET /api/user/favorite/users` |
| **请求头** | `X-User-Id: {uid}`、`X-User-Token: {token}` |
| **响应** | `FollowUser[]` |

---

## 5. 视频 API

### 5.1 加载视频源

| 项目 | 值 |
|------|-----|
| **函数** | `loadVideoSrc(id, resourceId)` |
| **URL** | `POST /api/attachment`（经 Worker 代理） |
| **请求头** | `X-Backend: <镜像源>`、`X-User-Id`、`X-User-Token` |
| **请求体** | `{ id, resource_id, resource_type: "topic", line: "normal1" }` |
| **响应** | 视频信息（含 `remoteUrl` m3u8、`keyPath` 等） |
| **播放** | 前端用 DPlayer + hls.js 加载 `remoteUrl`（customHls） |

---

## 6. 图片 API

### 6.1 处理图片

| 项目 | 值 |
|------|-----|
| **函数** | `processImages(items)` |
| **说明** | 批量获取图片并执行自定义 Base64 解码（`customDecode`） |
| **字符集** | `ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890` |

---

## 7. 未实现端点（参考代码中发现）

以下端点已在 `app.js` 模块 `1f24` 和 `21e4` 中发现，尚未在当前项目中实现：

| 端点 | 方法 | 用途 | 方案 |
|:-----|:----:|------|:----|
| `/user/user_sign_in` | POST | 每日签到 | 02 §1 |
| `/user/current` | GET | 获取当前用户信息 | 02 §5 |
| `/user/fans` | GET | 粉丝列表 | 02 §4 |
| `/favorite/add` | GET | 收藏帖子 | 02 §3 |
| `/favorite/delete` | GET | 取消收藏 | 02 §3 |
| `/user/favorite` | GET | 收藏列表 | 02 §3 |
| `/tag/tags` | GET | 获取标签 | 02 §7 |
| `/captcha/request` | GET | 获取验证码 | 02 §6 |
| `/captcha/isNeed` | GET | 检查是否需要验证码 | 02 §6 |
| `/login/signup` | POST | 注册 | 02 §11 |
| `/user/password/find` | POST | 找回密码 | 02 §11 |
| `/user/password/reset` | POST | 重置密码 | 02 §11 |
| `/vip/querySaleTopicStatus` | GET | VIP 销售状态 | 02 §10 |
| `/vip/getNumber` | GET | VIP 数量 | 02 §10 |
| `/vip/queryFreeNum` | GET | 免费 VIP 数量 | 02 §10 |
| `/vip/queryDisCardNum` | GET | 丢弃卡数量 | 02 §10 |
| `/chat/message` | POST | 发送私信 | — |
| `/topic/create` | POST | 创建帖子 | — |
| `/topic/edit` | POST | 编辑帖子 | — |

> 详见 [02-功能新增与改善方案.md](../plans/02-功能新增与改善方案.md)

---

## 8. 环境变量

| 变量 | 类型 | 默认值 | 说明 |
|-----|:----:|:------:|------|
| `HAIJIAO_API_BASE` | string | `https://haijiao.com` | Cloudflare Worker 环境变量，默认后端域名 |

---

## 9. 代理配置

### Cloudflare Worker（worker.ts）

```
/api/*    → 后端（X-Backend 指定镜像源，否则 HAIJIAO_API_BASE）   （添加 CORS 头）
/api/proxy-image?url=...  → 后端 .txt 密文                      （添加 CORS 头）
非 /api 路径 → index.html                                              （SPA 回落）
```

### 镜像源（X-Backend）

前端在 `settings` store 配置 `apiBase`，请求时携带 `X-Backend: <apiBase>`；Worker 校验为合法 https 域名后作为代理目标，否则回退 `HAIJIAO_API_BASE`。

### 开发代理（vite.config.ts）

生产不使用 vite `server.proxy`：`npm run dev` 默认仅作静态页面服务，后端经已部署 Worker 或 `npm run cf:dev` 本地代理。本地 E2E 测试（`npm run test:e2e`）会临时启用 `vite.config.ts` 的 `server.proxy`，由其 `router` 读取请求头 `X-Backend`（即配置页「数据源字段」）动态转发到镜像源，与生产 Worker 行为对齐，且仅 `npm run dev` 生效、不进入 `dist/` 产物。
/api/* → https://{HAIJIAO_API_BASE}/*   （添加 CORS 头）
非 /api 路径 → index.html                （SPA 回落）
```

### 开发代理（vite.config.ts）

```
/api/* → https://haijiao.com/*
```
