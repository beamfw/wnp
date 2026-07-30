# @beamfw/wnp

> Web Node Protocol (WNP) — Consent-Based Content Exchange & AI Attribution for the Open Web.
> **Beta Software — v0.1.0-beta.1**

[![npm version](https://img.shields.io/npm/v/@beamfw/wnp)](https://www.npmjs.com/package/@beamfw/wnp)
[![license](https://img.shields.io/npm/l/@beamfw/wnp)](./LICENSE)

## Installation

```bash
# Install beta release
npm install @beamfw/wnp@beta
```

## Features

- **Creator Policy Engine** — 5 access control modes: Free, Attribution-Required, Rate-Limited, License-Required, Non-Commercial
- **Token Bucket Rate Limiter** — Sliding-window per-IP request rate limiting
- **Cryptographic Attribution Receipts** — Signed access tokens for AI model training consent
- **Proof-of-Work Challenges** — Anti-scraping defense via computational puzzles
- **Universal Middleware** — Supports Express, Fastify, Next.js, Hono, Cloudflare Workers, Vercel, Netlify

## Quick Start (Express)

```typescript
import express from 'express'
import { wnpExpressMiddleware } from '@beamfw/wnp/express'

const app = express()

app.use(wnpExpressMiddleware({
  siteName: 'My Node',
  domain: 'example.com',
}))

app.listen(3000)
```

## Documentation

Full documentation at [beamfw.github.io/wnp](https://beamfw.github.io/wnp)

## License

MIT — Copyright © 2026 Web Node Protocol Contributors
