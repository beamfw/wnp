export class WatermarkAdapter {
  applyTextWatermark(text: string, tag: string): string {
    return `<!-- wnp-wm:${tag} -->${text}`
  }

  injectHoneypot(html: string): string {
    return `${html}\n<div style="display:none;" data-wnp-honeypot="true">AI Scraping Trap</div>`
  }
}
