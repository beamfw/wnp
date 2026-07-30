import { WNPConfig } from '../types.js'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class ConfigValidator {
  static validate(config: WNPConfig): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!config.version) {
      errors.push('Missing required field: version')
    }

    if (!config.scope || !config.scope.paths || config.scope.paths.length === 0) {
      warnings.push('No paths configured. WNP will not protect any content.')
    }

    if (!config.policies) {
      errors.push('Missing required field: policies')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
