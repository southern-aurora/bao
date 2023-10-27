import { exec as nodeExec } from 'node:child_process'
import { bootstrap } from './bootstrap.mjs'

await new Promise((resolve, reject) => {
  nodeExec('node ./src/bao/scripts/generate.mjs', () => resolve())
})
await bootstrap('./src/index.ts')
