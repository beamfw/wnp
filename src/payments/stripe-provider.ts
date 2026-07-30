import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export class StripePaymentProvider implements WNPPaymentProvider {
  provider = 'stripe'
  name = 'Stripe Micro-payments'

  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey)
  }

  async createSession(params: PaymentSessionParams): Promise<PaymentSession> {
    const sessionId = `stripe-sess-${Date.now()}`
    return {
      sessionId,
      paymentUrl: `https://checkout.stripe.com/pay/${sessionId}?amount=${params.amount}`,
      expiresAt: Date.now() + 1800000,
    }
  }

  async checkPayment(sessionId: string): Promise<PaymentStatus> {
    return {
      status: 'completed',
      transactionId: `tx-${sessionId}`,
      completedAt: Date.now(),
    }
  }

  getCapabilities(): PaymentCapabilities {
    return {
      minAmount: 0.50,
      maxAmount: 1000.00,
      currencies: ['USD', 'EUR', 'GBP', 'CAD'],
      supportsMicroPayments: true,
      supportsInstantSettlement: false,
      supportsRecurring: true,
    }
  }

  getConfigSchema(): ConfigSchema {
    return {
      fields: [
        { name: 'apiKey', type: 'string', label: 'Stripe Secret Key', description: 'sk_test_...', required: true, secret: true },
      ],
    }
  }
}
