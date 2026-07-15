# 配置页复制粘贴 Token 方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 15 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-15 |
> | 对应功能/内容 | 配置页复制/粘贴 Token 按钮，快捷迁移登录凭证 |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-15 | v1.0.0 | 初版 |
| 2026-07-15 | v1.0.0 | 实施完成，更新为 🏁 |

> **关联文档**：[01-API 参考.md](../references/01-API%20参考.md)（认证字段）· [02-用户手册.md](../guides/02-用户手册.md)（功能说明）

---

## 1. 需求概述

配置页（`/settings`）新增两个按钮：

- **复制 Token**：将已登录的 uid 和 token 以 JSON 格式写入剪贴板
- **粘贴 Token**：读取剪贴板中的 JSON 文本，解析 uid 和 token 并写入应用状态

方便用户在不同设备/浏览器之间迁移登录凭证。

---

## 2. 技术方案

### 2.1 剪贴板格式

采用 JSON 格式，示例：

```json
{"uid":"123456","token":"abcdef123456..."}
```

- 不引入分隔符冲突风险（uid 数字、token 不确定字符）
- 人类可读，便于手动编辑
- `JSON.parse` / `JSON.stringify` 原生支持

### 2.2 复制流程

```
用户点击「复制 Token」
  → 检查 settings.isLoggedIn，未登录则跳过
  → JSON.stringify({ uid: settings.uid, token: settings.token })
  → navigator.clipboard.writeText(json)
  → 成功：showSuccessToast('Token 已复制')
  → 失败：showToast('复制失败')
```

### 2.3 粘贴流程

```
用户点击「粘贴 Token」
  → navigator.clipboard.readText()
  → JSON.parse(text) 得到对象
  → 提取 uid / token 字段
  → settings.setCredentials(uid, token)
  → 成功：showSuccessToast('Token 已粘贴')
  → 失败：showToast('读取剪贴板失败或格式无效')
```

### 2.4 现有引用

| 模块 | 用途 |
|:----|:-----|
| `@/composables/useClipboard` | 封装 `navigator.clipboard.writeText()` |
| `@/stores/settings` | `uid` / `token` 状态 + `setCredentials()` 方法 |
| `vant` `showSuccessToast` / `showToast` | 操作反馈 |

---

## 3. 修改文件

| 文件 | 变更 |
|:----|:-----|
| `src/views/SettingsView.vue` | 新增 `handleCopyCredentials()` 和 `handlePasteCredentials()` 函数；模板「认证配置」组内增加两个按钮 |
| `docs/README.md` | 新增文档一览行 + 执行进度表 |

---

## 4. UI 布局

在原有「认证配置」`van-cell-group` 内，Token 字段下方新增一行：

```
┌──────────────────────────────────┐
│ [复制 Token]    [粘贴 Token]       │
└──────────────────────────────────┘
```

- 复制按钮：`type="primary" size="small"`，未登录时 `disabled`
- 粘贴按钮：`size="small"`，不依赖登录状态

---

## 5. 执行进度

| 步骤 | 任务 | 状态 |
|:---:|------|:----:|
| 1 | 创建方案文档 | ✅ |
| 2 | SettingsView.vue 实现复制/粘贴函数与按钮 | ✅ |
| 3 | 更新 docs/README.md | ✅ |
| 4 | `pnpm run build` 构建验证 | ✅ |
