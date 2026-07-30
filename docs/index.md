---
layout: home

hero:
  name: "Web Node Protocol (WNP)"
  text: "Consent-Based Content Exchange. Zero Trust. Open Web."
  tagline: "Total creator control over AI scrapers, bots, and content consumers with cryptographic attribution and transparent access policies. Initial Beta Release v0.1.0-beta.1."
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Protocol Specification
      link: /guide/protocol-spec
    - theme: alt
      text: API Reference
      link: /api/reference

features:
  - icon: 🛡️
    title: Creator Policy Control
    details: Set granular access rules for your content — Free, Attribution-Required, Rate-Limited, License-Required, or Non-Commercial.
  - icon: 🤝
    title: Automated Protocol Handshake
    details: Standardized HTTP headers (x-wnp-version, x-wnp-policy, x-wnp-handshake) allow AI agents and scrapers to negotiate terms transparently.
  - icon: 🔑
    title: Cryptographic Attribution Receipts
    details: Issue tamper-evident, signed access tokens and attribution receipts for downstream AI model training and syndication.
  - icon: ⚡
    title: Universal Framework Middlewares
    details: Standalone zero-config middleware for Express, Fastify, Next.js, Hono, Koa, Cloudflare Workers, Vercel, and Netlify.
  - icon: 🔒
    title: Anti-Abuse & Resource Defense
    details: Token bucket rate limiting, proof-of-work challenges, honeypot traps, and semantic noise injection protect server resources.
  - icon: 🌍
    title: Standalone Open Standard
    details: Works with any Web server or HTTP framework. Zero framework lock-in. 100% open source under the MIT license.
---

## What is WNP?

The **Web Node Protocol (WNP v0.1.0-beta.1)** is an open HTTP protocol standard and standalone middleware library designed to solve content scraping, attribution, and consent on the modern web.

WNP gives content creators, publishers, and application developers total control over how automated AI scrapers, web crawlers, and third-party agents interact with their content.

```ts
import { WNPEngine } from '@beamfw/wnp'
import express from 'express'
import { wnpExpressMiddleware } from '@beamfw/wnp/express'

const app = express()

app.use(wnpExpressMiddleware({
  siteName: 'My Publishing Node',
  domain: 'example.com',
  policies: {
    ai_scraper: {
      action: 'attribution_required',
      attribution_format: 'Source: example.com by Author'
    }
  }
}))
```
