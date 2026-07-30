import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class AttributionPolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    const format = policy.attribution?.format || 'Originally published at {url}'
    const attributionText = format.replace('{url}', context.url)

    return {
      allowed: true,
      statusCode: 200,
      policyType: 'attribution',
      content: context.content ?? null,
      attributionText,
      paymentRequired: false,
      headers: {
        'WNP-Policy': 'attribution',
        'WNP-Attribution': `required=true; format="${format}"`,
      },
    }
  }
}
