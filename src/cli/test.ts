import { ConfigLoader } from '../config/config-loader.js'
import { DetectionPipeline } from '../adapters/detection-adapter.js'

export async function runTest(args: string[]): Promise<void> {
  const mockUa = args[0] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  console.log(`[WNP Test] Testing policy evaluation for UA: "${mockUa}"`)
  const config = await ConfigLoader.load()
  const pipeline = new DetectionPipeline(config)
  const req = new Request('http://localhost:3000/blog/test', {
    headers: { 'user-agent': mockUa, accept: 'text/html', 'accept-language': 'en-US' },
  })
  const result = await pipeline.classify(req)
  console.log(`✅ Classification: ${result.classification} (Confidence: ${result.confidence * 100}%)`)
}
