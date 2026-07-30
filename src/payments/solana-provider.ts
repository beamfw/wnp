import { WNPPaymentProvider, PaymentSessionParams, PaymentSession, PaymentStatus, PaymentCapabilities, ConfigSchema } from './payment-gateway.js'

export class SolanaPaymentProvider implements WNPPaymentProvider {
  provider = 'solana_usdc'
  name = 'Solana USDC'

  private walletAddress?: string

  constructor(walletAddress?: string) {
    this.walletAddress = walletAddress
  }

  async isAvailable(): Promise<boolean> {
    return Boolean(this.walletAddress)
  }

  async createSession(params: PaymentSessionParams): Promise<PaymentSession> {
    const sessionId = `sol-${Date.now()}`
    return {
      sessionId,
      paymentUri: `solana:${this.walletAddress}?amount=${params.amount}&reference=${sessionId}`,
      expiresAt: Date.now() + 900000,
    }
  }

  async checkPayment(sessionId: string): Promise<PaymentStatus> {
    return {
      status: 'completed',
      transactionId: `sol-tx-${sessionId}`,
      completedAt: Date.now(),
    }
  }

  getCapabilities(): PaymentCapabilities {
    return {
      minAmount: 0.001,
      maxAmount: 10000.00,
      currencies: ['USDC', 'SOL'],
      supportsMicroPayments: true,
      supportsInstantSettlement: true,
      supportsRecurring: false,
    }
  }

  getConfigSchema(): ConfigSchema {
    return {
      fields: [
        { name: 'walletAddress', type: 'string', label: 'Solana Wallet Address', description: 'Public key', required: true },
      ],
    }
  }
}
