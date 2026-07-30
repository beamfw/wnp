export class MetricsCollector {
  private counts: Map<string, number> = new Map()

  increment(metric: string): void {
    this.counts.set(metric, (this.counts.get(metric) || 0) + 1)
  }

  getSummary(): Record<string, number> {
    const obj: Record<string, number> = {}
    this.counts.forEach((v, k) => {
      obj[k] = v
    })
    return obj
  }
}
