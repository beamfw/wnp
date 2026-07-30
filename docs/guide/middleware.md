# Framework Middleware Integration

WNP provides pre-built, production-ready middleware adapters for every major Web framework and HTTP runtime.

## 1. Express.js

```typescript
import express from 'express'
import { wnpExpressMiddleware } from '@beamfw/wnp/express'

const app = express()

app.use(wnpExpressMiddleware({
  siteName: 'My Express Node',
  domain: 'example.com',
  defaultPolicy: {
    type: 'attribution',
    attributionRequired: true,
    format: 'Source: example.com'
  }
}))

app.get('/api/articles', (req, res) => {
  res.json([{ id: 1, title: 'WNP Protocol Spec' }])
})

app.listen(3000)
```

## 2. Fastify

```typescript
import Fastify from 'fastify'
import { wnpFastifyPlugin } from '@beamfw/wnp/fastify'

const fastify = Fastify()

await fastify.register(wnpFastifyPlugin, {
  siteName: 'Fastify API Node',
  domain: 'api.example.com'
})

fastify.get('/data', async () => {
  return { status: 'protected' }
})

await fastify.listen({ port: 3000 })
```

## 3. Next.js (App Router & Middleware)

```typescript
// middleware.ts
import { createWNPNextMiddleware } from '@beamfw/wnp/nextjs'

export const middleware = createWNPNextMiddleware({
  siteName: 'Next.js Application',
  domain: 'example.com'
})

export const config = {
  matcher: ['/api/:path*', '/blog/:path*'],
}
```

## 4. Hono

```typescript
import { Hono } from 'hono'
import { wnpHonoMiddleware } from '@beamfw/wnp/hono'

const app = new Hono()

app.use('*', wnpHonoMiddleware({
  siteName: 'Hono Edge Portal',
  domain: 'hono.example.com'
}))

export default app
```

## 5. Koa.js

```typescript
import Koa from 'koa'
import { UniversalWNPMiddleware } from '@beamfw/wnp'

const app = new Koa()
const wnp = new UniversalWNPMiddleware({ siteName: 'Koa Server' })

app.use(async (ctx, next) => {
  const handled = await wnp.handleKoa(ctx)
  if (!handled) await next()
})
```

## 6. Cloudflare Workers

```typescript
import { createCloudflareWNPHandler } from '@beamfw/wnp/cloudflare'

export default {
  fetch: createCloudflareWNPHandler({
    siteName: 'Edge Worker Node',
    domain: 'edge.example.com'
  })
}
```

## 7. Native Node.js `http` Server

```typescript
import http from 'http'
import { WNPEngine } from '@beamfw/wnp'

const engine = new WNPEngine({ config: { siteName: 'Node Native' } })

const server = http.createServer(async (req, res) => {
  const handshake = engine.handleHandshake(req.headers as any, req.url || '/')
  res.setHeader('x-wnp-version', '0.1.0-beta.1')
  res.setHeader('x-wnp-policy', handshake.policy.type)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Protected by WNP Node Native' }))
})

server.listen(3000)
```
