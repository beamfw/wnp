import { describe, it, expect } from 'vitest'
import { WNPEngine, ManifestBuilder, WNP_HEADERS } from '../src/index.js'
import { wnpExpressMiddleware } from '../src/middleware/express.js'

describe('WNP Standalone Local Integration Suite', () => {
  it('instantiates WNPEngine with default 0.1.0-beta.1 config', async () => {
    const manifest = new ManifestBuilder('Local Node', 'localhost').build()
    const engine = new WNPEngine({ manifest })
    await engine.init()
    expect(engine.config.version).toBe('0.1.0-beta.1')
    expect(engine.manifest.site.name).toBe('Local Node')
  })

  it('evaluates WNP handshake headers for AI scraper bot vs human', async () => {
    const manifest = new ManifestBuilder('Local Node', 'localhost').build()
    const engine = new WNPEngine({ manifest })

    const botReq = new Request('http://localhost/article', {
      headers: { 'user-agent': 'GPTBot/1.0', 'x-wnp-version': '0.1.0-beta.1' },
    })
    const classification = await engine.processRequest(botReq)
    expect(classification.classification).toBe('ai_scraper')

    const handshake = engine.handleHandshake(
      { 'user-agent': 'GPTBot/1.0', [WNP_HEADERS.REQUEST.NEGOTIATE]: 'version=0.1.0-beta.1' },
      '/article'
    )
    expect(handshake.accepted).toBe(true)
    expect(handshake.manifest?.site.name).toBe('Local Node')
    expect(handshake.responseHeaders[WNP_HEADERS.RESPONSE.POLICY]).toBe('free')
  })

  it('runs express middleware handler without errors', async () => {
    const manifest = new ManifestBuilder('Express WNP Node', 'localhost').build()
    const middleware = wnpExpressMiddleware(manifest)

    const req: any = {
      headers: { 'user-agent': 'ClaudeBot/1.0' },
      path: '/api/content',
      url: '/api/content',
    }

    const res: any = {
      headers: {} as Record<string, string>,
      setHeader(name: string, value: string) {
        this.headers[name.toLowerCase()] = value
      },
    }

    let nextCalled = false
    await middleware(req, res, () => {
      nextCalled = true
    })

    expect(nextCalled).toBe(true)
    expect(res.headers[WNP_HEADERS.RESPONSE.POLICY.toLowerCase()]).toBe('free')
  })
})
