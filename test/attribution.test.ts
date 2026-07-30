import { describe, it, expect } from 'vitest'
import { AttributionTokenEmbedder } from '../src/adapters/attribution-adapter.js'

describe('Attribution Token Embedder', () => {
  it('generates and verifies tokens', async () => {
    const embedder = new AttributionTokenEmbedder()
    const token = await embedder.generateToken({
      title: 'Sample Title',
      canonicalUrl: 'http://localhost:3000/sample',
      siteName: 'Sample Site',
      siteUrl: 'http://localhost:3000',
      type: 'html',
    })

    expect(token.token).toBeDefined()
    expect(token.payload.title).toBe('Sample Title')

    const verification = await embedder.verifyToken(token.token)
    expect(verification.valid).toBe(true)
  })
})
