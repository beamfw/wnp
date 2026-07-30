import { WNPPolicy } from '../core/manifest-builder.js'
import { FreeAccessPolicy } from './free-access-policy.js'
import { AttributionPolicy } from './attribution-policy.js'
import { MicropaymentPolicy } from './micropayment-policy.js'
import { LicensePolicy } from './license-policy.js'
import { ProgressivePolicy } from './progressive-policy.js'
import { CustomPolicy } from './custom-policy.js'

export interface PolicyEvaluationContext {
  url: string
  headers: Record<string, string | undefined>
  agentId?: string
  content?: string
}

export interface PolicyEvaluationResult {
  allowed: boolean
  statusCode: number
  policyType: string
  content?: string | null
  attributionText?: string | null
  paymentRequired: boolean
  paymentAmount?: number
  licenseUrl?: string
  headers: Record<string, string>
}

export class PolicyEngine {
  static async evaluate(
    policy: WNPPolicy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    switch (policy.type) {
      case 'free':
        return FreeAccessPolicy.evaluate(policy, context)
      case 'attribution':
        return AttributionPolicy.evaluate(policy, context)
      case 'micropayment':
        return MicropaymentPolicy.evaluate(policy, context)
      case 'license':
        return LicensePolicy.evaluate(policy, context)
      case 'progressive':
        return ProgressivePolicy.evaluate(policy, context)
      case 'custom':
        return CustomPolicy.evaluate(policy, context)
      default:
        return FreeAccessPolicy.evaluate(policy, context)
    }
  }
}
