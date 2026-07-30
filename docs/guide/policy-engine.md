# Creator Policy Engine

The WNP Policy Engine governs how your server evaluates access requests and enforces creator choices.

## 5 Creator Policy Modes

### 1. Free Access (`free`)
Content is 100% public and open. No restrictions.

```typescript
import { FreeAccessPolicy } from '@beamfw/wnp'

const policy = new FreeAccessPolicy()
```

### 2. Attribution Required (`attribution`)
Content is accessible provided downstream bots and AI models preserve attribution metadata.

```typescript
import { AttributionPolicy } from '@beamfw/wnp'

const policy = new AttributionPolicy({
  attributionRequired: true,
  format: 'Source: example.com by Author Name'
})
```

### 3. Rate Limited / Throttled (`rate_limited`)
Limits request frequency per client IP or agent token using sliding-window token buckets.

```typescript
import { WNPRateLimiter } from '@beamfw/wnp'

const limiter = new WNPRateLimiter({
  maxRequests: 60,
  windowSeconds: 60
})
```

### 4. License Required (`license`)
Requires AI scrapers to verify a valid commercial data licensing token before accessing content.

```typescript
import { LicensePolicy } from '@beamfw/wnp'

const policy = new LicensePolicy({
  allowedLicenseIds: ['lic_123', 'lic_456']
})
```

### 5. Non-Commercial (`non_commercial`)
Content can be read for personal use but commercial AI model training is prohibited.
