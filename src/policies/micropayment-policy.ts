import { WNPPolicy } from '../core/manifest-builder.js'
import { PolicyEvaluationContext, PolicyEvaluationResult } from './policy-engine.js'

export class MicropaymentPolicy {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    const token = context.headers['wnp-access-token'] || context.headers['WNP-Access-Token']

    // If a valid token is present, allow access
    if (token) {
      return {
        allowed: true,
        statusCode: 200,
        policyType: 'micropayment',
        content: context.content ?? null,
        paymentRequired: false,
        headers: {
          'WNP-Policy': 'micropayment',
        },
      }
    }

    // Otherwise, payment required
    const currency = policy.micropayment?.currency || 'USD'
    const amount = policy.micropayment?.amountPerToken || 0.001

    return {
      allowed: false,
      statusCode: 402,
      policyType: 'micropayment',
      content: null,
      paymentRequired: true,
      paymentAmount: amount,
      headers: {
        'WNP-Policy': 'micropayment',
        'WNP-Price': `currency=${currency}; amount=${amount}; per=token`,
      },
    }
  }
}
