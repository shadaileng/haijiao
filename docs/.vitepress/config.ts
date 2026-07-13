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
        { text: '架构演进', link: '/architecture/02-架构演进/' },
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
