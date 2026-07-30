import { AttributionToken, ContentToProtect, VerificationResult } from '../types.js'

export class AttributionTokenEmbedder {
  async generateToken(content: ContentToProtect): Promise<AttributionToken> {
    const payload = {
      content_id: content.id || `wnp_${Math.random().toString(36).substring(2, 9)}`,
      canonical_url: content.canonicalUrl,
      title: content.title,
      creator: content.creator || content.siteName,
      site: content.siteName,
      license_url: `${content.siteUrl}/.well-known/wnp-license.json`,
      requires_attribution: true,
      issued_at: Math.floor(Date.now() / 1000),
      expires_at: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60),
    }

    const header = { alg: 'HS256', typ: 'JWT' }
    const token = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.sig`

    return {
      token,
      payload,
      embed_methods: ['http_headers', 'meta_tags', 'json_ld', 'invisible_watermark'],
    }
  }

  async embed(response: Response, content: ContentToProtect, token: AttributionToken): Promise<Response> {
    const headers = new Headers(response.headers)
    let body = await response.text()

    headers.set('X-WNP-Attribution-Token', token.token || '')
    headers.set('X-WNP-Content-ID', token.payload.content_id)
    headers.set('X-WNP-License', token.payload.license_url)

    if (response.headers.get('content-type')?.includes('text/html')) {
      const meta = `\n  <meta name="wnp-content-id" content="${token.payload.content_id}">\n  <meta name="wnp-token" content="${token.token || ''}">`
      body = body.replace('</head>', `${meta}\n</head>`)

      const watermark = this.encodeZeroWidth(token.payload.content_id)
      body = `${watermark}${body}`
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  async verifyToken(token: string): Promise<VerificationResult> {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return { valid: false, reason: 'Invalid token format', payload: null }
      const payload = JSON.parse(atob(parts[1]))
      return { valid: true, reason: null, payload }
    } catch {
      return { valid: false, reason: 'Parse error', payload: null }
    }
  }

  private encodeZeroWidth(id: string): string {
    return id
      .split('')
      .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('')
      .split('')
      .map(b => (b === '0' ? '\u200B' : '\u200C'))
      .join('')
  }
}
