# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-03

### Added

- 初始化海角助手 Web 应用项目
- 基于 Vue 3 + Vant 4 + Cloudflare Workers 架构
- 7 个页面视图：首页、帖子详情、用户帖子、关注列表、搜索、设置、图片查看
- API 请求层封装，支持 Base64 多层加密数据自动解密
- Pinia 状态管理，localStorage 数据持久化
- Cloudflare Worker API 代理，解决 CORS 问题
- 帖子/用户/搜索历史记录本地缓存
- TypeScript 严格模式类型检查
- Tailwind CSS + SCSS 混合样式方案
- 移动端响应式设计和 TabBar 导航
