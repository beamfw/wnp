# Getting Started with WNP v2.0

Web Node Protocol (WNP) allows any server or application to declare content licensing rules and negotiate access terms with AI scrapers, web crawlers, and agents automatically.

## Installation

Install the package via npm, yarn, or pnpm:

```bash
npm install @beamfw/wnp
```

```bash
yarn add @beamfw/wnp
```

```bash
pnpm add @beamfw/wnp
```

## Quick Start (Express.js)

Protect your Express server routes in less than 10 lines of code:

```typescript
import express from 'express'
import { wnpExpressMiddleware } from '@beamfw/wnp/express'

const app = express()

// Attach WNP protocol middleware
app.use(wnpExpressMiddleware({
  siteName: 'My Content Portal',
  domain: 'example.com',
  defaultPolicy: {
    type: 'attribution',
    attributionRequired: true,
    format: 'Content provided by example.com'
  }
}))

app.get('/api/articles', (req, res) => {
  res.json({ title: 'Understanding Web Node Protocol v2.0', body: '...' })
})

app.listen(3000, () => {
  console.log('Server running with WNP v2.0 protocol protection on port 3000')
})
```

## Core Protocol Flow

1. **Client Request**: An AI bot or client sends a GET request to your endpoint.
2. **WNP Handshake**: WNP inspects request headers (`x-wnp-version`, `user-agent`) and classifies the client.
3. **Policy Evaluation**: The Policy Engine evaluates your rules against the request.
4. **Protocol Action**:
   - **Allowed**: Content is returned alongside WNP attribution headers (`x-wnp-attribution`, `x-wnp-token`).
   - **Rate Limited**: WNP returns HTTP status `429` with a challenge header.
   - **License / Payment Required**: WNP returns HTTP status `402` or `403` with license details.

Next: Learn about the [WNP Protocol Specification](./protocol-spec.md).
