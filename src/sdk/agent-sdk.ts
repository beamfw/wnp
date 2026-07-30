import { WNPPolicy } from '../core/manifest-builder.js'

export interface BudgetConfig {
  maxPricePerToken: number
  maxTotalPerQuery: number
  dailyBudget: number
  dailySpent: number
}

export interface WalletConfig {
  stripeSecretKey?: string
  lnurl?: string
  solanaPrivateKey?: string
}

export interface WNPClientConfig {
  budgetPerQueryMax?: number
  maxTotalPerQuery?: number
  dailyBudget?: number
  wallet?: WalletConfig
}

export interface FetchOptions {
  maxPrice?: number
}

export interface WNPResponse {
  content: string | null
  policy: string
  attribution?: { text: string; required: boolean } | null
  paymentRequired: boolean
  paymentAmount: number
  paymentTransaction?: string
  licenseRequired?: boolean
  license?: any
  previewOnly?: boolean
  fullContentAvailable?: boolean
  message?: string
}

export interface WNPHandshake {
  manifest: any | null
  policy: WNPPolicy
  paymentMethods: any[]
}

export class WNPClient {
  private _budget: BudgetConfig
  private _wallet?: WalletConfig

  constructor(config: WNPClientConfig = {}) {
    this._budget = {
      maxPricePerToken: config.budgetPerQueryMax || 0.001,
      maxTotalPerQuery: config.maxTotalPerQuery || 0.01,
      dailyBudget: config.dailyBudget || 1.00,
      dailySpent: 0,
    }
    this._wallet = config.wallet
  }

  async fetch(url: string, options?: FetchOptions): Promise<WNPResponse> {
    const handshake = await this._handshake(url)

    switch (handshake.policy.type) {
      case 'free':
        return this._handleFreeAccess(url, handshake)
      case 'attribution':
        return this._handleAttributionAccess(url, handshake)
      case 'micropayment':
        return this._handleMicroPayment(url, handshake, options)
      case 'license':
        return this._handleLicenseRequired(url, handshake)
      default:
        return this._handleFreeAccess(url, handshake)
    }
  }

  private async _handshake(url: string): Promise<WNPHandshake> {
    const manifestUrl = `${new URL(url).origin}/.well-known/wnp-manifest.json`
    try {
      const response = await globalThis.fetch(manifestUrl)
      if (response.ok) {
        const manifest = await response.json()
        const path = new URL(url).pathname
        const pathPolicy = manifest.policies?.find((p: any) =>
          new RegExp(`^${p.path.replace(/\*/g, '.*')}$`).test(path)
        )
        return {
          manifest,
          policy: pathPolicy?.policy || manifest.defaultPolicy,
          paymentMethods: manifest.paymentMethods || [],
        }
      }
    } catch {
      // Manifest fetch failed or not found
    }

    return {
      manifest: null,
      policy: { type: 'free', description: 'Default free' },
      paymentMethods: [],
    }
  }

  private async _handleFreeAccess(url: string, _handshake: WNPHandshake): Promise<WNPResponse> {
    const response = await globalThis.fetch(url)
    const content = await response.text()
    return {
      content,
      policy: 'free',
      attribution: null,
      paymentRequired: false,
      paymentAmount: 0,
    }
  }

  private async _handleAttributionAccess(url: string, handshake: WNPHandshake): Promise<WNPResponse> {
    const response = await globalThis.fetch(url)
    const content = await response.text()
    const format = handshake.manifest?.attribution?.format || 'Originally published at {url}'
    const attributionText = format.replace('{url}', url)

    return {
      content,
      policy: 'attribution',
      attribution: {
        text: attributionText,
        required: true,
      },
      paymentRequired: false,
      paymentAmount: 0,
    }
  }

  private async _handleMicroPayment(url: string, handshake: WNPHandshake, options?: FetchOptions): Promise<WNPResponse> {
    const pricePerToken = handshake.manifest?.pricing?.ratePerToken || 0.001
    const maxPrice = options?.maxPrice || this._budget.maxPricePerToken

    if (pricePerToken > maxPrice) {
      throw new Error(`Price exceeds maximum: ${pricePerToken} > ${maxPrice} per token`)
    }

    if (!this._wallet) {
      throw new Error('No wallet configured for micro-payments')
    }

    // Stubbed payment transaction
    const txId = `tx-wnp-${Date.now()}`
    const response = await globalThis.fetch(url, {
      headers: {
        'WNP-Access-Token': `token-${txId}`,
      },
    })
    const content = await response.text()

    return {
      content,
      policy: 'micropayment',
      paymentRequired: true,
      paymentAmount: pricePerToken * 100,
      paymentTransaction: txId,
    }
  }

  private async _handleLicenseRequired(url: string, handshake: WNPHandshake): Promise<WNPResponse> {
    const licensing = handshake.manifest?.licensing
    return {
      content: null,
      policy: 'license',
      licenseRequired: true,
      license: licensing || { type: 'commercial', url: `${new URL(url).origin}/licensing` },
      message: 'This content requires a license. Contact the creator for access.',
      paymentRequired: false,
      paymentAmount: 0,
    }
  }
}
