import { describe, it, expect } from 'vitest'
import { CPRCalculator } from '../src/cpr/density-calculator.js'

describe('WNP CPR Calculator', () => {
  it('calculates Content-to-Price ratio for rich content', () => {
    const content = `Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform computation. Traditional computers process information using binary bits, which represent either a zero or a one. Quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously.`

    const report = CPRCalculator.calculate(
      content,
      { currency: 'USD', ratePerToken: 0.001 },
      { domainAge: 1000, creatorVerified: true, originalityScore: 90 }
    )

    expect(report.density).toBeGreaterThan(0)
    expect(report.cpr).toBeGreaterThan(0)
    expect(['excellent-value', 'good-value', 'fair', 'overpriced']).toContain(report.fairness)
    expect(report.details.wordCount).toBeGreaterThan(20)
  })
})
