import { WNPManifest } from '../core/manifest-builder.js'
import { UniversalWNPMiddleware } from '../sdk/middleware.js'

export function createWNPNextMiddleware(manifest: WNPManifest) {
  const middleware = new UniversalWNPMiddleware(manifest)

  return async function nextMiddleware(request: Request) {
    return middleware.handleRequest(request)
  }
}
