import { WNPClient } from './agent-sdk.js'

export class BrowserWNPClient extends WNPClient {
  static isWNPBrowserSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.fetch === 'function'
  }
}
