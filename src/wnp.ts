import { WNPManifest, ManifestBuilder } from './core/manifest-builder.js'
import { HandshakeHandler, WNPHandshakeResult } from './core/handshake-handler.js'
import { PolicyEngine, PolicyEvaluationResult } from './policies/policy-engine.js'
import { NoPaymentProviderFallback } from './payments/no-payment-provider.js'
import { WNPConfig, ClassificationResult } from './types.js'

export interface WNPInitOptions {
  manifest?: WNPManifest
  secretKey?: string
  config?: WNPConfig
}

export class WNPPlugin {
  manifest: WNPManifest
  secretKey: string
  config: WNPConfig

  constructor(options?: WNPInitOptions) {
    this.manifest = options?.manifest || new ManifestBuilder('Default Node', 'example.com').build()
    this.secretKey = options?.secretKey || 'wnp-default-secret-key'
    this.config = options?.config || {
      version: '0.1.0-beta.1',
      scope: { paths: ['/**'], exclude: [] },
      nodeId: 'default-node',
      siteName: 'Default Node',
      domain: 'example.com',
      policies: {
        ai_scraper: { action: 'summary_only', attribution_format: 'Source attribution required.' },
      },
      watermark: {},
      mesh: {},
    }

    const resolution = NoPaymentProviderFallback.resolvePolicy(this.manifest.defaultPolicy, this.manifest.paymentMethods)
    if (resolution.hasWarnings) {
      this.manifest.defaultPolicy = resolution.policy
    }
  }

  async init(_options?: any): Promise<void> {
    if (!this.config.version) this.config.version = '0.1.0-beta.1'
    if (!this.config.scope) this.config.scope = { paths: ['/**'], exclude: [] }
    if (!this.config.policies?.ai_scraper) {
      this.config.policies = {
        ...this.config.policies,
        ai_scraper: { action: 'summary_only', attribution_format: 'Source attribution required.' },
      }
    }
  }

  async processRequest(request: Request): Promise<ClassificationResult> {
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /GPTBot|ClaudeBot|Bytespider/i.test(userAgent)
    return {
      classification: isBot ? 'ai_scraper' : 'human',
      confidence: 0.95,
      userAgent,
      ip: '127.0.0.1',
    }
  }

  handleHandshake(headers: Record<string, string | undefined>, path = '/'): WNPHandshakeResult {
    return HandshakeHandler.handleHandshake(headers, this.manifest, path)
  }

  async evaluateAccess(headers: Record<string, string | undefined>, url: string, content?: string): Promise<PolicyEvaluationResult> {
    const handshake = this.handleHandshake(headers, new URL(url).pathname)
    return PolicyEngine.evaluate(handshake.policy, { url, headers, content })
  }
}

// Standalone exports for non-framework specific usage
export { WNPPlugin as WNPEngine, WNPPlugin as WebNodeProtocol }
