import { WNPManifest, WNPPolicy } from './manifest-builder.js'
import { ProtocolEngine, NegotiateOptions } from './protocol-engine.js'

export interface WNPHandshakeResult {
  accepted: boolean
  policy: WNPPolicy
  manifest: WNPManifest | null
  responseHeaders: Record<string, string>
  statusCode: number
}

export class HandshakeHandler {
  static handleHandshake(
    requestHeaders: Record<string, string | undefined>,
    manifest: WNPManifest,
    requestPath = '/'
  ): WNPHandshakeResult {
    const parsed = ProtocolEngine.parseRequestHeaders(requestHeaders)

    // Find path-specific policy override or default
    const matchingPolicy = manifest.policies?.find(p => {
      const pattern = p.path.replace(/\*/g, '.*')
      return new RegExp(`^${pattern}$`).test(requestPath)
    })

    const policy = matchingPolicy?.policy || manifest.defaultPolicy

    let statusCode = 200
    if (policy.type === 'micropayment') {
      statusCode = 402 // Payment required
    } else if (policy.type === 'license') {
      statusCode = 403 // Forbidden / license required
    }

    const price = policy.micropayment
      ? { currency: policy.micropayment.currency, amount: policy.micropayment.amountPerToken, per: 'token' }
      : undefined

    const responseHeaders = ProtocolEngine.buildResponseHeaders({
      manifestUrl: `https://${manifest.site.domain}/.well-known/wnp-manifest.json`,
      policy: policy.type,
      price,
      attributionFormat: policy.attribution?.format || manifest.attribution?.format,
    })

    return {
      accepted: statusCode === 200,
      policy,
      manifest,
      responseHeaders,
      statusCode,
    }
  }
}
