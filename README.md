# 海角助手

基于 Vue 3 + Vant 4 + Cloudflare Workers 的移动端 Web 应用，提供海角社区浏览、搜索和用户管理功能。

## 功能特性

| 功能 | 描述 |
|------|------|
| **帖子详情** | 输入帖子 ID 查看帖子内容、附件和资源 |
| **视频播放** | 帖子内视频通过 DPlayer + hls.js 内联播放 |
| **搜索帖子** | 按关键字搜索帖子，支持分页浏览 |
| **用户帖子** | 输入用户 ID 查看该用户发布的所有帖子 |
| **用户主页** | 查看用户信息、帖子列表，支持跳转关注列表 |
| **用户登录** | 支持邮箱/用户名 + 密码登录（MD5 签名） |
| **关注列表** | 查看关注用户列表 |
| **评论列表** | 帖子详情页显示评论，支持点击用户跳转主页 |
| **图片查看** | 全屏查看帖子中的图片资源（自定义 Base64 解码） |
| **离线缓存** | 本地存储缓存帖子、用户和搜索记录（Pinia 持久化） |

## 技术栈

- **前端框架**: Vue 3.5 + TypeScript 5.6
- **UI 组件库**: Vant 4.9 (移动端)
- **状态管理**: Pinia 2.2 + pinia-plugin-persistedstate
- **路由**: Vue Router 4.4 (createWebHistory)
- **构建工具**: Vite 6.0
- **部署**: Cloudflare Workers
- **视频播放**: DPlayer 1.27 + hls.js
- **CSS**: Tailwind CSS 3.4 + Sass
- **登录签名**: js-md5

## 项目结构

```
haijiao/
├── worker.ts              # Cloudflare Worker 入口（API 代理）
├── wrangler.toml          # Cloudflare Workers 配置
├── vite.config.ts         # Vite 构建配置（含本地 E2E 自定义中间件代理）
├── tailwind.config.js     # Tailwind CSS 配置
├── postcss.config.js      # PostCSS 配置
├── index.html             # 入口 HTML
├── tsconfig.json          # TypeScript 配置
├── tsconfig.node.json     # TS Node 配置
├── playwright.config.ts   # Playwright E2E 测试配置
├── opencode.json          # opencode AI 助手配置
├── package.json           # 项目依赖与脚本
├── src/
│   ├── main.ts            # Vue 应用入口
│   ├── App.vue            # 根组件（TabBar + overlay + back-top）
│   ├── assets/            # 静态资源
│   ├── api/               # API 请求层
│   │   └── request.ts     # HTTP 请求封装、加解密、snake→camel、视频/登录、api 对象
│   ├── types/             # TypeScript 类型定义
│   │   ├── index.ts       # 接口类型声明
│   │   └── shims.d.ts    # dplayer / .vue 模块声明
│   ├── stores/            # Pinia 模块化状态
│   │   ├── settings.ts    # 镜像源 apiBase / uid / token（持久化）
│   │   ├── user.ts        # 当前用户、关注列表缓存（持久化）
│   │   ├── homepage.ts    # 用户主页信息/帖子缓存
│   │   └── hot.ts         # 热门帖子缓存
│   ├── composables/       # 组合式函数
│   │   ├── useMirrorConfig.ts # 镜像源（数据源）配置
│   │   └── useClipboard.ts # 剪贴板操作
│   ├── plugins/           # 指令插件
│   │   ├── headicon.ts    # v-headicon 头像懒加载与解码
│   │   └── content.ts     # v-content 内容渲染 + 视频(DPlayer)
│   ├── components/        # 通用组件
│   │   ├── Topics.vue     # 帖子列表组件
│   │   ├── TopicContent.vue # 帖子内容渲染组件
│   │   ├── Comment.vue    # 评论列表组件
│   │   ├── UserInfo.vue   # 用户信息卡片组件
│   │   └── common/TabBar.vue # 底部导航栏
│   ├── utils/             # 工具
│   │   ├── image.ts       # 图片 loadImg + customDecode 解码
│   │   ├── transform.ts   # snake_case → camelCase 转换
│   │   ├── cipher.ts      # 自定义密码算法
│   │   └── constant.ts    # 常量（LOADING_URL 等）
│   ├── styles/            # 全局样式
│   │   └── global.scss    # 全局 SCSS 变量和重置
│   ├── views/             # 页面级组件
│   │   ├── HomeView.vue    # 重定向到 /hot
│   │   ├── HotTopicsView.vue # 热门（keep-alive）
│   │   ├── TopicView.vue   # 帖子详情（含视频 + 评论）
│   │   ├── UserView.vue    # 用户帖子页
│   │   ├── UserHomeView.vue # 用户主页（keep-alive）
│   │   ├── FollowView.vue  # 关注列表页
│   │   ├── SearchView.vue  # 搜索页（keep-alive）
│   │   ├── LoginView.vue   # 登录页
│   │   ├── SettingsView.vue # 设置页（镜像源/uid/token/当前用户）
│   │   └── ImageViewerView.vue # 图片查看页
│   └── router/            # 路由配置
│       └── index.ts       # 路由定义 + scrollBehavior
├── e2e/                   # Playwright 端到端测试
│   ├── config.ts          # 测试参数配置（mirrorDomain/凭据/videoPid）
│   ├── helpers.ts         # 测试辅助函数
│   ├── public.spec.ts     # 公开页规格
│   ├── auth.spec.ts       # 登录规格
│   ├── topic.spec.ts      # 帖子详情规格（视频+图片）
│   └── mirror.spec.ts     # 镜像源规格
├── docs/                  # 项目文档
│   ├── README.md          # 文档索引与执行总览
│   ├── _template.md       # 文档创建模板
│   ├── plans/             # 方案类文档
│   ├── architecture/      # 架构类文档
│   ├── references/        # 参考类文档
│   └── guides/            # 指南/手册类文档
├── .opencode/             # opencode 技能与配置
└── dist/                  # 构建产物
```

