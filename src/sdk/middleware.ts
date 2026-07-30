import { WNPManifest } from '../core/manifest-builder.js'
import { HandshakeHandler } from '../core/handshake-handler.js'

export class UniversalWNPMiddleware {
  private manifest: WNPManifest

  constructor(manifest: WNPManifest) {
    this.manifest = manifest
  }

  async handleRequest(request: Request): Promise<Response | null> {
    const url = new URL(request.url)

    // Serve manifest at /.well-known/wnp-manifest.json
    if (url.pathname === '/.well-known/wnp-manifest.json') {
      return new Response(JSON.stringify(this.manifest, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const headersObj: Record<string, string> = {}
    request.headers.forEach((v, k) => { headersObj[k] = v })

    const result = HandshakeHandler.handleHandshake(headersObj, this.manifest, url.pathname)

    if (!result.accepted) {
      return new Response(
        JSON.stringify({ error: 'Access denied by WNP policy', policy: result.policy.type }),
        {
          status: result.statusCode,
          headers: {
            'Content-Type': 'application/json',
            ...result.responseHeaders,
          },
        }
      )
    }

    return null // Allow request to proceed
  }
}
