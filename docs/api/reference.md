# API Reference — Web Node Protocol (WNP v2.0)

Complete TypeScript API reference for `@beamfw/wnp`.

## Core Engine

### `WNPEngine` / `WebNodeProtocol` / `WNPPlugin`

Main protocol engine class for handling handshakes, evaluation, and request classification.

```typescript
import { WNPEngine } from '@beamfw/wnp'

const engine = new WNPEngine(options?: WNPInitOptions)
```

#### Methods

- `init(options?: any): Promise<void>` — Initialize engine configurations.
- `processRequest(request: Request): Promise<ClassificationResult>` — Classify incoming requests (`ai_scraper` vs `human`).
- `handleHandshake(headers: Record<string, string | undefined>, path?: string): WNPHandshakeResult` — Perform WNP header handshake.
- `evaluateAccess(headers: Record<string, string | undefined>, url: string, content?: string): Promise<PolicyEvaluationResult>` — Evaluate policy compliance.

---

## Policy Classes

- `FreeAccessPolicy` — Unrestricted access.
- `AttributionPolicy` — Requires attribution metadata.
- `LicensingPolicy` — Verifies data licensing tokens.
- `WNPRateLimiter` — Sliding-window token bucket limiter.

---

## Framework Middlewares

- `wnpExpressMiddleware(config)` — Express.js middleware.
- `createWNPNextMiddleware(config)` — Next.js App & Pages Router middleware.
- `wnpFastifyPlugin` — Fastify plugin wrapper.
- `wnpHonoMiddleware(config)` — Hono middleware.
- `createCloudflareWNPHandler(config)` — Cloudflare Worker handler.
