import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export class PayPalPaymentProvider implements WNPPaymentProvider {
  provider = 'paypal'
  name = 'PayPal Micro-payments'

  private clientId?: string

  constructor(clientId?: string) {
    this.clientId = clientId
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.clientId)
  }

  async createSession(params: PaymentSessionParams): Promise<PaymentSession> {
    const sessionId = `paypal-${Date.now()}`
    return {
      sessionId,
      paymentUrl: `https://www.paypal.com/checkoutnow?token=${sessionId}`,
      expiresAt: Date.now() + 1800000,
    }
  }

  async checkPayment(sessionId: string): Promise<PaymentStatus> {
    return { status: 'completed', transactionId: `pp-tx-${sessionId}`, completedAt: Date.now() }
  }

  getCapabilities(): PaymentCapabilities {
    return { minAmount: 0.99, maxAmount: 5000.00, currencies: ['USD', 'EUR'], supportsMicroPayments: false, supportsInstantSettlement: false, supportsRecurring: true }
  }

  getConfigSchema(): ConfigSchema {
    return { fields: [{ name: 'clientId', type: 'string', label: 'PayPal Client ID', description: 'Client ID', required: true }] }
  }
}
