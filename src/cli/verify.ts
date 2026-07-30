import { AttributionTokenEmbedder } from '../adapters/attribution-adapter.js'

export async function runVerify(args: string[]): Promise<void> {
  const token = args[0]
  if (!token) {
    console.error('Usage: wnp verify <token>')
    return
  }
  const embedder = new AttributionTokenEmbedder()
  const res = await embedder.verifyToken(token)
  if (res.valid) {
    console.log('✅ Token signature and payload verified!')
    console.log(JSON.stringify(res.payload, null, 2))
  } else {
    console.error(`❌ Token invalid: ${res.reason}`)
  }
}
