import { describe, it, expect } from 'vitest'
import { WNPPlugin } from '../src/wnp.js'

describe('WNPPlugin Core Engine', () => {
  it('should initialize with default configuration', async () => {
    const plugin = new WNPPlugin()
    await plugin.init()
    expect(plugin.config.version).toBe('0.1.0-beta.1')
    expect(plugin.config.scope.paths).toContain('/**')
  })

  it('should classify human request correctly', async () => {
    const plugin = new WNPPlugin()
    await plugin.init()
    const req = new Request('http://localhost:3000/blog/test', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36',
        'accept': 'text/html',
        'accept-language': 'en-US,en;q=0.9',
      },
    })
    const result = await plugin.processRequest(req)
    expect(result.classification).toBe('human')
    expect(result.confidence).toBeGreaterThan(0.9)
  })

  it('should classify GPTBot as ai_scraper', async () => {
    const plugin = new WNPPlugin()
    await plugin.init()
    const req = new Request('http://localhost:3000/blog/test', {
      headers: {
        'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)',
      },
    })
    const result = await plugin.processRequest(req)
    expect(result.classification).toBe('ai_scraper')
  })
})
