export interface CreatorReputation {
  domain: string
  trustScore: number
  totalRequestsServed: number
  disputesCount: number
  isVerified: boolean
}

export class ReputationEngine {
  private static reputations = new Map<string, CreatorReputation>()

  static getReputation(domain: string): CreatorReputation {
    if (!this.reputations.has(domain)) {
      this.reputations.set(domain, {
        domain,
        trustScore: 85,
        totalRequestsServed: 0,
        disputesCount: 0,
        isVerified: false,
      })
    }
    return this.reputations.get(domain)!
  }

  static recordSuccessfulAccess(domain: string): void {
    const rep = this.getReputation(domain)
    rep.totalRequestsServed++
    rep.trustScore = Math.min(100, rep.trustScore + 0.1)
  }

  static recordDispute(domain: string): void {
    const rep = this.getReputation(domain)
    rep.disputesCount++
    rep.trustScore = Math.max(0, rep.trustScore - 10)
  }
}
