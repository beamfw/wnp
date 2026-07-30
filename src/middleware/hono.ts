import { WNPManifest } from '../core/manifest-builder.js'
import { UniversalWNPMiddleware } from '../sdk/middleware.js'

export function wnpHonoMiddleware(manifest: WNPManifest) {
  const middleware = new UniversalWNPMiddleware(manifest)

  return async (c: any, next: any) => {
    const res = await middleware.handleRequest(c.req.raw)
    if (res) return res
    await next()
  }
}
