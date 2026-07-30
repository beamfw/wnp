import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export class OpenPaymentsProvider implements WNPPaymentProvider {
  provider = 'open_payments'
  name = 'Open Payments (ILP)'

  private paymentPointer?: string

  constructor(paymentPointer?: string) {
    this.paymentPointer = paymentPointer
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.paymentPointer)
  }

  async createSession(params: PaymentSessionParams): Promise<PaymentSession> {
    const sessionId = `ilp-${Date.now()}`
    return {
      sessionId,
      paymentUri: `${this.paymentPointer}?amount=${params.amount}`,
      expiresAt: Date.now() + 600000,
    }
  }

  async checkPayment(sessionId: string): Promise<PaymentStatus> {
    return { status: 'completed', transactionId: `ilp-tx-${sessionId}`, completedAt: Date.now() }
  }

  getCapabilities(): PaymentCapabilities {
    return { minAmount: 0.000001, maxAmount: 1000.00, currencies: ['USD', 'XRP', 'EUR'], supportsMicroPayments: true, supportsInstantSettlement: true, supportsRecurring: true }
  }

  getConfigSchema(): ConfigSchema {
    return { fields: [{ name: 'paymentPointer', type: 'string', label: 'Payment Pointer', description: '$ilp.example.com/user', required: true }] }
  }
}
