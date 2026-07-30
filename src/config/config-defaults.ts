import { WNPConfig } from '../types.js'

export function getDefaultConfig(): WNPConfig {
  return {
    version: '2.0',
    scope: {
      paths: ['/**'],
      exclude: ['/favicon.ico', '/robots.txt', '/public/**'],
    },
    policies: {
      human: {
        action: 'allow_full',
        detection: 'auto',
        description: 'Human visitors are never blocked or modified',
      },
      search_bot: {
        action: 'allow_indexing',
        max_words: 150,
        require_attribution: true,
      },
      ai_scraper: {
        action: 'progressive_disclosure',
        layers: [
          { depth: 1, action: 'summary_only', max_words: 50, attribution: 'required' },
          { depth: 2, action: 'snippet_with_link', max_words: 200, attribution: 'required' },
        ],
      },
      unknown_bot: {
        action: 'progressive_disclosure',
      },
    },
    adapters: {
      detection: [
        { name: 'header-analysis', enabled: true, priority: 1, config: {} },
        { name: 'tls-fingerprint', enabled: true, priority: 2, config: {} },
        { name: 'pattern-analysis', enabled: true, priority: 3, config: {} },
      ],
      attribution: [
        { name: 'token-embed', enabled: true, config: {} },
      ],
    },
    telemetry: {
      enabled: false,
      self_hosted: true,
      metrics: [],
    },
  }
}
