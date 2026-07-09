# 登录功能实施方案

## 1. 需求分析

当前应用需要用户手动在设置页面输入 UID 和 Token 来配置认证信息。本方案旨在实现自动登录功能，用户只需输入邮箱/用户名和密码即可完成认证。

### 1.1 现有认证流程

```
用户手动输入 UID + Token → 保存到 localStorage → API 请求携带 X-User-Id / X-User-Token
```

### 1.2 目标认证流程

```
用户输入 邮箱/用户名 + 密码 → 调用登录 API → 自动获取 UID + Token → 保存到 localStorage
```

---

## 2. API 分析

### 2.1 登录接口

| 项目 | 值 |
|------|-----|
| **URL** | `POST https://haijiao.com/api/login/signin` |
| **Content-Type** | `application/json` |
| **pcver** | `2` (请求头) |
| **credentials** | `omit` |

### 2.2 请求体

```json
{
  "Username": "user@example.com",
  "Password": "plaintext_password",
  "CaptchaCode": "",
  "CaptchaId": "",
  "Ref": "",
  "Sign": "<MD5 hash - 算法待确认>"
}
```

### 2.3 响应体

```json
{
  "isEncrypted": true,
  "errorCode": 0,
  "message": "",
  "success": true,
  "data": "<三重 Base64 编码的加密数据>"
}
```

### 2.4 解密后的响应数据

```json
{
  "customerService": "haijiao2029@proton.me",
  "domain": "https://hj260602583.top",
  "domainAbroad": "https://www.haijiao.com",
  "ref": "",
  "token": "2663195d7c93485fab60f5c64c56a712",
  "type": 3,
  "user": {
    "id": 168149806501,
    "nickname": "海角_168149806501",
    "avatar": "53",
    "description": "...",
    "topicCount": 0,
    "videoCount": 0,
    "commentCount": 22,
    "fansCount": 240,
    "favoriteCount": 98,
    "username": "shaqpf0510",
    "email": "qpf0510@qq.com",
    "createTime": "2023-04-15 02:47:45",
    "lastLoginTime": "2026-07-09 21:27:29",
    ...
  },
  "vip_domain": ""
}
```

### 2.5 关键字段映射

| 响应字段 | 用途 | 存储键 |
|----------|------|--------|
| `user.id` | 用户唯一标识，作为 API 认证的 UID | `uid` |
| `token` | 认证令牌，用于 X-User-Token | `token` |
| `user.nickname` | 用户昵称，用于界面展示 | `nickname` |
| `domain` | 可能需要更新的 API 域名 | `apiBase` |

---

## 3. Sign 算法分析（待确认）

### 3.1 已知信息

- Sign 值为 32 位十六进制字符串，符合 MD5 格式
- 示例 Sign：`abc75ee95c22c79294b5ea6d70139cca`

### 3.2 已尝试的组合（均不匹配）

| 尝试方式 | 结果 |
|----------|------|
| `MD5(password)` | `3f84528597a5d8dc46b8b82f6b8f20dd` ❌ |
| `MD5(username)` | `652394f366a7bbb08f0c68b21f1515f4` ❌ |
| `MD5(username + password)` | `13422575e92e2684ba4cb43f61fd36d7` ❌ |
| `MD5(password + username)` | `dd1d562e829665c9a2b0bc2cad327ed8` ❌ |
| `MD5(password + salt)` 各种盐值 | 均不匹配 ❌ |
| `HMAC-MD5` | 均不匹配 ❌ |

### 3.3 需要用户提供

**请提供 Sign 的生成算法**，例如：
- `MD5(password)`
- `MD5(password + 固定盐值)`
- `HMAC-MD5(key, message)` 的具体参数
- 或者提供 haijiao.com 客户端 JavaScript 中生成 Sign 的代码片段

---

## 4. 实施方案

### 4.1 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/api/request.ts` | 修改 | 新增 `login()` 函数 |
| `src/stores/user.ts` | 修改 | 新增 `nickname`、`loginFromApi()`、`logout()` |
| `src/views/LoginView.vue` | **新建** | 登录页面 |
| `src/views/SettingsView.vue` | 修改 | 显示登录状态、退出按钮 |
| `src/views/HomeView.vue` | 修改 | 显示用户昵称 |
| `src/router/index.ts` | 修改 | 新增 `/login` 路由、路由守卫 |
| `src/types/index.ts` | 修改 | 新增 `LoginResponse` 类型 |

### 4.2 API 层变更 (`src/api/request.ts`)

新增登录函数：

```typescript
interface LoginParams {
  username: string
  password: string
  captchaCode?: string
  captchaId?: string
  ref?: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    nickname: string
    avatar: string
    email: string
    username: string
    [key: string]: any
  }
  domain: string
  domainAbroad: string
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const sign = generateSign(params.password) // 待实现
  
  return request({
    url: '/login/signin',
    method: 'POST',
    body: {
      Username: params.username,
      Password: params.password,
      CaptchaCode: params.captchaCode || '',
      CaptchaId: params.captchaId || '',
      Ref: params.ref || '',
      Sign: sign,
    },
    headers: {
      'pcver': '2',
    },
  })
}

// 待确认 - Sign 生成算法
function generateSign(password: string): string {
  // TODO: 实现 Sign 生成逻辑
  // 需要用户提供算法
  throw new Error('Sign algorithm not implemented')
}
```

