export class HoneypotEngine {
  static generateHoneypotLink(): string {
    return `<a href="/.well-known/wnp-trap?token=${Date.now()}" style="display:none;visibility:hidden" aria-hidden="true" rel="nofollow">DO NOT FOLLOW</a>`
  }

  static isHoneypotPath(path: string): boolean {
    return path.includes('/.well-known/wnp-trap')
  }
}
