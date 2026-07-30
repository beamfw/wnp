import { WNPManifest } from '../core/manifest-builder.js'
import { HandshakeHandler } from '../core/handshake-handler.js'

export function wnpExpressMiddleware(manifest: WNPManifest) {
  return (req: any, res: any, next: any) => {
    if (req.path === '/.well-known/wnp-manifest.json') {
      return res.json(manifest)
    }

    const headersObj: Record<string, string> = {}
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headersObj[k] = v
    }

    const result = HandshakeHandler.handleHandshake(headersObj, manifest, req.path)

    for (const [k, v] of Object.entries(result.responseHeaders)) {
      res.setHeader(k, v)
    }

    if (!result.accepted) {
      return res.status(result.statusCode).json({ error: 'Access denied by WNP policy', policy: result.policy.type })
    }

    next()
  }
}
