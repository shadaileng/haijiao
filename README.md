# 海角助手

基于 Vue 3 + Vant 4 + Cloudflare Workers 的移动端 Web 应用，提供海角社区浏览、搜索和用户管理功能。

## 功能特性

| 功能 | 描述 |
|------|------|
| **帖子详情** | 输入帖子 ID 查看帖子内容、附件和资源 |
| **搜索帖子** | 按关键字搜索帖子，支持分页浏览 |
| **用户帖子** | 输入用户 ID 查看该用户发布的所有帖子 |
| **用户登录** | 支持邮箱/用户名 + 密码登录，自动获取认证信息 |
| **关注列表** | 输入 UID 和 Token 加载关注用户列表 |
| **图片查看** | 全屏查看帖子中的图片资源 |
| **离线缓存** | 本地存储缓存帖子、用户和搜索记录 |

## 技术栈

- **前端框架**: Vue 3.5 + TypeScript 5.6
- **UI 组件库**: Vant 4.9 (移动端)
- **状态管理**: Pinia 2.2
- **路由**: Vue Router 4.4
- **构建工具**: Vite 6.0
- **部署**: Cloudflare Workers
- **CSS**: Tailwind CSS 3.4 + Sass

## 项目结构

```
haijiao/
├── worker.ts              # Cloudflare Worker 入口（API 代理）
├── wrangler.toml          # Cloudflare Workers 配置
├── vite.config.ts         # Vite 构建配置
├── tailwind.config.js     # Tailwind CSS 配置
├── postcss.config.js      # PostCSS 配置
├── index.html             # 入口 HTML
├── tsconfig.json          # TypeScript 配置
├── tsconfig.node.json     # TS Node 配置
├── src/
│   ├── main.ts            # Vue 应用入口
│   ├── App.vue            # 根组件
│   ├── api/               # API 请求层
│   │   └── request.ts     # HTTP 请求封装、加密数据处理
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 接口类型声明
│   ├── stores/            # Pinia 状态管理
│   │   └── user.ts        # 用户状态、缓存管理
│   ├── composables/       # 组合式函数
│   │   ├── useClipboard.ts # 剪贴板操作
│   │   └── useLoading.ts   # 加载状态管理
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.vue  # 主布局
│   ├── assets/            # 静态资源
│   ├── styles/            # 全局样式
│   │   └── global.scss    # 全局 SCSS 变量和重置
│   ├── views/             # 页面级组件
│   │   ├── HomeView.vue    # 首页（功能导航）
│   │   ├── TopicView.vue   # 帖子详情页
│   │   ├── UserView.vue    # 用户帖子页
│   │   ├── FollowView.vue  # 关注列表页
│   │   ├── SearchView.vue  # 搜索页
│   │   ├── LoginView.vue   # 登录页
│   │   ├── SettingsView.vue # 设置页
│   │   └── ImageViewerView.vue # 图片查看页
│   └── router/            # 路由配置
│       └── index.ts        # 路由定义
└── dist/                  # 构建产物
└── docs/                  # 项目文档
    ├── login-feature-plan.md  # 登录功能实现计划
    └── reference/         # 参考资料
```

## API 接口

应用通过 Cloudflare Worker 代理请求到 `haijiao.com`，避免 CORS 问题。

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/topic/{topicId}` | GET | 获取帖子详情 |
| `/api/attachment` | POST | 获取视频资源地址 |
| `/api/user/favorite/users` | GET | 获取关注列表 |
| `/api/topic/node/topics` | GET | 获取用户帖子列表 |
| `/api/topic/searchV2` | GET | 搜索帖子 |
| `/api/login/signin` | POST | 用户登录 |

### 认证方式

部分接口需要在请求头中携带认证信息：

```
X-User-Id: {uid}
X-User-Token: {token}
```

认证信息可通过登录接口（`POST /api/login/signin`）自动获取，也可在设置页面手动配置。

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `HAIJIAO_API_BASE` | `https://haijiao.com` | 后端 API 地址 |

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 预览构建结果
npm run preview
```

### 构建部署

```bash
# 类型检查 + 构建
npm run build

# 部署到 Cloudflare Workers
npm run cf:deploy
```

### 本地 Worker 测试

```bash
npm run cf:dev
```

## 部署

### Cloudflare Workers

1. 注册 [Cloudflare](https://cloudflare.com) 账号
2. 安装 Wrangler CLI: `npm install -g wrangler`
3. 登录: `wrangler login`
4. 部署: `npm run cf:deploy`

### 静态托管

构建后的 `dist/` 目录可直接部署到任何静态托管服务：

```bash
npm run build
# 上传 dist/ 到你的 CDN/服务器
```

## 开发规范

- 使用 TypeScript 严格模式
- 组件采用 `<script setup>` 语法
- 使用 Pinia 进行状态管理
- 使用 Vant 4 移动端组件库
- CSS 使用 Tailwind CSS + SCSS 混合方案
- 包管理器使用 pnpm

## 许可证

MIT
