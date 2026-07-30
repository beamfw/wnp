export async function runAudit(args: string[]): Promise<void> {
  const target = args[0] || 'http://localhost:3000'
  console.log(`[WNP Audit] Auditing WNP protection headers for target: ${target}`)
  try {
    const res = await fetch(target)
    const token = res.headers.get('x-wnp-attribution-token')
    const license = res.headers.get('x-wnp-license')
    console.log(`✅ Status: ${res.status}`)
    console.log(`✅ Attribution Token: ${token ? 'PRESENT' : 'NOT FOUND'}`)
    console.log(`✅ License Header: ${license ? license : 'NOT FOUND'}`)
  } catch (err: any) {
    console.error(`❌ Connection failed: ${err.message}`)
  }
}
