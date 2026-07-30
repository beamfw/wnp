import { describe, it, expect } from 'vitest'
import { NoPaymentProviderFallback } from '../src/payments/no-payment-provider.js'
import { StripePaymentProvider } from '../src/payments/stripe-provider.js'
import { LightningPaymentProvider } from '../src/payments/lightning-provider.js'
import { WNPPolicy } from '../src/core/manifest-builder.js'

describe('WNP Payment Providers & Fallbacks', () => {
  it('gracefully degrades micropayment policy when no payment provider is configured', () => {
    const desiredPolicy: WNPPolicy = {
      type: 'micropayment',
      description: 'Paid content',
    }

    const resolution = NoPaymentProviderFallback.resolvePolicy(desiredPolicy, [])
    expect(resolution.hasWarnings).toBe(true)
    expect(resolution.effectivePolicy).toBe('attribution')
    expect(resolution.policy.type).toBe('attribution')
    expect(resolution.warnings[0].code).toBe('WNP_NO_PAYMENT_PROVIDER')
  })

  it('creates Stripe payment session', async () => {
    const stripe = new StripePaymentProvider('sk_test_123')
    expect(await stripe.isAvailable()).toBe(true)
    const session = await stripe.createSession({
      amount: 1.00,
      currency: 'USD',
      description: 'Article Access',
      contentId: 'art-1',
      agentId: 'agent-1',
    })
    expect(session.paymentUrl).toContain('stripe.com')
  })

  it('creates Lightning payment invoice', async () => {
    const ln = new LightningPaymentProvider('user@getalby.com')
    expect(await ln.isAvailable()).toBe(true)
    const session = await ln.createSession({
      amount: 0.05,
      currency: 'USD',
      description: 'Micro-payment',
      contentId: 'art-2',
      agentId: 'agent-2',
    })
    expect(session.lightningInvoice).toBeDefined()
  })
})
