const { ua }  = require('./ua.js')
module.exports = {
  title: '陈可为',
  description: '陈可为的个人博客',
  base: '/blog/',
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    [...ua]
  ],
  port: 3000,
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    lastUpdated: '最后更新时间',
    repo: 'https://github.com/coveychen95/blog',
    repoLabel: 'Github',
    nav: [
      {
        text: 'type-challenges',
        link: '/type-challenges/main.md'
      }
    ],
    sidebar: {
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@images': '../images',
        '@components': '../.vitepress/components'
      }
    }
  }
}
