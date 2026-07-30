import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class FreeAccessPolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    return {
      allowed: true,
      statusCode: 200,
      policyType: 'free',
      content: context.content ?? null,
      attributionText: null,
      paymentRequired: false,
      headers: {
        'WNP-Policy': 'free',
      },
    }
  }
}
