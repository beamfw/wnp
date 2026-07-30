export class PriceSanityEngine {
  static validatePrice(amountPerToken: number, currency = 'USD'): { valid: boolean; reason?: string } {
    if (amountPerToken < 0) {
      return { valid: false, reason: 'Price cannot be negative' }
    }
    if (amountPerToken > 0.10) {
      return { valid: false, reason: `Price ${amountPerToken} ${currency}/token exceeds safety ceiling of 0.10 ${currency}/token` }
    }
    return { valid: true }
  }
}
