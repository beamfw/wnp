export * from './core/manifest-builder.js'
export * from './core/protocol-engine.js'
export * from './policies/policy-engine.js'
export * from './payments/payment-gateway.js'
export * from './payments/no-payment-provider.js'
export * from './cpr/density-calculator.js'
export * from './anti-abuse/duplicate-detector.js'
export * from './sdk/agent-sdk.js'
export * from './errors/error-codes.js'

// Legacy / Compatibility Types
export interface AttributionToken {
  id?: string
  siteUrl?: string
  siteName?: string
  canonicalUrl?: string
  title?: string
  issuedAt?: number
  hash?: string
  type?: string
  token?: string
  payload?: any
  embed_methods?: string[]
}

export interface ContentToProtect {
  id?: string
  title: string
  canonicalUrl: string
  siteName: string
  siteUrl: string
  type: string
  creator?: string
}

export interface VerificationResult {
  valid: boolean
  payload?: any
  error?: string
  reason?: string | null
}

export type ConsumerType = 'human' | 'ai_search' | 'ai_scraper' | 'unknown' | 'unknown_bot' | 'live_search' | 'search_bot'

export interface ClassificationResult {
  classification: ConsumerType
  confidence: number
  userAgent: string
  ip: string
  evidence?: any[]
  adapter?: string
}

export interface WNPConfig {
  version?: string
  scope?: any
  nodeId?: string
  siteName?: string
  domain?: string
  policies: Record<string, any>
  watermark?: any
  mesh?: any
  adapters?: any
  telemetry?: any
}
