import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class ProgressivePolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    const tier = context.headers['wnp-access-tier'] || 'free'
    let content = context.content

    if (tier === 'free' && content) {
      // Truncate content to free preview (e.g., first 200 words)
      const words = content.split(/\s+/)
      if (words.length > 200) {
        content = words.slice(0, 200).join(' ') + '... [Truncated preview]'
      }
    }

    return {
      allowed: true,
      statusCode: 200,
      policyType: 'progressive',
      content: content ?? null,
      paymentRequired: tier === 'free',
      headers: {
        'WNP-Policy': 'progressive',
        'WNP-Access-Tier': tier,
      },
    }
  }
}
