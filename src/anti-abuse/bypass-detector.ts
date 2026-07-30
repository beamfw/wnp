export class BypassDetector {
  static isScraperBypassAttempt(headers: Record<string, string | undefined>): boolean {
    const userAgent = headers['user-agent'] || headers['User-Agent'] || ''

    // Common bot user-agents attempting stealth
    const isBotUA = /GPTBot|ChatGPT-User|ClaudeBot|Bytespider|CCBot|PerplexityBot|Diffbot|Scrapy|python-requests/i.test(userAgent)
    const claimsWNP = Boolean(headers['wnp-negotiate'] || headers['WNP-Negotiate'])

    // If it's a known AI bot trying to bypass WNP by omitting WNP-Negotiate
    if (isBotUA && !claimsWNP) {
      return true
    }

    return false
  }
}
