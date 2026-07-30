export class WNPRateLimiter {
  private static requests = new Map<string, number[]>()

  static isRateLimited(key: string, limit = 60, windowMs = 60000): boolean {
    const now = Date.now()
    const timestamps = (this.requests.get(key) || []).filter(t => now - t < windowMs)
    if (timestamps.length >= limit) {
      return true
    }
    timestamps.push(now)
    this.requests.set(key, timestamps)
    return false
  }
}
