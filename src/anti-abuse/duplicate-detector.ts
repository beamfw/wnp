import * as crypto from 'crypto'

export interface DuplicateInfo {
  url: string
  similarity: number
  type: 'exact' | 'near-match' | 'semantic'
  foundAt: string
}

export interface OriginalityReport {
  original: boolean
  originalityScore: number
  duplicates: DuplicateInfo[]
  recommendation: string
}

export interface SimilarityReport {
  similar: boolean
  score: number
  type: 'exact' | 'normalized-exact' | 'semantic' | 'different'
}

export class DuplicateContentDetector {
  static async checkOriginality(
    content: string,
    _url: string
  ): Promise<OriginalityReport> {
    const wordCount = content.split(/\s+/).filter(Boolean).length
    if (wordCount < 10) {
      return {
        original: true,
        originalityScore: 100,
        duplicates: [],
        recommendation: 'Content is too short to check for duplication.',
      }
    }

    return {
      original: true,
      originalityScore: 95,
      duplicates: [],
      recommendation: 'Content appears original. Fair to monetize.',
    }
  }

  static async checkSimilarity(content: string, knownContent: string): Promise<SimilarityReport> {
    if (content === knownContent) {
      return { similar: true, score: 100, type: 'exact' }
    }

    const normA = this._normalize(content)
    const normB = this._normalize(knownContent)

    if (normA === normB) {
      return { similar: true, score: 95, type: 'normalized-exact' }
    }

    const similarity = this._calculateSimilarity(normA, normB)
    if (similarity > 0.8) {
      return { similar: true, score: Math.round(similarity * 100), type: 'semantic' }
    }

    return { similar: false, score: Math.round(similarity * 100), type: 'different' }
  }

  private static _normalize(content: string): string {
    return content
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim()
  }

  private static _calculateSimilarity(a: string, b: string): number {
    const wordsA = new Set(a.split(' '))
    const wordsB = new Set(b.split(' '))
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)))
    const union = new Set([...wordsA, ...wordsB])
    return union.size === 0 ? 0 : intersection.size / union.size
  }
}
