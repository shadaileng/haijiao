# Worker 代理适配优化方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 07 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-13 |
> | 对应功能/内容 | worker.ts 代理层与前端项目的适配问题修复 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-13 | v1.0.0 | 初版 |
> | 2026-07-13 | v1.1.0 | 实施完成：删除 proxy-image、修正 origin、Vite fallback |
>
> **关联文档**：[05-参考haijiao-wxt重构前端项目方案.md](./05-参考haijiao-wxt重构前端项目方案.md) · [01-架构概览.md](../architecture/01-架构概览.md)

---

## 1. 背景

对 `worker.ts` 与前端项目的适配性审查后发现 3 个问题，需逐一修复以确保本地开发（Vite 代理）与生产部署（Cloudflare Worker）行为一致。

## 2. 问题清单

### 2.1 `/api/proxy-image` 是死代码

- **位置**：`worker.ts:52-87`
- **现状**：Worker 定义了该端点，用于获取 `.txt` 图片文件并解码
- **问题**：前端 `src/utils/image.ts:25` 直接 `fetch(item.remoteUrl)` 获取图片，从未调用 `/api/proxy-image`
- **结论**：该端点无任何调用者，属于死代码

### 2.2 `origin` 头硬编码为默认后端

- **位置**：`worker.ts:94`
- **现状**：`headers.set('origin', env.HAIJIAO_API_BASE)` 始终设为 `https://haijiao.com`
- **问题**：当用户配置了自定义镜像源时，`origin` 仍指向 `haijiao.com` 而非实际镜像域名，可能导致严格 CORS 校验的镜像源拒绝请求
- **预期**：`origin` 应与实际代理目标保持一致

### 2.3 Vite 代理与 Worker 行为不一致

- **位置**：`vite.config.ts:21-25` vs `worker.ts:32-45`
- **现状**：
  - Vite 代理：缺少 `X-Backend` → 返回 400
  - Worker：缺少 `X-Backend` → 回退 `HAIJIAO_API_BASE`
- **问题**：前端始终发送 `X-Backend`（`request.ts:52`），实际影响不大，但行为不完全一致

## 3. 修复步骤

| 步骤 | 文件 | 操作 | 状态 |
|:----:|:-----|:-----|:----:|
| 1 | `worker.ts` | 删除 `/api/proxy-image` 端点（约 35 行） | ✅ |
| 2 | `worker.ts` | `origin` 头改用已解析的 `backend` 变量 | ✅ |
| 3 | `vite.config.ts` | 缺少 `X-Backend` 时回退到默认后端，与 Worker 行为对齐 | ✅ |
| 4 | 验证 | `npm run build` 构建验证 | ✅ |
| 5 | 文档 | 更新本文档状态为 🏁 已完成 | ✅ |

## 4. 具体改动

### 4.1 删除 `/api/proxy-image`

删除 `worker.ts:51-87` 的 `if (url.pathname === '/api/proxy-image')` 分支及其内部逻辑。

### 4.2 修正 `origin` 头

```typescript
// 修改前
headers.set('origin', env.HAIJIAO_API_BASE);

// 修改后
headers.set('origin', backend);
```

`backend` 变量已由 `resolveBackend()` 解析，包含用户配置的镜像源或默认后端。

### 4.3 Vite 代理补 fallback

```typescript
// 修改前
const backend = (req.headers['x-backend'] as string) || ''
if (!backend) {
  res.writeHead(400, ...)
  return
}

// 修改后
const backend = (req.headers['x-backend'] as string) || 'https://haijiao.com'
```

## 5. 风险评估

| 改动 | 风险 | 说明 |
|------|:----:|------|
| 删除 proxy-image | 无 | 无调用者 |
| 修正 origin | 低 | 修正后与实际代理目标一致，更符合 CORS 规范 |
| Vite fallback | 低 | 仅影响本地开发缺少 X-Backend 的极端场景 |

---

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