### 4.3 Store 变更 (`src/stores/user.ts`)

新增字段和方法：

```typescript
// 新增状态
const nickname = ref('')

// 新增方法
function loginFromApi(data: LoginResponse) {
  uid.value = String(data.user.id)
  token.value = data.token
  nickname.value = data.user.nickname
  // 如果返回了新的域名，更新 apiBase
  if (data.domain) {
    apiBase.value = new URL(data.domain).host
  }
  saveUser()
}

function logout() {
  uid.value = ''
  token.value = ''
  nickname.value = ''
  saveUser()
}

// saveUser 增加 nickname
function saveUser() {
  localStorage.setItem('haijiao_user', JSON.stringify({
    uid: uid.value,
    token: token.value,
    apiBase: apiBase.value,
    nickname: nickname.value,
  }))
}

// loadFromStorage 增加 nickname
// ...
```

### 4.4 登录页面 (`src/views/LoginView.vue`)

页面结构：

```
┌─────────────────────────┐
│      海角助手 - 登录      │  ← NavBar
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │ 邮箱/用户名        │  │  ← Field
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 密码               │  │  ← Field (type=password)
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │     登  录         │  │  ← Button (primary)
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │  手动配置 UID/Token │  │  ← Button (default)
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

交互流程：

1. 用户输入邮箱/用户名和密码
2. 点击"登录" → 显示 loading
3. 调用 `login()` API
4. 成功 → 调用 `store.loginFromApi(data)` → 跳转首页
5. 失败 → Toast 显示错误信息
6. "手动配置"按钮 → 跳转 `/settings`

### 4.5 路由守卫 (`src/router/index.ts`)

```typescript
import { useUserStore } from '@/stores/user'

const publicPages = ['Login', 'Settings', 'ImageViewer']

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  
  if (store.isLoggedIn || publicPages.includes(to.name as string)) {
    next()
  } else {
    next({ name: 'Login' })
  }
})
```

### 4.6 设置页面变更 (`src/views/SettingsView.vue`)

已登录状态：

```
┌─────────────────────────┐
│        设置              │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ ✅ 已登录          │  │
│  │ 昵称: 海角_xxx     │  │
│  │ UID: 1681498...    │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │     退出登录       │  │  ← Button (danger)
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │   数据源设置       │  │  ← 折叠面板
│  │   高级配置         │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### 4.7 首页变更 (`src/views/HomeView.vue`)

已登录时在状态区域显示用户昵称。

---

## 5. 类型定义 (`src/types/index.ts`)

```typescript
export interface LoginParams {
  username: string
  password: string
  captchaCode?: string
  captchaId?: string
  ref?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    nickname: string
    avatar: string
    email: string
    username: string
    description: string
    topicCount: number
    commentCount: number
    fansCount: number
    favoriteCount: number
    createTime: string
    lastLoginTime: string
    [key: string]: any
  }
  domain: string
  domainAbroad: string
  customerService: string
  ref: string
  type: number
  vip_domain: string
}
```

---

## 6. 实施步骤

| 步骤 | 任务 | 依赖 |
|:---:|------|------|
| 1 | 确认 Sign 生成算法 | **需要用户输入** |
| 2 | 更新 `types/index.ts` 新增类型定义 | 无 |
| 3 | 更新 `api/request.ts` 新增 `login()` 函数 | 步骤 1, 2 |
| 4 | 更新 `stores/user.ts` 新增登录状态管理 | 步骤 2 |
| 5 | 创建 `views/LoginView.vue` 登录页面 | 步骤 3, 4 |
| 6 | 更新 `router/index.ts` 添加路由和守卫 | 步骤 5 |
| 7 | 更新 `views/SettingsView.vue` 显示登录状态 | 步骤 4 |
| 8 | 更新 `views/HomeView.vue` 显示用户昵称 | 步骤 4 |
| 9 | 构建验证 | 步骤 3-8 |
| 10 | 更新文档 (README, AGENTS, CHANGELOG) | 步骤 9 |

---

## 7. 阻塞项

| 项目 | 状态 | 说明 |
|------|:---:|------|
| **Sign 生成算法** | ❌ 未解决 | 需要用户提供 MD5 哈希的具体输入格式和盐值 |
| 响应解密逻辑 | ✅ 已确认 | 三重 Base64 解码 + UTF-8 转换 |
| 字段映射 | ✅ 已确认 | `user.id` → `uid`，`token` → `token` |
| API 域名处理 | ⚠️ 待确认 | 响应中的 `domain` 字段是否需要更新 `apiBase` |

---

## 8. 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Sign 算法无法获取 | 无法实现登录 | 保留手动配置 UID/Token 作为备选 |
| 登录 API 可能有频率限制 | 用户被临时封禁 | 添加 loading 状态防止重复提交 |
| Token 过期 | 已保存的凭证失效 | 监听 401 响应，引导用户重新登录 |
| 域名变更 | API 请求失败 | 使用响应中的 `domain` 动态更新 |
