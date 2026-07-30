import { ClassificationResult, ConsumerType, WNPConfig } from '../types.js'

export class DetectionPipeline {
  private config: WNPConfig

  constructor(config: WNPConfig) {
    this.config = config
  }

  async classify(request: Request): Promise<ClassificationResult> {
    const ua = (request.headers.get('user-agent') || '').toLowerCase()
    
    let classification: ConsumerType = 'unknown_bot'
    let confidence = 0.5

    if (ua.includes('gptbot') || ua.includes('claude-web') || ua.includes('bytespider') || ua.includes('ccbot')) {
      classification = 'ai_scraper'
      confidence = 0.95
    } else if (ua.includes('perplexitybot')) {
      classification = 'live_search'
      confidence = 0.95
    } else if (ua.includes('googlebot') || ua.includes('bingbot') || ua.includes('duckduckbot')) {
      classification = 'search_bot'
      confidence = 0.95
    } else if (ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari') || ua.includes('firefox')) {
      const hasAccept = request.headers.has('accept')
      const hasLang = request.headers.has('accept-language')
      if (!hasAccept || !hasLang) {
        classification = 'ai_scraper'
        confidence = 0.65
      } else {
        classification = 'human'
        confidence = 0.95
      }
    }

    return {
      classification,
      confidence,
      userAgent: ua,
      ip: '127.0.0.1',
      evidence: [
        {
          classification,
          weight: confidence,
          source: 'header-analysis',
          detail: `User-Agent: ${ua}`,
        },
      ],
      adapter: 'detection-pipeline',
    }
  }
}
