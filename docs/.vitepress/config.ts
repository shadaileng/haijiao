import { defineConfig } from 'vitepress'

function ignoreReferencePlugin() {
  const pattern = /reference\/haijiao-wxt\//
  return {
    name: 'ignore-reference',
    resolveId(source: string) {
      if (pattern.test(source)) {
        return '\0virtual:empty'
      }
    },
    load(id: string) {
      if (id === '\0virtual:empty' || pattern.test(id)) {
        return 'export default {}'
      }
    },
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: '海角助手文档',
  description: '海角助手 Web 应用项目文档',
  srcExclude: ['reference/**'],
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  vite: {
    plugins: [ignoreReferencePlugin()],
    optimizeDeps: {
      exclude: ['vitepress'],
      entries: ['docs/**/*.md'],
      extensions: ['vue', 'md'],
    },
    ssr: {
      noExternal: ['vitepress'],
    },
    server: {
      host: true,
      allowedHosts: true,
      watch: {
        ignored: ['**/docs/reference/**'],
      },
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '海角助手文档',
    nav: [
      { text: '文档索引', link: '/' },
      { text: '方案', link: '/plans/01-登录功能实施方案/' },
      { text: '架构', link: '/architecture/01-架构概览/' },
      { text: 'API 参考', link: '/references/01-API 参考/' },
      { text: '指南', link: '/guides/01-开发指南/' },
    ],
    sidebar: {
      '/architecture/': [
        { text: '架构概览', link: '/architecture/01-架构概览/' },
      ],
      '/guides/': [
        { text: '开发指南', link: '/guides/01-开发指南/' },
        { text: '用户手册', link: '/guides/02-用户手册/' },
        { text: 'E2E 代理踩坑排查', link: '/guides/03-E2E代理踩坑排查/' },
      ],
      '/plans/': [
        { text: '登录功能实施方案', link: '/plans/01-登录功能实施方案/' },
        { text: '功能新增与改善方案', link: '/plans/02-功能新增与改善方案/' },
        { text: '配置代理地址功能方案', link: '/plans/03-配置代理地址功能方案/' },
        { text: '参考 haijiao-wxt 界面布局方案', link: '/plans/04-参考haijiao-wxt界面布局方案/' },
        { text: '参考 haijiao-wxt 重构前端项目方案', link: '/plans/05-参考haijiao-wxt重构前端项目方案/' },
        { text: 'E2E 自动化测试方案', link: '/plans/06-E2E自动化测试方案/' },
        { text: 'Worker 代理适配优化方案', link: '/plans/07-Worker代理适配优化方案/' },
        { text: '回复列表渲染方案', link: '/plans/08-回复列表渲染方案/' },
        { text: '数据驱动重构方案', link: '/plans/09-数据驱动重构方案/' },
        { text: 'Emoji 解析移植方案', link: '/plans/10-Emoji解析移植方案/' },
        { text: '批量图片加载模块方案', link: '/plans/11-批量图片加载模块方案/' },
        { text: 'v-content 适配 Door 标签方案', link: '/plans/12-v-content适配Door标签方案/' },
        { text: 'v-content 适配 Sell 标签方案', link: '/plans/13-v-content适配Sell标签方案/' },
        { text: '移除视频 30 秒预览限制', link: '/plans/14-移除视频30秒预览限制/' },
        { text: '配置页复制粘贴 Token 方案', link: '/plans/15-配置页复制粘贴Token方案/' },
        { text: '分页按钮改造方案', link: '/plans/16-主页无限滚动加载修复方案/' },
        { text: '用户主页缓存闪现修复方案', link: '/plans/17-用户主页缓存闪现修复方案/' },
        { text: '帖子 1742505 视频播放调试方案', link: '/plans/18-帖子1742505视频播放调试方案/' },
      ],
      '/references/': [
        { text: 'API 参考', link: '/references/01-API 参考/' },
        { text: '数据字典', link: '/references/02-数据字典/' },
        { text: 'Origin 代码剖析', link: '/references/03-Origin 代码剖析/' },
      ],
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: '海角助手项目文档',
      copyright: 'Copyright © 2026 海角助手',
    },
  },
})
