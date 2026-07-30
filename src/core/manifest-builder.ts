export type WNPPolicyType = 
  | 'free'           // 100% Free / Public Access
  | 'attribution'    // Free, but must attribute
  | 'micropayment'   // Micro-payment required
  | 'license'        // License/contract required
  | 'progressive'    // Tiered access
  | 'custom'         // Custom policy

export interface WNPPolicy {
  type: WNPPolicyType
  description: string
  freeAccess?: {
    allowAI: boolean
    allowTraining: boolean
    allowSearch: boolean
    allowPersonal: boolean
  }
  attribution?: {
    required: boolean
    format: string
    requireLink: boolean
    requireAuthorName: boolean
  }
  micropayment?: {
    currency: string
    amountPerToken: number
    minimumAmount: number
    maximumAmount: number
    freePreview?: {
      tokens: number
      description: string
    }
  }
}

export interface WNPPathPolicy {
  path: string
  policy: WNPPolicy
}

export interface WNPPaymentMethod {
  provider: string
  enabled: boolean
  config?: Record<string, any>
  testMode?: boolean
}

export interface WNPPricing {
  currency: string
  ratePerKB?: number
  ratePerToken?: number
  flatRatePerDocument?: number
  minimumCharge?: number
  maximumCharge?: number
  freeTier?: {
    requestsPerDay: number
    tokensPerRequest: number
  }
}

export interface WNPAttribution {
  required: boolean
  format: string
  requireCanonicalLink: boolean
  requireAuthorName: boolean
  requireDateAttribution: boolean
}

export interface WNPLicensing {
  type: 'open' | 'commercial' | 'custom'
  url: string
  contact: string
  terms: string
}

export interface WNPVerification {
  c2paEnabled: boolean
  domainAgeVerified: boolean
  creatorVerified: boolean
  originalityScore?: number
}

export interface WNPManifest {
  version: '2.0'
  site: {
    name: string
    domain: string
    description: string
    createdAt: string
    categories: string[]
  }
  defaultPolicy: WNPPolicy
  policies: WNPPathPolicy[]
  paymentMethods: WNPPaymentMethod[]
  pricing?: WNPPricing
  attribution?: WNPAttribution
  licensing?: WNPLicensing
  verification?: WNPVerification
  contact: {
    email?: string
    url?: string
  }
}

export class ManifestBuilder {
  private manifest: WNPManifest

  constructor(siteName: string, domain: string) {
    this.manifest = {
      version: '2.0',
      site: {
        name: siteName,
        domain,
        description: '',
        createdAt: new Date().toISOString().split('T')[0],
        categories: [],
      },
      defaultPolicy: {
        type: 'free',
        description: 'Default free access policy',
        freeAccess: {
          allowAI: true,
          allowTraining: true,
          allowSearch: true,
          allowPersonal: true,
        },
      },
      policies: [],
      paymentMethods: [],
      contact: {},
    }
  }

  setDescription(desc: string): this {
    this.manifest.site.description = desc
    return this
  }

  setDefaultPolicy(policy: WNPPolicy): this {
    this.manifest.defaultPolicy = policy
    return this
  }

  addPathPolicy(path: string, policy: WNPPolicy): this {
    this.manifest.policies.push({ path, policy })
    return this
  }

  addPaymentMethod(provider: string, enabled = true, config?: Record<string, any>): this {
    this.manifest.paymentMethods.push({ provider, enabled, config })
    return this
  }

  setPricing(pricing: WNPPricing): this {
    this.manifest.pricing = pricing
    return this
  }

  setAttribution(attribution: WNPAttribution): this {
    this.manifest.attribution = attribution
    return this
  }

  setLicensing(licensing: WNPLicensing): this {
    this.manifest.licensing = licensing
    return this
  }

  setContact(contact: { email?: string; url?: string }): this {
    this.manifest.contact = contact
    return this
  }

  build(): WNPManifest {
    return this.manifest
  }
}
