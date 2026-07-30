#!/usr/bin/env node
import { runAudit } from './audit.js'
import { runInit } from './init.js'
import { runTest } from './test.js'
import { runVerify } from './verify.js'
import { runProxy } from './proxy.js'

const args = process.argv.slice(2)
const command = args[0]

async function main() {
  switch (command) {
    case 'audit':
      await runAudit(args.slice(1))
      break
    case 'init':
      await runInit(args.slice(1))
      break
    case 'test':
      await runTest(args.slice(1))
      break
    case 'verify':
      await runVerify(args.slice(1))
      break
    case 'proxy':
      await runProxy(args.slice(1))
      break
    default:
      console.log(`
WNP CLI — Web Node Protocol for Beam

Commands:
  wnp init               Generate webnode.config.yml configuration
  wnp audit <url>        Audit target site WNP headers & attribution
  wnp test <url>         Test policy rules against URL
  wnp verify <token>     Verify an attribution token signature
  wnp proxy --target URL Shield reverse proxy wrapper
`)
      break
  }
}

main().catch((err) => {
  console.error('[WNP CLI Error]:', err)
  process.exit(1)
})
