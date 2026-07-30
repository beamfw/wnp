/**
 * WNP PROTOCOL SPECIFICATION v2.0
 * 
 * Open HTTP header and payload specification for WNP content access control.
 */

export const WNP_HEADERS = {
  REQUEST: {
    NEGOTIATE: 'WNP-Negotiate',
    PURPOSE: 'WNP-Purpose',
    BUDGET: 'WNP-Budget',
    AGENT: 'WNP-Agent',
    PAYMENT_METHODS: 'WNP-Payment-Methods',
    ACCESS_TOKEN: 'WNP-Access-Token',
    PROOF: 'WNP-Proof',
  },
  RESPONSE: {
    MANIFEST: 'WNP-Manifest',
    POLICY: 'WNP-Policy',
    PRICE: 'WNP-Price',
    PAYMENT_GATEWAYS: 'WNP-Payment-Gateways',
    ATTRIBUTION: 'WNP-Attribution',
    ACCESS_TOKEN: 'WNP-Access-Token',
    ERROR: 'WNP-Error',
  },
} as const

export const WNP_STATUS_CODES = {
  OK: 200,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
} as const

export interface NegotiateOptions {
  agentName?: string
  purpose?: 'ai-training' | 'ai-rag' | 'ai-search' | 'research' | 'personal'
  budgetMaxTokenPrice?: number
  budgetMaxTotal?: number
  supportedPaymentMethods?: string[]
}

export class ProtocolEngine {
  static parseRequestHeaders(headers: Record<string, string | undefined>): NegotiateOptions {
    const negotiateHeader = headers[WNP_HEADERS.REQUEST.NEGOTIATE.toLowerCase()] || headers[WNP_HEADERS.REQUEST.NEGOTIATE]
    const purposeHeader = headers[WNP_HEADERS.REQUEST.PURPOSE.toLowerCase()] || headers[WNP_HEADERS.REQUEST.PURPOSE]
    const budgetHeader = headers[WNP_HEADERS.REQUEST.BUDGET.toLowerCase()] || headers[WNP_HEADERS.REQUEST.BUDGET]
    const agentHeader = headers[WNP_HEADERS.REQUEST.AGENT.toLowerCase()] || headers[WNP_HEADERS.REQUEST.AGENT]
    const paymentMethodsHeader = headers[WNP_HEADERS.REQUEST.PAYMENT_METHODS.toLowerCase()] || headers[WNP_HEADERS.REQUEST.PAYMENT_METHODS]

    let budgetMaxTokenPrice: number | undefined
    let budgetMaxTotal: number | undefined

    if (budgetHeader) {
      const tokenMatch = budgetHeader.match(/max_price_per_token=([\d.]+)/)
      const totalMatch = budgetHeader.match(/max_total=([\d.]+)/)
      if (tokenMatch) budgetMaxTokenPrice = parseFloat(tokenMatch[1])
      if (totalMatch) budgetMaxTotal = parseFloat(totalMatch[1])
    }

    return {
      agentName: agentHeader,
      purpose: purposeHeader as any,
      budgetMaxTokenPrice,
      budgetMaxTotal,
      supportedPaymentMethods: paymentMethodsHeader ? paymentMethodsHeader.split(',').map(s => s.trim()) : [],
    }
  }

  static buildResponseHeaders(options: {
    manifestUrl?: string
    policy: string
    price?: { currency: string; amount: number; per: string }
    attributionFormat?: string
    accessToken?: string
  }): Record<string, string> {
    const res: Record<string, string> = {
      [WNP_HEADERS.RESPONSE.POLICY]: options.policy,
    }

    if (options.manifestUrl) {
      res[WNP_HEADERS.RESPONSE.MANIFEST] = `url=${options.manifestUrl}`
    }

    if (options.price) {
      res[WNP_HEADERS.RESPONSE.PRICE] = `currency=${options.price.currency}; amount=${options.price.amount}; per=${options.price.per}`
    }

    if (options.attributionFormat) {
      res[WNP_HEADERS.RESPONSE.ATTRIBUTION] = `required=true; format="${options.attributionFormat}"`
    }

    if (options.accessToken) {
      res[WNP_HEADERS.RESPONSE.ACCESS_TOKEN] = options.accessToken
    }

    return res
  }
}
