import { describe, it, expect } from 'vitest'
import { createWnpMiddleware } from '../src/middleware/middleware.js'

describe('WNP Middleware', () => {
  it('allows human traffic through', async () => {
    const middleware = createWnpMiddleware()
    const req = new Request('http://localhost:3000/docs', {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'accept': 'text/html',
        'accept-language': 'en-US',
      },
    })
    const res = await middleware(req)
    expect(res).toBeNull() // null means pass through
  })

  it('restricts AI scrapers per policy', async () => {
    const middleware = createWnpMiddleware()
    const req = new Request('http://localhost:3000/docs', {
      headers: {
        'user-agent': 'GPTBot/1.0',
      },
    })
    const res = await middleware(req)
    expect(res).not.toBeNull()
    expect(res?.status).toBe(200)
    expect(res?.headers.get('X-WNP-Attribution-Required')).toBe('true')
  })
})
