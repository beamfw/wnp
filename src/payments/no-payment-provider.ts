import { WNPPolicy, WNPPaymentMethod, WNPLicensing } from '../core/manifest-builder.js'
import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export interface PolicyWarning {
  code: string
  severity: 'error' | 'warning' | 'info'
  message: string
  fix: string
  consequence: string
}

export interface PolicyResolution {
  desiredPolicy: string
  effectivePolicy: string
  policy: WNPPolicy
  warnings: PolicyWarning[]
  hasWarnings: boolean
  hasErrors: boolean
}

export class NoPaymentProviderFallback implements WNPPaymentProvider {
  provider = 'none'
  name = 'No Payment Provider'

  async isAvailable(): Promise<boolean> {
    return false
  }

  async createSession(_params: PaymentSessionParams): Promise<PaymentSession> {
    throw new Error('No payment provider configured. Content will be served with attribution policy instead.')
  }

  async checkPayment(_sessionId: string): Promise<PaymentStatus> {
    return { status: 'failed' }
  }

  getCapabilities(): PaymentCapabilities {
    return {
      minAmount: 0,
      maxAmount: 0,
      currencies: [],
      supportsMicroPayments: false,
      supportsInstantSettlement: false,
      supportsRecurring: false,
    }
  }

  getConfigSchema(): ConfigSchema {
    return { fields: [] }
  }

  static resolvePolicy(
    desiredPolicy: WNPPolicy,
    configuredPaymentMethods: WNPPaymentMethod[],
    configuredLicensing?: WNPLicensing
  ): PolicyResolution {
    const warnings: PolicyWarning[] = []
    let effectivePolicy: WNPPolicy = { ...desiredPolicy }

    if (desiredPolicy.type === 'micropayment') {
      const hasPaymentProvider = configuredPaymentMethods.some(m => m.enabled)

      if (!hasPaymentProvider) {
        warnings.push({
          code: 'WNP_NO_PAYMENT_PROVIDER',
          severity: 'warning',
          message: 'Micropayment policy configured but no payment provider is enabled.',
          fix: 'Enable a payment provider (Stripe, Lightning, etc.) or change policy to "attribution" or "free".',
          consequence: 'Content will be served with ATTRIBUTION policy as fallback.',
        })

        effectivePolicy = {
          type: 'attribution',
          description: `${desiredPolicy.description} (Payment unavailable — attribution required instead)`,
          attribution: {
            required: true,
            format: 'Originally published at {url}',
            requireLink: true,
            requireAuthorName: true,
          },
        }
      }
    }

    if (desiredPolicy.type === 'license') {
      if (!configuredLicensing?.url || !configuredLicensing?.contact) {
        warnings.push({
          code: 'WNP_NO_LICENSING_CONFIG',
          severity: 'warning',
          message: 'License policy configured but no licensing URL or contact is set.',
          fix: 'Configure licensing URL and contact email, or change policy to "attribution" or "free".',
          consequence: 'Content will be served with ATTRIBUTION policy as fallback.',
        })

        effectivePolicy = {
          type: 'attribution',
          description: `${desiredPolicy.description} (Licensing unavailable — attribution required instead)`,
          attribution: {
            required: true,
            format: 'Originally published at {url}. Contact {contact} for licensing.',
            requireLink: true,
            requireAuthorName: true,
          },
        }
      }
    }

    return {
      desiredPolicy: desiredPolicy.type,
      effectivePolicy: effectivePolicy.type,
      policy: effectivePolicy,
      warnings,
      hasWarnings: warnings.length > 0,
      hasErrors: warnings.some(w => w.severity === 'error'),
    }
  }

  static getDeveloperWarnings(resolution: PolicyResolution): string[] {
    return resolution.warnings.map(
      w => `[WNP WARNING: ${w.code}] ${w.message} -> ${w.consequence} (Fix: ${w.fix})`
    )
  }
}
