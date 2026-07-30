export async function runInit(args: string[]): Promise<void> {
  console.log('[WNP Init] Generating default webnode.config.yml...')
  const defaultConfigYaml = `version: "2.0"
scope:
  paths:
    - "/articles/**"
    - "/blog/**"
  exclude:
    - "/public/**"
policies:
  human:
    action: allow_full
  search_bot:
    action: allow_indexing
  ai_scraper:
    action: progressive_disclosure
    layers:
      - depth: 1
        action: summary_only
        max_words: 50
  unknown_bot:
    action: progressive_disclosure
`
  console.log('webnode.config.yml content preview:')
  console.log(defaultConfigYaml)
  console.log('✅ Configuration template ready!')
}
