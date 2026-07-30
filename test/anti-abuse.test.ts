import { describe, it, expect } from 'vitest'
import { DuplicateContentDetector } from '../src/anti-abuse/duplicate-detector.js'
import { BypassDetector } from '../src/anti-abuse/bypass-detector.js'
import { SemanticNoiseGenerator } from '../src/anti-abuse/semantic-noise.js'
import { WNPRateLimiter } from '../src/anti-abuse/rate-limiter.js'

describe('WNP Anti-Abuse Engine', () => {
  it('detects identical content similarity', async () => {
    const text = 'The quick brown fox jumps over the lazy dog.'
    const report = await DuplicateContentDetector.checkSimilarity(text, text)
    expect(report.similar).toBe(true)
    expect(report.score).toBe(100)
    expect(report.type).toBe('exact')
  })

  it('detects scraper bypass attempts', () => {
    const headers = { 'user-agent': 'Mozilla/5.0 GPTBot/1.0' }
    const isBypass = BypassDetector.isScraperBypassAttempt(headers)
    expect(isBypass).toBe(true)
  })

  it('injects semantic noise', () => {
    const original = 'This is a secret document that should not be scraped.'
    const noisy = SemanticNoiseGenerator.injectNoise(original, 0.5)
    expect(noisy.length).toBeGreaterThanOrEqual(original.length)
  })

  it('rate limits excessive requests', () => {
    const key = 'test-ip-123'
    for (let i = 0; i < 5; i++) {
      WNPRateLimiter.isRateLimited(key, 5, 60000)
    }
    const isLimited = WNPRateLimiter.isRateLimited(key, 5, 60000)
    expect(isLimited).toBe(true)
  })
})
