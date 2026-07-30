export interface PaymentSessionParams {
  amount: number
  currency: string
  description: string
  contentId: string
  agentId: string
  successUrl?: string
  cancelUrl?: string
}

export interface PaymentSession {
  sessionId: string
  paymentUrl?: string
  lightningInvoice?: string
  paymentUri?: string
  expiresAt: number
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'expired' | 'refunded'
  transactionId?: string
  amountPaid?: number
  completedAt?: number
}

export interface PaymentCapabilities {
  minAmount: number
  maxAmount: number
  currencies: string[]
  supportsMicroPayments: boolean
  supportsInstantSettlement: boolean
  supportsRecurring: boolean
}

export interface ConfigField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  label: string
  description: string
  required: boolean
  secret?: boolean
  options?: { value: string; label: string }[]
}

export interface ConfigSchema {
  fields: ConfigField[]
}

export interface WNPPaymentProvider {
  provider: string
  name: string
  isAvailable(): Promise<boolean>
  createSession(params: PaymentSessionParams): Promise<PaymentSession>
  checkPayment(sessionId: string): Promise<PaymentStatus>
  getCapabilities(): PaymentCapabilities
  getConfigSchema(): ConfigSchema
}
