import * as crypto from 'crypto'
import { AccessTokenPayload } from './token-issuer.js'

export interface VerificationResult {
  valid: boolean
  payload?: AccessTokenPayload
  error?: string
}

export class TokenVerifier {
  private secretKey: string

  constructor(secretKey: string = 'wnp-default-secret-key-change-in-prod') {
    this.secretKey = secretKey
  }

  verifyToken(token: string, currentUrl?: string): VerificationResult {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token structure' }
      }

      const [header, body, signature] = parts

      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(`${header}.${body}`)
        .digest('base64url')

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid token signature' }
      }

      const payload: AccessTokenPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'))

      const now = Math.floor(Date.now() / 1000)
      if (payload.expiresAt < now) {
        return { valid: false, error: 'Token has expired', payload }
      }

      if (currentUrl && payload.url !== currentUrl) {
        return { valid: false, error: `Token URL mismatch: expected "${payload.url}", got "${currentUrl}"`, payload }
      }

      return { valid: true, payload }
    } catch (err: any) {
      return { valid: false, error: `Token parsing failed: ${err.message}` }
    }
  }
}
