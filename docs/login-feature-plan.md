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
  "Sign": "<MD5(Username + Password + UserAgent) - 32位小写hex>"
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
  "customerService": "customer@example.com",
  "domain": "https://api.example.com",
  "domainAbroad": "https://abroad.example.com",
  "ref": "",
  "token": "<32位hex令牌>",
  "type": 3,
  "user": {
    "id": 100000000001,
    "nickname": "用户_nickname",
    "avatar": "1",
    "description": "...",
    "topicCount": 0,
    "videoCount": 0,
    "commentCount": 0,
    "fansCount": 0,
    "favoriteCount": 0,
    "username": "username_example",
    "email": "user@example.com",
    "createTime": "2020-01-01 00:00:00",
    "lastLoginTime": "2020-01-01 00:00:00",
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

## 3. Sign 算法分析（已确认）

### 3.1 算法

```
Sign = MD5(Username + Password + navigator.userAgent)
```

- 哈希库：**js-md5 v0.7.3**（[emn178/js-md5](https://github.com/emn178/js-md5)）
- 输出：32 位小写十六进制字符串
- 输入为三个值的直接拼接：`Username`（明文邮箱/用户名）+ `Password`（明文密码）+ `navigator.userAgent`（浏览器 UA），无分隔符、无盐值

### 3.2 逆向分析过程

#### 3.2.1 定位 Sign 生成代码

在 haijiao.com 生产环境编译的 Webpack 包中定位登录模块。

**入口文件** `app.js:6533`：
```javascript
this.form.Sign = n()(this.form.Username + this.form.Password + navigator.userAgent);
```

**模块注册** `app.js:6422-6427`：
```javascript
d932: function(e, t, a) {
    var i = a("8237")    // 加载模块 8237
      , n = a.n(i)        // a.n = webpack 工具函数，获取模块的默认导出
      , o = a("21e4")     // login API 模块
      , r = a("6b26")     // storage 工具模块
      , s = a("dafe");    // 其他依赖
```

代码逻辑：
1. `a("8237")` → 加载模块 ID 为 `8237` 的代码
2. `a.n(i)` → 调用 webpack 的 `__webpack_require__.n`，返回一个 getter 函数 `function() { return i }`
3. `n()` → 执行 getter，返回模块 `8237` 的导出值（即 MD5 函数本身）
4. `n()(concatStr)` → 调用 MD5 函数，计算拼接字符串的哈希值

#### 3.2.2 定位哈希库

模块 `8237` 位于 `chunk-vendors.a4a98f51.js:18787`，完整内容为 **js-md5 v0.7.3**。

关键导出逻辑：
```javascript
// 第 18818-18832 行
createMethod = function() {
    var t = createOutputMethod("hex");  // 默认 hex 输出
    t.create = function() { return new Md5 }
    t.update = function(e) { return t.create().update(e) }
    for (var e = 0; e < OUTPUT_TYPES.length; ++e) {
        t[OUTPUT_TYPES[e]] = createOutputMethod(OUTPUT_TYPES[e])
    }                                      // 支持 hex/array/digest/buffer/arrayBuffer/base64
    return t                               // t(str) 直接返回 MD5 hex 字符串
}
```

#### 3.2.3 调用链总结

| 层级 | 代码 | 说明 |
|------|------|------|
| Webpack 模块 ID | `"8237"` | chunk-vendors 中的 js-md5 库 |
| 导出函数 | `createMethod()` | 返回 `function(str) → MD5 hex string` |
| webpack 工具 | `a.n(i)` | 返回 getter `() → i` |
| 最终调用 | `n()(concatStr)` | 等价于 `md5(Username + Password + UserAgent)` |

#### 3.2.4 验证方式

```
MD5("testuser" + "testpass" + "Mozilla/5.0 ...") = <Sign 值>
```

在浏览器控制台可验证：从 `chunk-vendors` 包中可提取 `md5` 函数，传入相同参数对比结果。

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

前置依赖：
```bash
npm install js-md5
npm install -D @types/js-md5
```

新增登录函数：

```typescript
import md5 from 'js-md5'

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
  const sign = generateSign(params.username, params.password)

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

// MD5(Username + Password + navigator.userAgent)
function generateSign(username: string, password: string): string {
  const raw = username + password + navigator.userAgent
  return md5(raw)
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
│  │ UID: 1000000...    │  │
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
| 1 | 确认 Sign 生成算法 | ✅ 已完成 |
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
| **Sign 生成算法** | ✅ 已确认 | MD5(Username + Password + UserAgent)，js-md5 v0.7.3 |
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
