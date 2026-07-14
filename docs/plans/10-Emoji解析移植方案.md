# Emoji 解析移植方案

> **本页信息**
>
> | 项目 | 内容 |
> |------|------|
> | 文档编号 | 10 |
> | 文档版本 | v1.0.0 |
> | 文档状态 | 🏁 已完成 |
> | 最后更新 | 2026-07-14 |
> | 对应功能 | Emoji 解析移植（`[emoji]code[/emoji]` → `<img>`） |
>
> **变更历史**
>
> | 日期 | 版本 | 说明 |
> |------|:----:|------|
> | 2026-07-14 | v1.0.0 | 初版 |
| 2026-07-14 | v1.0.0 | 实施完成：emoji.ts + content.ts + ReplyList/Comment CSS + main.ts 全局挂载 |
>
> **关联文档**：[02-功能新增与改善方案.md](./02-功能新增与改善方案.md)（总览） · [03-Origin 代码剖析.md](../references/03-Origin%20代码剖析.md)（原始代码分析）

---

## 1. 背景

原始 haijiao.com Webpack 包（`docs/reference/origin/app.js`）包含完整的 Emoji 解析系统，分三个模块：

| 模块 | 位置 | 职责 |
|:----|:-----|:-----|
| `0a46` | line 376 | 定义 emoji 图片路径前缀 `/images/emoji/` |
| `b1fb` | line 5541-5843 | 定义 4 组共 59 个 emoji 映射表 |
| `29ad` | line 933-972 | 解析函数：提取 ID、替换为 `<img>`、替换为文本、还原 |

当前项目 **完全没有处理 emoji**——`v-content` 指令直接 `el.innerHTML = content`，`[emoji]001[/emoji]` 显示为原始文本。

---

## 2. 参考代码分析

### 2.1 图片路径（模块 `0a46`）

```javascript
// line 376
t.a = "/images/emoji/"
```

图片 URL 拼接：`{apiBase}/images/emoji/emoji_{id}.png`

### 2.2 Emoji 映射表（模块 `b1fb`）

共 **4 组 59 个** emoji：

| 组 | ID 范围 | 数量 | 示例 |
|:--|:--------|:----:|:----|
| Group 1 | `001`-`032` | 32 | `[Emm]` `[白眼]` `[悲伤]` … |
| Group 2 | `101`-`110` | 10 | `[晕]` `[渴求]` `[阴险]` … |
| Group 3 | `201`-`208` | 8 | `[赞]` `[恋爱]` `[认真]` … |
| Group 4 | `301`-`309` | 9 | `[开心]` `[唱歌]` `[可爱]` … |

每条记录结构：

```javascript
"001": {
    showName: "[Emm]",           // 纯文本替代
    img: "emoji_001.png",        // 图片文件名
    content: "[emoji]001[/emoji]" // 原始标记
}
```

### 2.3 解析函数（模块 `29ad`）

| 函数 | 用途 |
|:----|:-----|
| `d(e)` | 从内容中提取 `[emoji]code[/emoji]`，返回 ID 数组 |
| `u(e)` | 将 `[emoji]code[/emoji]` 替换为纯文本 `showName`（如 `[Emm]`） |
| `m(e)` | 将 `[emoji]code[/emoji]` 替换为 `<img>` 标签，ID<100 标记 `data-emoji`，ID>=100 额外标记 `data-emojiv` |
| `p(e)` | 逆转：查询 `[data-emoji]` 元素，将 `<img>` 还原为 `[emoji]code[/emoji]` |

核心渲染函数 `m(e)` 逻辑：

```javascript
function m(e) {
    var t = d(e);  // 提取所有 emoji ID
    return 0 != t.length && t.forEach(t => {
        for (var a in l)
            t == a && (e = a < 100
                ? e.replace(`[emoji]${t}[/emoji]`, `<img src="/images/emoji/emoji_${t}.png" data-emoji="${t}"/>`)
                : e.replace(`[emoji]${t}[/emoji]`, `<img src="/images/emoji/emoji_${t}.png" data-emoji="${t}" data-emojiv="true"/>`))
    }), e
}
```

---

## 3. 设计方案

### 3.1 核心原则

1. **最小侵入**：不重构现有渲染管线，仅在 `el.innerHTML` 前插入 emoji 替换步骤
2. **数据完整**：保留全部 59 个 emoji 的映射数据
3. **CDN 适配**：图片路径拼接 `{apiBase}/images/emoji/emoji_{id}.png`，复用 settings store 的镜像源配置
4. **懒加载兼容**：emoji 图片因尺寸极小（图标级），不走 IntersectionObserver 懒加载，直接设置 `src`

### 3.2 新建文件：`src/utils/emoji.ts`

```typescript
// 导出:
//   emojiMap: Record<string, { showName: string; img: string }>
//   EMOJI_CDN_PATH = '/images/emoji/'
//   renderEmoji(content: string): string
//     - 正则 /\[emoji\](\d{3})\[\/emoji\]/g
//     - 替换为 <img data-emoji="$1" src="{apiBase}/images/emoji/emoji_$1.png" class="hv-emoji">
//     - apiBase 从 settings store 获取（运行时调用，避免模块级初始化依赖）

// emojiMap 硬编码全部 59 项，不做动态拉取
```

设计要点：

