export class EntropyAnalyzer {
  static calculateEntropy(text: string): number {
    if (!text) return 0
    const charMap: Record<string, number> = {}
    for (const char of text) {
      charMap[char] = (charMap[char] || 0) + 1
    }
    const len = text.length
    let entropy = 0
    for (const char in charMap) {
      const p = charMap[char] / len
      entropy -= p * Math.log2(p)
    }
    return entropy
  }

  static isLowEntropyGarbage(text: string): boolean {
    const entropy = this.calculateEntropy(text)
    return text.length > 100 && entropy < 3.0
  }
}
