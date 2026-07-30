import { describe, it, expect } from 'vitest'
import { ProtocolEngine, WNP_HEADERS } from '../src/core/protocol-engine.js'
import { ManifestBuilder } from '../src/core/manifest-builder.js'
import { ManifestValidator } from '../src/core/manifest-validator.js'

describe('WNP Protocol & Manifest Engine', () => {
  it('parses request headers correctly', () => {
    const headers = {
      [WNP_HEADERS.REQUEST.NEGOTIATE]: 'v=2.0',
      [WNP_HEADERS.REQUEST.PURPOSE]: 'ai-training',
      [WNP_HEADERS.REQUEST.BUDGET]: 'max_price_per_token=0.002; max_total=0.05',
      [WNP_HEADERS.REQUEST.AGENT]: 'OpenAI-GPTBot/1.0',
    }

    const parsed = ProtocolEngine.parseRequestHeaders(headers)
    expect(parsed.agentName).toBe('OpenAI-GPTBot/1.0')
    expect(parsed.purpose).toBe('ai-training')
    expect(parsed.budgetMaxTokenPrice).toBe(0.002)
    expect(parsed.budgetMaxTotal).toBe(0.05)
  })

  it('builds a valid WNP manifest', () => {
    const manifest = new ManifestBuilder('Tech Hub', 'techhub.io')
      .setDescription('Technology articles and tutorials')
      .setDefaultPolicy({
        type: 'attribution',
        description: 'Free with attribution',
        attribution: { required: true, format: 'Source: {url}', requireLink: true, requireAuthorName: true },
      })
      .addPathPolicy('/premium/*', {
        type: 'micropayment',
        description: 'Paid content',
        micropayment: { currency: 'USD', amountPerToken: 0.001, minimumAmount: 0.01, maximumAmount: 5.00 },
      })
      .build()

    expect(manifest.version).toBe('2.0')
    expect(manifest.site.name).toBe('Tech Hub')
    expect(manifest.defaultPolicy.type).toBe('attribution')
    expect(manifest.policies.length).toBe(1)

    const validation = ManifestValidator.validate(manifest)
    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})
