import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('WNP VitePress Local Docs Verification Suite', () => {
  const docsDir = path.resolve(__dirname, '../docs')

  it('verifies .vitepress/config.ts exists and includes depthindex plugin', () => {
    const configPath = path.join(docsDir, '.vitepress/config.ts')
    expect(fs.existsSync(configPath)).toBe(true)

    const content = fs.readFileSync(configPath, 'utf-8')
    expect(content).toContain("import depthIndexPlugin from 'vitepress-plugin-depthindex'")
    expect(content).toContain('plugins: [depthIndexPlugin()]')
  })

  it('verifies all guide and API markdown documentation files exist', () => {
    const requiredFiles = [
      'index.md',
      'guide/getting-started.md',
      'guide/protocol-spec.md',
      'guide/policy-engine.md',
      'guide/middleware.md',
      'guide/anti-scraping.md',
      'guide/attribution-receipts.md',
      'api/reference.md',
    ]

    for (const relFile of requiredFiles) {
      const fullPath = path.join(docsDir, relFile)
      expect(fs.existsSync(fullPath)).toBe(true)

      const fileContent = fs.readFileSync(fullPath, 'utf-8')
      expect(fileContent.length).toBeGreaterThan(100)
    }
  })

  it('verifies 100% third-party framework focus in middleware documentation', () => {
    const middlewareDocPath = path.join(docsDir, 'guide/middleware.md')
    const content = fs.readFileSync(middlewareDocPath, 'utf-8')

    expect(content).toContain('Express.js')
    expect(content).toContain('Fastify')
    expect(content).toContain('Next.js')
    expect(content).toContain('Hono')
    expect(content).toContain('Koa')
    expect(content).toContain('Cloudflare Workers')
    expect(content).toContain('Native Node.js `http` Server')
  })
})
