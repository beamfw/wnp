import { WNPManifest } from './manifest-builder.js'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class ManifestValidator {
  static validate(manifest: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!manifest || typeof manifest !== 'object') {
      return { valid: false, errors: ['Manifest must be a non-null object'], warnings: [] }
    }

    if (manifest.version !== '2.0') {
      errors.push(`Unsupported or missing WNP version: expected "2.0", got "${manifest.version}"`)
    }

    if (!manifest.site || typeof manifest.site !== 'object') {
      errors.push('Manifest missing required "site" object')
    } else {
      if (!manifest.site.name) errors.push('Missing "site.name"')
      if (!manifest.site.domain) errors.push('Missing "site.domain"')
    }

    if (!manifest.defaultPolicy || typeof manifest.defaultPolicy !== 'object') {
      errors.push('Manifest missing required "defaultPolicy"')
    } else {
      const validTypes = ['free', 'attribution', 'micropayment', 'license', 'progressive', 'custom']
      if (!validTypes.includes(manifest.defaultPolicy.type)) {
        errors.push(`Invalid defaultPolicy.type: "${manifest.defaultPolicy.type}"`)
      }
    }

    if (manifest.defaultPolicy?.type === 'micropayment') {
      const hasEnabledPayment = Array.isArray(manifest.paymentMethods) && manifest.paymentMethods.some((m: any) => m.enabled)
      if (!hasEnabledPayment) {
        warnings.push('Micropayment policy is active but no payment method is enabled.')
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
