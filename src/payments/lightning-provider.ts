import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export class LightningPaymentProvider implements WNPPaymentProvider {
  provider = 'lightning'
  name = 'Bitcoin Lightning / LNURL'

  private lnurl?: string

  constructor(lnurl?: string) {
    this.lnurl = lnurl
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.lnurl)
  }

  async createSession(params: PaymentSessionParams): Promise<PaymentSession> {
    const sessionId = `ln-${Date.now()}`
    const sats = Math.ceil(params.amount * 2000) // approx sats
    return {
      sessionId,
      lightningInvoice: `lnbc${sats}u1p...`,
      expiresAt: Date.now() + 600000,
    }
  }

  async checkPayment(sessionId: string): Promise<PaymentStatus> {
    return {
      status: 'completed',
      transactionId: `ln-tx-${sessionId}`,
      completedAt: Date.now(),
    }
  }

  getCapabilities(): PaymentCapabilities {
    return {
      minAmount: 0.0001,
      maxAmount: 100.00,
      currencies: ['SAT', 'BTC', 'USD'],
      supportsMicroPayments: true,
      supportsInstantSettlement: true,
      supportsRecurring: false,
    }
  }

  getConfigSchema(): ConfigSchema {
    return {
      fields: [
        { name: 'lnurl', type: 'string', label: 'LNURL or Lightning Address', description: 'user@getalby.com', required: true },
      ],
    }
  }
}
