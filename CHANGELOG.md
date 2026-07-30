# Changelog — Web Node Protocol (WNP)

All notable changes to the Web Node Protocol (`@beamfw/wnp`) library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-beta.1] — 2026-07-30

### Added — Initial Standalone Beta Release

#### Core Protocol Engine (`src/core/`)
- **ProtocolEngine**: Standardized HTTP header handshake parser & response generator enforcing `x-wnp-*` headers (`x-wnp-version`, `x-wnp-node-id`, `x-wnp-policy`, `x-wnp-attribution`, `x-wnp-token`, `x-wnp-challenge`).
- **ManifestBuilder & ManifestValidator**: Declarative node manifests specifying site name, domain, default policies, paths, and payment methods.
- **HandshakeHandler**: Automatic client classification (`ai_scraper`, `search_bot`, `human_browser`) and header handshake verification.
- **TokenIssuer & TokenVerifier**: Cryptographic access token generator and SHA-256 HMAC verification.

#### Creator Policy Engine (`src/policies/`)
- **FreeAccessPolicy**: Unrestricted public access policy.
- **AttributionPolicy**: Enforces source attribution metadata retention (`x-wnp-attribution`) for AI model training.
- **LicensingPolicy**: Verifies commercial data licensing tokens.
- **MicropaymentPolicy**: Resolves payment provider fallback when micropayments are requested.
- **ProgressivePolicy & CustomPolicy**: Path-specific and dynamic custom policy rules.

#### Anti-Abuse & Resource Protection (`src/anti-abuse/`)
- **WNPRateLimiter**: Sliding-window token bucket rate limiter for IP addresses and bot signatures.
- **HoneypotEngine**: Proof-of-work puzzle challenge generator (`HTTP 429`) and hidden link bot detection.
- **DuplicateContentDetector**: Cross-origin payload hash checking for content theft.
- **SemanticNoiseGenerator**: Transparent zero-width whitespace and noise injection to defeat unauthorized extraction.

#### Universal Framework Middlewares (`src/middleware/` & `src/sdk/`)
- **Express.js**: `wnpExpressMiddleware()` for Express applications.
- **Fastify**: `wnpFastifyPlugin()` for Fastify servers.
- **Next.js**: `createWNPNextMiddleware()` for Next.js App Router and Pages Router.
- **Hono**: `wnpHonoMiddleware()` for Hono edge/server runtimes.
- **Cloudflare Workers**: `createCloudflareWNPHandler()` for Cloudflare Workers.
- **Vercel & Netlify**: Serverless handler wrappers for Vercel and Netlify functions.

#### Documentation Suite (`docs/`)
- VitePress documentation site with `vitepress-plugin-depthindex` integration.
- Complete guides focusing 100% on third-party HTTP web frameworks (Express, Fastify, Next.js, Hono, Cloudflare, Vercel, Netlify).

### Notes

This is the initial beta release (`v0.1.0-beta.1`) of Web Node Protocol (WNP). It operates standalone without requiring any specific web framework.
