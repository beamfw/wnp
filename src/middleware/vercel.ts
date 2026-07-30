import { createWnpMiddleware } from './middleware.js'
import { ConfigLoadOptions } from '../config/config-loader.js'

export function wnp(handler: (req: Request) => Promise<Response>, options?: ConfigLoadOptions) {
  const middleware = createWnpMiddleware(options)

  return async (req: Request): Promise<Response> => {
    const blockedRes = await middleware(req)
    if (blockedRes) return blockedRes
    return handler(req)
  }
}
