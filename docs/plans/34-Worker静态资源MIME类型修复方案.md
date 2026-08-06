# Worker 静态资源 MIME 类型修复方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 34 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-08-03 |
> | 对应功能/内容 | 修复 Cloudflare Worker 静态资源 MIME 类型错误，解决动态 import 失败问题 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-08-03 | v1.0.0 | 初版 |
>
> **关联文档**：[07-Worker代理适配优化方案.md](./07-Worker代理适配优化方案.md) · [01-架构概览.md](../architecture/01-架构概览.md)

---

## 1. 问题现象

生产环境和本地开发环境（通过 CloudStudio 代理）均出现以下错误：

```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html".
Strict MIME type checking is enforced for module scripts per HTML spec.
```

受影响的资源包括：
- `HotTopicsView-Ds--Vwq2.js`
- `Topics-oujOKhK9.js`
- `Pagination-BIfPmklG.js`
- `vue-DKs8J8qO.js`

最终导致：

```
TypeError: Failed to fetch dynamically imported module: https://example.com/assets/HotTopicsView-Ds--Vwq2.js
```

**触发条件**：页面打开一段时间后，点击按钮触发路由导航（动态 import）时发生。初始加载正常，刷新页面可恢复。

---

## 2. 根因分析

### 2.1 错误链路

```
用户点击按钮
  → Vue Router 导航（如 /hot → /topic/123）
  → 动态 import('@/views/TopicView.vue')
  → 浏览器请求 /assets/TopicView-xxxx.js
  → Cloudflare Worker 拦截请求
  → 返回 index.html（HTML 内容）
  → 浏览器检测 MIME 类型：期望 application/javascript，实际 text/html
  → 报错 + 动态 import 失败 → 页面白屏
```

### 2.2 根因定位：`worker.ts` 第 19-20 行

```ts
// worker.ts（当前代码）
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests to backend
    if (url.pathname.startsWith('/api/')) {
      return proxyApi(request, env);
    }

    // SPA fallback: non-API requests return index.html  ← 问题在此
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  },
};
```

**问题**：所有非 `/api` 请求都被无条件重写为 `/index.html`。这包括：

| 请求路径 | 期望行为 | 实际行为 |
|:---------|:---------|:---------|
| `/` | 返回 `index.html` | ✅ 正确 |
| `/assets/index-Cvbj17hk.js` | 返回 JS 文件 | ❌ 返回 `index.html` |
| `/assets/HotTopicsView-Ds--Vwq2.js` | 返回 JS 文件 | ❌ 返回 `index.html` |
| `/assets/vue-DKs8J8qO.js` | 返回 JS 文件 | ❌ 返回 `index.html` |
| `/assets/style.css` | 返回 CSS 文件 | ❌ 返回 `index.html` |

### 2.3 为什么初始加载正常？

初始加载时，`index.html` 中的入口 `<script>` 标签指向的 JS 文件（如 `/assets/index-Cvbj17hk.js`）实际上也被 Worker 返回了 HTML。但由于以下原因之一，首次加载可能不受影响：

1. **浏览器缓存**：之前访问时缓存了 JS 文件，后续请求直接从缓存读取
2. **CDN 缓存**：Cloudflare CDN 边缘节点缓存了静态资源
3. **Service Worker**：可能存在 Service Worker 缓存策略

当缓存过期或首次访问新路由的 chunk 时，浏览器重新请求 JS 文件，此时 Worker 返回 HTML → MIME 错误。

### 2.4 wrangler.toml 配置确认

```toml
[assets]
directory = "./dist"
binding = "ASSETS"
html_handling = "none"      # Cloudflare 不自动处理 .html 后缀
serve_directly = false      # 所有请求经过 Worker 代码处理
```

`serve_directly = false` 意味着 Cloudflare **不会**自动提供静态资源，所有请求都必须由 Worker 代码显式处理。当前 Worker 代码没有尝试提供实际资源，而是直接 fallback 到 `index.html`。

---

## 3. 修复方案

### 3.1 核心思路

修改 `worker.ts` 的请求处理逻辑：

1. **API 请求**（`/api/*`）→ 代理到后端
2. **静态资源请求**（`/assets/*` 等）→ 先尝试从 ASSETS 提供实际文件
3. **页面路由请求**（无匹配资源时）→ SPA fallback 返回 `index.html`

### 3.2 修改文件

| 文件 | 修改内容 |
|:-----|:---------|
| `worker.ts` | `fetch` handler 中，SPA fallback 前先尝试 `env.ASSETS.fetch(request)` |

### 3.3 修改详情

```ts
// worker.ts（修改后）
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Proxy API requests to backend
    if (url.pathname.startsWith('/api/')) {
      return proxyApi(request, env);
    }

    // Try to serve static assets first
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 200) {
      return assetResponse;
    }

    // SPA fallback: non-API, non-asset requests return index.html
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  },
};
```

**关键变化**：

- 新增 `env.ASSETS.fetch(request)` 尝试提供实际资源
- 仅当资源不存在（`status !== 200`）时才 fallback 到 `index.html`
- `env.ASSETS.fetch(request)` 使用原始请求 URL，ASSETS binding 会自动查找 `./dist` 目录下对应路径的文件

### 3.4 行为对照

| 请求路径 | 修改前 | 修改后 |
|:---------|:-------|:-------|
| `/` | `index.html` | `index.html`（ASSETS 无 `/` 文件，fallback） |
| `/hot` | `index.html` | `index.html`（ASSETS 无 `/hot` 文件，fallback） |
| `/assets/index-Cvbj17hk.js` | `index.html` ❌ | 实际 JS 文件 ✅ |
| `/assets/HotTopicsView-Ds--Vwq2.js` | `index.html` ❌ | 实际 JS 文件 ✅ |
| `/assets/vue-DKs8J8qO.js` | `index.html` ❌ | 实际 JS 文件 ✅ |
| `/assets/style.css` | `index.html` ❌ | 实际 CSS 文件 ✅ |

---

## 4. 实施步骤

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `docs/plans/34-Worker静态资源MIME类型修复方案.md` | 创建方案文档 | ✅ |
| 2 | `worker.ts` | 修改 fetch handler，静态资源优先 | ✅ |
| 3 | — | `pnpm run build` 构建验证 | ✅ |
| 4 | `docs/README.md` | 文档同步 | ✅ |

---

## 5. 风险评估

| 风险 | 影响 | 缓解措施 |
|:-----|:-----|:---------|
| ASSETS.fetch 性能开销 | 每次请求多一次 ASSETS 查找 | ASSETS binding 是本地磁盘查找，开销极低 |
| 路由页面直接访问 404 | 用户直接访问 `/topic/123` 时 ASSETS 无匹配文件 | fallback 到 `index.html`，Vue Router 接管路由 |
| 构建后 dist 目录结构变化 | ASSETS 找不到文件 | Vite 构建输出固定在 `dist/assets/`，路径一致 |

> **文档规范说明**
>
> 1. 文件名格式：`{序号}-{中文标题}.md`
> 2. 版本号格式：`v{major}.{minor}.{patch}`
>    - major：重大内容重构或范围变更
>    - minor：功能增补或章节调整
>    - patch：勘误、格式调整
> 3. 状态标记：
>    - `📋 待执行` — 已规划但未开始
>    - `🚧 进行中` — 正在实施
>    - `🏁 已完成` — 实施完毕
> 4. 新文档按类型放入对应子目录：方案 → `plans/`、架构 → `architecture/`、参考 → `references/`、指南 → `guides/`
> 5. 每更新一次内容，在「变更历史」表格中追加一行
