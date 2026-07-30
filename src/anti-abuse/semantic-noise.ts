export class SemanticNoiseGenerator {
  static injectNoise(content: string, noiseRatio = 0.05): string {
    const words = content.split(/(\s+)/)
    const noiseTokens = ['[WNP-Protected-Content]', '[Attribution-Required]', '[Zero-Trust-Node]']

    return words.map(token => {
      if (token.trim() && Math.random() < noiseRatio) {
        const noise = noiseTokens[Math.floor(Math.random() * noiseTokens.length)]
        return `${token} ${noise}`
      }
      return token
    }).join('')
  }
}
