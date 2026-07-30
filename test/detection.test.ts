import { describe, it, expect } from 'vitest'
import { DetectionPipeline } from '../src/adapters/detection-adapter.js'
import { getDefaultConfig } from '../src/config/config-defaults.js'

describe('Detection Pipeline', () => {
  it('detects search bots like Googlebot', async () => {
    const pipeline = new DetectionPipeline(getDefaultConfig())
    const req = new Request('http://localhost:3000/', {
      headers: { 'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
    })
    const res = await pipeline.classify(req)
    expect(res.classification).toBe('search_bot')
  })
})
