import { MetricsCollector } from './metrics.js'

export class WNPDashboard {
  private metrics: MetricsCollector

  constructor() {
    this.metrics = new MetricsCollector()
  }

  getDashboardSummary(): Record<string, any> {
    return {
      status: 'active',
      telemetry: 'privacy_first_disabled',
      metrics: this.metrics.getSummary(),
    }
  }
}
