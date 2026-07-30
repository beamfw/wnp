import { WNPManifest } from '../core/manifest-builder.js'

export class StaticSiteWNPWrapper {
  static generateMetaTags(manifest: WNPManifest): string {
    return [
      `<meta name="wnp-version" content="2.0" />`,
      `<meta name="wnp-policy" content="${manifest.defaultPolicy.type}" />`,
      `<meta name="wnp-manifest" content="/.well-known/wnp-manifest.json" />`,
    ].join('\n')
  }
}
