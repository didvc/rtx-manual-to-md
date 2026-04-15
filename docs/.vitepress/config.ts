import { defineConfig } from 'vitepress'

const enSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'CLI Reference', link: '/guide/cli-reference' },
      { text: 'What Gets Converted', link: '/guide/what-gets-converted' },
    ],
  },
  {
    text: 'Architecture',
    items: [
      { text: 'Overview', link: '/architecture/overview' },
      { text: 'Core Algorithm', link: '/architecture/core-algorithm' },
    ],
  },
  {
    text: 'Recipes',
    items: [
      { text: 'Filtering Files', link: '/recipes/filtering' },
      { text: 'LLM / RAG Ingestion', link: '/recipes/rag-ingestion' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'FAQ', link: '/reference/faq' },
    ],
  },
]

const jaSidebar = [
  {
    text: 'ガイド',
    items: [
      { text: 'はじめに', link: '/ja/guide/getting-started' },
      { text: 'CLIリファレンス', link: '/ja/guide/cli-reference' },
      { text: '変換対象の詳細', link: '/ja/guide/what-gets-converted' },
    ],
  },
  {
    text: 'アーキテクチャ',
    items: [
      { text: '概要', link: '/ja/architecture/overview' },
      { text: 'コアアルゴリズム', link: '/ja/architecture/core-algorithm' },
    ],
  },
  {
    text: 'レシピ',
    items: [
      { text: 'ファイルフィルタリング', link: '/ja/recipes/filtering' },
      { text: 'LLM / RAG取り込み', link: '/ja/recipes/rag-ingestion' },
    ],
  },
  {
    text: 'リファレンス',
    items: [
      { text: 'FAQ', link: '/ja/reference/faq' },
    ],
  },
]

export default defineConfig({
  base: '/rtx-manual-to-md/',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'rtx-manual-to-md',
      description: 'Convert the Yamaha RTX HTML command reference archive to GitHub Flavored Markdown',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'Recipes', link: '/recipes/filtering' },
          { text: 'FAQ', link: '/reference/faq' },
          { text: '日本語', link: '/ja/' },
        ],
        sidebar: enSidebar,
        editLink: {
          pattern: 'https://github.com/yuis-ice/rtx-manual-to-md/edit/master/docs/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      title: 'rtx-manual-to-md',
      description: 'Yamaha RTX コマンドリファレンスHTMLアーカイブをMarkdownに変換',
      themeConfig: {
        nav: [
          { text: 'ガイド', link: '/ja/guide/getting-started' },
          { text: 'レシピ', link: '/ja/recipes/filtering' },
          { text: 'FAQ', link: '/ja/reference/faq' },
          { text: 'English', link: '/' },
        ],
        sidebar: jaSidebar,
        editLink: {
          pattern: 'https://github.com/yuis-ice/rtx-manual-to-md/edit/master/docs/:path',
          text: 'GitHubでこのページを編集',
        },
        docFooter: { prev: '前のページ', next: '次のページ' },
        outlineTitle: '目次',
      },
    },
  },

  themeConfig: {
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuis-ice/rtx-manual-to-md' },
    ],
    footer: {
      message: 'Released under the Apache 2.0 License.',
      copyright: 'Copyright © 2026 yuis-ice',
    },
  },
})
