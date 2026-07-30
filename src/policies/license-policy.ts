import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class LicensePolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    return {
      allowed: false,
      statusCode: 403,
      policyType: 'license',
      content: null,
      paymentRequired: false,
      licenseUrl: `https://${new URL(context.url).hostname}/licensing`,
      headers: {
        'WNP-Policy': 'license',
      },
    }
  }
}
