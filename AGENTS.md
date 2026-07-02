# AGENTS.md

本项目是海角助手 Web 应用，基于 Vue 3 + Vant 4 + Cloudflare Workers 构建。

## 项目架构

### 技术栈

- Vue 3.5 + TypeScript 5.6
- Vant 4.9 (移动端 UI)
- Pinia 2.2 (状态管理)
- Vue Router 4.4 (路由)
- Vite 6.0 (构建工具)
- Cloudflare Workers (部署)
- Tailwind CSS 3.4 + Sass

### 目录结构

```
src/
├── api/           # API 请求层 (HTTP 封装、加密解密)
├── types/         # TypeScript 类型定义
├── stores/        # Pinia 状态管理
├── composables/   # 组合式函数 (useClipboard, useLoading)
├── layouts/       # 布局组件
├── assets/        # 静态资源
├── styles/        # 全局样式 (SCSS)
├── views/         # 页面级组件 (7 个页面)
└── router/        # 路由配置
```

## 编码规范

### TypeScript

- 启用严格模式 (`strict: true`)
- 所有组件使用 `<script setup lang="ts">`
- 类型定义放在 `src/types/index.ts`
- API 返回值必须定义接口类型

### Vue 组件

- 使用 Composition API + `<script setup>`
- Props 和 Emits 使用 `defineProps` / `defineEmits`
- 组件命名使用 PascalCase
- 页面组件放在 `views/`，通用逻辑放在 `composables/`

### 状态管理

- 使用 Pinia，每个模块一个 store 文件
- 用户状态在 `stores/user.ts`
- 数据持久化使用 localStorage
- Store 初始化时自动从 localStorage 恢复数据

### API 请求

- 所有 API 请求封装在 `api/request.ts`
- 通过 Cloudflare Worker 代理到 `haijiao.com`
- 支持 Base64 多层加密数据自动解密
- 错误统一抛出 Error 对象

### CSS

- 全局样式使用 SCSS 变量
- Tailwind CSS 用于工具类
- Vant 主题色: `--van-primary-color: #07c160`
- 响应式适配移动端 viewport

## 关键文件

| 文件 | 说明 |
|------|------|
| `src/main.ts` | 应用入口，注册插件 |
| `src/router/index.ts` | 路由定义，7 条路由 |
| `src/stores/user.ts` | 用户状态、缓存管理 |
| `src/api/request.ts` | HTTP 请求封装、加密处理 |
| `worker.ts` | Cloudflare Worker 入口 |
| `wrangler.toml` | CF Workers 配置 |
| `vite.config.ts` | Vite 构建配置 |

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 类型检查 + 构建
npm run preview      # 预览构建结果
npm run cf:dev       # 本地 CF Worker 测试
npm run cf:deploy    # 部署到 Cloudflare Workers
```

## 路由表

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | HomeView | 首页 |
| `/topic/:pid?` | TopicView | 帖子详情 |
| `/user/:userId?` | UserView | 用户帖子 |
| `/follow/:userId?` | FollowView | 关注列表 |
| `/search` | SearchView | 搜索 |
| `/settings` | SettingsView | 设置 |
| `/image-viewer` | ImageViewerView | 图片查看 |
