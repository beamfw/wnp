import { WNPPlugin } from '../wnp.js'
import { ConfigLoadOptions } from '../config/config-loader.js'

export function createWnpMiddleware(options?: ConfigLoadOptions) {
  const plugin = new WNPPlugin()
  let initPromise: Promise<void> | null = null

  return async (req: Request): Promise<Response | null> => {
    if (!initPromise) {
      initPromise = plugin.init(options)
    }
    await initPromise

    const classification = await plugin.processRequest(req)
    
    if (classification.classification === 'ai_scraper') {
      const policy = plugin.config.policies.ai_scraper
      if (policy && (policy.action === 'summary_only' || policy.action === 'progressive_disclosure')) {
        const headers = new Headers({ 'content-type': 'application/json' })
        headers.set('X-WNP-Attribution-Required', 'true')
        return new Response(
          JSON.stringify({
            message: 'Access restricted per WNP policy.',
            attribution: policy.attribution_format || 'Source attribution required.',
          }),
          { status: 200, headers }
        )
      }
    }

    return null // Allow full access for human/allowed traffic
  }
}
