import { describe, it, expect } from 'vitest'
import { getDefaultConfig } from '../src/config/config-defaults.js'

describe('License Terms Config', () => {
  it('validates default config rules', () => {
    const config = getDefaultConfig()
    expect(config.policies.human.action).toBe('allow_full')
  })
})
