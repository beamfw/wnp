import { describe, it, expect } from 'vitest'
import { PolicyEngine } from '../src/policies/policy-engine.js'
import { WNPPolicy } from '../src/core/manifest-builder.js'

describe('WNP Policy Engine', () => {
  it('evaluates free policy', async () => {
    const policy: WNPPolicy = { type: 'free', description: 'Free' }
    const res = await PolicyEngine.evaluate(policy, { url: 'https://example.com/free', headers: {} })
    expect(res.allowed).toBe(true)
    expect(res.statusCode).toBe(200)
    expect(res.policyType).toBe('free')
  })

  it('evaluates attribution policy', async () => {
    const policy: WNPPolicy = {
      type: 'attribution',
      description: 'Attribution required',
      attribution: { required: true, format: 'Published by {url}', requireLink: true, requireAuthorName: false },
    }
    const res = await PolicyEngine.evaluate(policy, { url: 'https://example.com/post', headers: {} })
    expect(res.allowed).toBe(true)
    expect(res.attributionText).toBe('Published by https://example.com/post')
  })

  it('evaluates micropayment policy without token (payment required)', async () => {
    const policy: WNPPolicy = {
      type: 'micropayment',
      description: 'Micro-payment content',
      micropayment: { currency: 'USD', amountPerToken: 0.002, minimumAmount: 0.01, maximumAmount: 1.00 },
    }
    const res = await PolicyEngine.evaluate(policy, { url: 'https://example.com/paid', headers: {} })
    expect(res.allowed).toBe(false)
    expect(res.statusCode).toBe(402)
    expect(res.paymentRequired).toBe(true)
  })

  it('evaluates micropayment policy with valid token', async () => {
    const policy: WNPPolicy = {
      type: 'micropayment',
      description: 'Micro-payment content',
    }
    const res = await PolicyEngine.evaluate(policy, {
      url: 'https://example.com/paid',
      headers: { 'wnp-access-token': 'valid-token' },
    })
    expect(res.allowed).toBe(true)
    expect(res.statusCode).toBe(200)
  })

  it('evaluates license policy', async () => {
    const policy: WNPPolicy = { type: 'license', description: 'License required' }
    const res = await PolicyEngine.evaluate(policy, { url: 'https://example.com/enterprise', headers: {} })
    expect(res.allowed).toBe(false)
    expect(res.statusCode).toBe(403)
  })
})
