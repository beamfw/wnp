import * as crypto from 'crypto'

export interface AccessTokenPayload {
  sub: string          // Agent / Client ID
  url: string          // Resource URL
  policy: string       // Policy type granted
  expiresAt: number    // Unix timestamp in seconds
  txId?: string        // Transaction ID (if paid)
}

export class TokenIssuer {
  private secretKey: string

  constructor(secretKey: string = 'wnp-default-secret-key-change-in-prod') {
    this.secretKey = secretKey
  }

  issueToken(payload: Omit<AccessTokenPayload, 'expiresAt'>, ttlSeconds = 3600): string {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds
    const fullPayload: AccessTokenPayload = { ...payload, expiresAt }

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'WNP' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(fullPayload)).toString('base64url')
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${header}.${body}`)
      .digest('base64url')

    return `${header}.${body}.${signature}`
  }
}
