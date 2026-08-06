# GitHub Actions 部署踩坑记录

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 05 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-08-03 |
> | 对应功能/内容 | GitHub Actions 部署文档站（VitePress → GitHub Pages）踩坑记录 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-08-03 | v1.0.0 | 初版 |
>
> **关联文档**：[01-开发指南.md](./01-开发指南.md)

---

## 1. 坑点汇总

### 1.1 pnpm 版本未指定

**现象**：`pnpm/action-setup@v4` 报错 `No pnpm version is specified`

**原因**：`package.json` 缺少 `packageManager` 字段，Action 无法确定安装哪个版本

**解决**：在 `package.json` 中添加：
```json
{
  "packageManager": "pnpm@10.28.2"
}
```

**注意**：版本需与本地开发环境一致，且与 lockfile 版本兼容（pnpm 9/10/11 共享 lockfileVersion 9.0）

### 1.2 GitHub Pages 未启用

**现象**：`actions/deploy-pages@v4` 报错 404，提示 `Ensure GitHub Pages has been enabled`

**原因**：仓库未开启 GitHub Pages 功能

**解决**：
1. 打开 `https://github.com/{owner}/{repo}/settings/pages`
2. Source 选择 **GitHub Actions**
3. 保存后重新运行 workflow

---

## 2. 完整 Workflow 配置

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 3. 排查清单

- [ ] `package.json` 包含 `packageManager` 字段
- [ ] GitHub Pages 已启用，Source 为 "GitHub Actions"
- [ ] workflow 文件路径正确（`.github/workflows/*.yml`）
- [ ] `pnpm install --frozen-lockfile` 不会修改 lockfile
- [ ] 构建输出路径与 `upload-pages-artifact` 的 `path` 一致