## 参考项目

`docs/reference/haijiao-wxt/` 是从 [Gitee - haijiao-wxt](https://gitee.com/shadaileng/haijiao-wxt.git) 下载的原始参考项目源码，用于分析和对比。该目录已加入 `.gitignore`，不纳入版本管理。

## API 接口

应用通过 Cloudflare Worker 代理请求到后端（代码默认 `https://haijiao.com`，但**该官方域名在国内被屏蔽**，实际须填写后台提供的可用镜像/数据源域名）。配置了镜像源时，请求携带 `X-Backend` 头告知 Worker 代理目标。

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/topic/{topicId}` | GET | 获取帖子详情 |
| `/api/attachment` | POST | 获取视频资源地址（m3u8） |
| `/api/user/favorite/users` | GET | 获取关注列表 |
| `/api/topic/node/topics` | GET | 获取用户帖子列表 |
| `/api/topic/searchV2` | GET | 搜索帖子 |
| `/api/comment/reply_list` | GET | 获取评论列表 |
| `/api/login/signin` | POST | 用户登录 |

### 认证方式

部分接口需要在请求头中携带认证信息：

```
X-User-Id: {uid}
X-User-Token: {token}
```

认证信息可通过登录接口（`POST /api/login/signin`）自动获取，也可在设置页面查看。

### 镜像源 / 数据源（X-Backend）

在设置页「镜像源（数据源地址）」填写后台提供的、国内可访问的镜像域名（如 `https://your-mirror.com`），前端请求会带上 `X-Backend: <地址>`，Worker 据此将 `/api/**` 代理到该镜像源；未配置时回退 `HAIJIAO_API_BASE` 环境变量（默认 `haijiao.com`，国内不可达，仅作兜底）。

### snake_case → camelCase 自动转换

`request()` 函数会对所有 API 响应数据执行 `toCamelCase()` 转换，将后端 snake_case 字段自动映射为 camelCase，与 TypeScript 接口类型保持一致。

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

### 本地自动化测试（Playwright + 本机 Chrome）

使用 Playwright 驱动本机已安装的 Google Chrome，对应用做端到端测试。本地代理通过 Vite 插件自定义中间件，读取请求头 `X-Back-end`（即配置页「数据源字段」）动态转发到镜像源，与 `worker.ts` 行为对齐；该配置仅 `npm run dev` 生效，不影响生产。

```bash
# 1. 在 e2e/config.ts 填入 mirrorDomain（必填）、uid/token 或 username/password、videoPid
# 2. 运行（会自动启动 npm run dev 于 3000 端口）
npm run test:e2e
```

> 缺少 `mirrorDomain` 时公开页与镜像源规格不可达；缺少登录凭据或 `videoPid` 时对应 `auth`/`video` 规格自动 `test.skip`，详见 `docs/plans/06-E2E自动化测试方案.md`。

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
- 包管理器使用 npm

## 许可证

MIT
