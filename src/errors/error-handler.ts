import { WNPErrors } from './error-codes.js'

export class WNPError extends Error {
  code: string
  statusCode: number
  details?: any

  constructor(code: string, message: string, statusCode = 400, details?: any) {
    super(message)
    this.name = 'WNPError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

export class WNPErrorHandler {
  static handle(err: any): { statusCode: number; payload: Record<string, any> } {
    if (err instanceof WNPError) {
      return {
        statusCode: err.statusCode,
        payload: {
          error: err.code,
          message: err.message,
          details: err.details,
        },
      }
    }

    return {
      statusCode: 500,
      payload: {
        error: 'WNP_INTERNAL_ERROR',
        message: err.message || 'An unexpected error occurred in WNP',
      },
    }
  }
}
