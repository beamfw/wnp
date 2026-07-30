import { describe, it, expect } from 'vitest'
import { WNPPlugin } from '../src/wnp.js'
import { ManifestBuilder } from '../src/core/manifest-builder.js'
import { WNPClient } from '../src/sdk/agent-sdk.js'

describe('WNP End-to-End Integration', () => {
  it('negotiates access through WNPPlugin and WNPClient', async () => {
    const manifest = new ManifestBuilder('Blog Engine', 'blog.example.com')
      .setDefaultPolicy({
        type: 'attribution',
        description: 'Attribution required',
        attribution: { required: true, format: 'Source: {url}', requireLink: true, requireAuthorName: true },
      })
      .build()

    const plugin = new WNPPlugin({ manifest })
    const handshake = plugin.handleHandshake({ 'WNP-Negotiate': 'v=2.0' }, '/post-1')

    expect(handshake.accepted).toBe(true)
    expect(handshake.policy.type).toBe('attribution')
    expect(handshake.responseHeaders['WNP-Policy']).toBe('attribution')

    const client = new WNPClient()
    expect(client).toBeDefined()
  })
})