- `renderEmoji()` 是纯函数，入参 `content: string`，出参替换后的 HTML 字符串
- apiBase 通过导入 settings store 的 `useSettingsStore()` 获取（运行时调用，非模块级）
- 正则匹配三位数字 ID，不校验映射表存在性（若服务端未来新增 ID，直接渲染图片）
- `class="hv-emoji"` 用于 CSS 差异化控制（与普通内容图片区分）

### 3.3 修改文件：`src/plugins/content.ts`

在 `el.innerHTML = content`（当前 line 91）之前插入：

```typescript
import { renderEmoji } from '@/utils/emoji'

// 在 el.innerHTML = content 之前
content = renderEmoji(content)
```

同时需要对 emoji 图片做 CSS 例外处理：

```typescript
// 现有的 img width: 100% 强制（line 93-94）需排除 emoji
el.querySelectorAll('img:not([data-emoji])').forEach(img => {
  img.style.width = '100%'
  // ... 其余逻辑不变
})
```

### 3.4 修改文件：`src/components/ReplyList.vue`

折叠态预览（line 20）：

```diff
- <span class="reply-text-preview" v-html="replies[0].content"></span>
+ <span class="reply-text-preview" v-html="$emoji.render(replies[0].content)"></span>
```

展开态（line 47）已使用 `v-content` 指令，由 content.ts 自动处理，无需改动。

**注入 `$emoji` 全局方法**：在 `src/main.ts` 中挂载：

```typescript
import { renderEmoji } from '@/utils/emoji'
app.config.globalProperties.$emoji = { render: renderEmoji }
```

### 3.5 CSS 样式

emoji 图片为内联小图标，需与普通内容图片区分：

```scss
// content 渲染区域
.content img,
.reply-text img {
  display: block;
  width: 100%;
}
// 新增：emoji 内联图标
.content img.hv-emoji,
.reply-text img.hv-emoji,
.reply-text-preview img.hv-emoji {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: middle;
}
```

分别添加到：
- `src/plugins/content.ts` 关联的全局样式或 `src/styles/global.scss`
- `src/components/ReplyList.vue` 的 `<style>` 块
- `src/components/Comment.vue` 的 `<style>` 块（如有 `.content` 样式）

---

## 4. 文件变更清单

| 文件 | 操作 | 说明 |
|:----|:----:|:------|
| `src/utils/emoji.ts` | **新建** | 映射表 + `renderEmoji()` |
| `src/plugins/content.ts` | 修改 | 集成 `renderEmoji()` + 排除 `[data-emoji]` 的 `width: 100%` |
| `src/components/ReplyList.vue` | 修改 | 折叠预览调用 `renderEmoji()` + `.hv-emoji` CSS |
| `src/components/Comment.vue` | 修改 | `.hv-emoji` CSS 内联样式 |
| `src/main.ts` | 修改 | 挂载 `$emoji` 全局方法 |
| `src/styles/global.scss` | 修改（可选） | `.hv-emoji` 全局样式兜底 |
| `docs/plans/02-功能新增与改善方案.md` | 修改 | 第 8 节补充关联文档链接 |
| `docs/references/03-Origin 代码剖析.md` | 修改 | 行 757 状态标记改为 ✅ |
| `docs/README.md` | 修改 | 文档一览表新增 `10-Emoji解析移植方案.md` |

---

## 5. 实施步骤

| 步骤 | 文件 | 操作 | 预计 |
|:---:|:-----|:-----|:----:|
| 步骤 | 文件 | 操作 | 状态 |
|:---:|:-----|:-----|:----:|
| 1 | `src/utils/emoji.ts` | 新建：写入 59 项映射表 + `EMOJI_CDN_PATH` + `renderEmoji()` | ✅ |
| 2 | `src/plugins/content.ts` | 导入 `renderEmoji`，插入渲染调用；修复 `img` 循环排除 `[data-emoji]` | ✅ |
| 3 | `src/main.ts` | 挂载 `$emoji` 全局属性 | ✅ |
| 4 | `src/components/ReplyList.vue` | 折叠预览调用 `renderEmoji`；添加 `.hv-emoji` CSS | ✅ |
| 5 | `src/components/Comment.vue` | 添加 `.hv-emoji` CSS | ✅ |
| 6 | `src/types/emoji.d.ts` | 新建：`$emoji` 类型声明 | ✅ |
| 7 | 验证 | `pnpm run build` 类型检查 + 打包 | ✅ |
| 8 | 文档同步 | 更新 `02` `03-代码剖析` `README.md` | ⬜ |

---

## 6. 验证方法

1. **构建验证**：`pnpm run build` 无类型错误和构建错误
2. **功能验证**：
   - 打开任意含 emoji 的帖子，确认 `[emoji]001[/emoji]` 显示为对应图片
   - 打开含 emoji 的评论回复列表，折叠预览和展开态均正确渲染
   - 图片懒加载不影响 emoji 显示（emoji 直接加载，不走 observer）

---

## 7. 阻塞项

| 项目 | 状态 | 说明 |
|:----|:----:|------|
| Emoji 图片 CDN 路径 | ⚠️ 待确认 | 原始代码后缀 `.png`，需确认 `{apiBase}/images/emoji/emoji_001.png` 可访问 |
| `data-emojiv` 属性差异 | ⚠️ 无需处理 | 原始代码对 ID>=100 的 emoji 额外标记 `data-emojiv`，为编辑器还原功能保留，当前项目只做渲染不做编辑，可统一不带此属性 |
