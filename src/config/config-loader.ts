import { WNPConfig } from '../types.js'
import { getDefaultConfig } from './config-defaults.js'
import { ConfigValidator, ValidationResult } from './config-validator.js'

export interface ConfigLoadOptions {
  config?: Partial<WNPConfig>
  configPath?: string
  loadEnv?: boolean
}

export class ConfigLoader {
  static async load(options?: ConfigLoadOptions): Promise<WNPConfig> {
    const defaults = getDefaultConfig()

    let envConfig: Partial<WNPConfig> = {}
    if (options?.loadEnv !== false && typeof process !== 'undefined' && process.env) {
      envConfig = this.loadFromEnv()
    }

    const merged: WNPConfig = {
      ...defaults,
      ...envConfig,
      ...(options?.config || {}),
      scope: {
        ...defaults.scope,
        ...(envConfig.scope || {}),
        ...(options?.config?.scope || {}),
      },
      policies: {
        ...defaults.policies,
        ...(envConfig.policies || {}),
        ...(options?.config?.policies || {}),
      },
      adapters: {
        ...defaults.adapters,
        ...(envConfig.adapters || {}),
        ...(options?.config?.adapters || {}),
      },
    }

    return merged
  }

  static validate(config: WNPConfig): ValidationResult {
    return ConfigValidator.validate(config)
  }

  private static loadFromEnv(): Partial<WNPConfig> {
    const config: any = {}
    if (process.env.WNP_VERSION) {
      config.version = process.env.WNP_VERSION
    }
    return config
  }
}
