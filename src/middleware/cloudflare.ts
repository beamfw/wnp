import { WNPManifest } from '../core/manifest-builder.js'
import { UniversalWNPMiddleware } from '../sdk/middleware.js'

export function createCloudflareWNPHandler(manifest: WNPManifest) {
  const middleware = new UniversalWNPMiddleware(manifest)

  return {
    async fetch(request: Request, _env: any, _ctx: any): Promise<Response> {
      const res = await middleware.handleRequest(request)
      if (res) return res
      return fetch(request)
    },
  }
}
