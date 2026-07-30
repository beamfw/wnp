import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Web Node Protocol (WNP)',
  description: 'Consent-Based Content Exchange & AI Attribution Protocol for the Open Web',
  base: process.env.GITHUB_ACTIONS ? '/wnp/' : '/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Protocol Spec', link: '/guide/protocol-spec' },
      { text: 'Middleware', link: '/guide/middleware' },
      { text: 'API Reference', link: '/api/reference' },
      { text: 'GitHub', link: 'https://github.com/beamfw/wnp' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview & Quick Start', link: '/guide/getting-started' },
          { text: 'Protocol Specification', link: '/guide/protocol-spec' },
        ],
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Creator Policy Engine', link: '/guide/policy-engine' },
          { text: 'Framework Middlewares', link: '/guide/middleware' },
          { text: 'Anti-Scraping & Challenges', link: '/guide/anti-scraping' },
          { text: 'Attribution Receipts', link: '/guide/attribution-receipts' },
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'TypeScript API', link: '/api/reference' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Web Node Protocol Contributors',
    },
  },
})
