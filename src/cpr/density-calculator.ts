import { WNPPricing } from '../core/manifest-builder.js'

export type FairnessLevel = 'free' | 'excellent-value' | 'good-value' | 'fair' | 'overpriced' | 'significantly-overpriced'

export interface ContentMetadata {
  domainAge?: number
  creatorVerified?: boolean
  originalityScore?: number
  categories?: string[]
  createdAt?: string
}

export interface CPRReport {
  cpr: number
  density: number
  originality: number
  authority: number
  effectivePrice: number
  fairness: FairnessLevel
  recommendation: string
  details: {
    wordCount: number
    uniqueWordRatio: number
    sentenceComplexity: number
  }
}

export class CPRCalculator {
  static calculate(
    content: string,
    price: WNPPricing,
    metadata: ContentMetadata
  ): CPRReport {
    const density = this._calculateDensity(content)
    const originality = metadata.originalityScore || 50
    const authority = this._calculateAuthority(metadata)
    const effectivePrice = price.ratePerToken || 0.001

    const cpr = effectivePrice > 0 ? (density * originality * authority) / (effectivePrice * 1000) : 100
    const fairness = this._determineFairness(cpr, effectivePrice)

    const words = content.split(/\s+/).filter(Boolean)

    return {
      cpr,
      density,
      originality,
      authority,
      effectivePrice,
      fairness,
      recommendation: this._getRecommendation(fairness, cpr),
      details: {
        wordCount: words.length,
        uniqueWordRatio: this._calculateUniqueWordRatio(content),
        sentenceComplexity: this._calculateSentenceComplexity(content),
      },
    }
  }

  private static _calculateDensity(content: string): number {
    const words = content.split(/\s+/).filter(Boolean)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim())

    if (words.length === 0) return 0

    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const uniqueRatio = uniqueWords.size / words.length

    const avgSentenceLength = words.length / Math.max(sentences.length, 1)
    const sentenceScore = avgSentenceLength > 50 ? 0.5 : avgSentenceLength > 20 ? 0.8 : avgSentenceLength > 10 ? 1.0 : 0.7

    const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with'])
    const stopWordCount = words.filter(w => stopWords.has(w.toLowerCase())).length
    const stopWordRatio = 1 - (stopWordCount / words.length)

    return (uniqueRatio * 0.4 + sentenceScore * 0.3 + stopWordRatio * 0.3) * 100
  }

  private static _calculateAuthority(metadata: ContentMetadata): number {
    let score = 50
    if (metadata.domainAge) score += Math.min((metadata.domainAge / 365) * 5, 25)
    if (metadata.creatorVerified) score += 15
    if (metadata.originalityScore && metadata.originalityScore > 80) score += 10
    return Math.min(score, 100)
  }

  private static _determineFairness(cpr: number, effectivePrice: number): FairnessLevel {
    if (effectivePrice === 0) return 'free'
    if (cpr >= 10) return 'excellent-value'
    if (cpr >= 5) return 'good-value'
    if (cpr >= 2) return 'fair'
    if (cpr >= 1) return 'overpriced'
    return 'significantly-overpriced'
  }

  private static _calculateUniqueWordRatio(content: string): number {
    const words = content.toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return 0
    return new Set(words).size / words.length
  }

  private static _calculateSentenceComplexity(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim())
    if (sentences.length === 0) return 0
    const avgWords = sentences.reduce((s, sent) => s + sent.split(/\s+/).filter(Boolean).length, 0) / sentences.length
    return Math.min(avgWords / 25, 1)
  }

  private static _getRecommendation(fairness: FairnessLevel, _cpr: number): string {
    switch (fairness) {
      case 'free': return 'Content is free. No pricing concerns.'
      case 'excellent-value': return 'Excellent value. Price is fair for the content quality.'
      case 'good-value': return 'Good value. Price is reasonable.'
      case 'fair': return 'Fair price. Consider adding more substance or lowering price.'
      case 'overpriced': return 'Content is overpriced. Consider reducing price or improving content density.'
      case 'significantly-overpriced': return 'Content is significantly overpriced. AI agents will likely skip this content.'
    }
  }
}
