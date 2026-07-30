import { WNPPolicy } from '../core/manifest-builder.js'
import { NoPaymentProviderFallback } from '../payments/no-payment-provider.js'

export class RecoveryStrategies {
  static recoverPolicy(desiredPolicy: WNPPolicy): WNPPolicy {
    const resolution = NoPaymentProviderFallback.resolvePolicy(desiredPolicy, [])
    return resolution.policy
  }
}
