import { WNPManifest } from '../core/manifest-builder.js'
import { HandshakeHandler } from '../core/handshake-handler.js'

export function wnpFastifyPlugin(manifest: WNPManifest) {
  return async (fastify: any) => {
    fastify.get('/.well-known/wnp-manifest.json', async () => manifest)

    fastify.addHook('onRequest', async (req: any, reply: any) => {
      if (req.routerPath === '/.well-known/wnp-manifest.json') return

      const headersObj: Record<string, string> = {}
      for (const [k, v] of Object.entries(req.headers)) {
        if (typeof v === 'string') headersObj[k] = v
      }

      const result = HandshakeHandler.handleHandshake(headersObj, manifest, req.url)

      for (const [k, v] of Object.entries(result.responseHeaders)) {
        reply.header(k, v)
      }

      if (!result.accepted) {
        reply.code(result.statusCode).send({ error: 'Access denied by WNP policy', policy: result.policy.type })
      }
    })
  }
}
