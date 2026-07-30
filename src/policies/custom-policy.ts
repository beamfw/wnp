import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class CustomPolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    return {
      allowed: true,
      statusCode: 200,
      policyType: 'custom',
      content: context.content ?? null,
      paymentRequired: false,
      headers: {
        'WNP-Policy': 'custom',
      },
    }
  }
}
