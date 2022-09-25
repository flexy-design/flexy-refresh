export {}

import { existsSync, readFileSync } from 'fs'
import chalk from 'chalk'
import { purgeCache } from './utils/cache'
import path from 'path'
import axios from 'axios'

void (async () => {
  const flexyConfigPath = path.resolve(process.cwd(), 'flexy.config.json')
  const flexySecretPath = path.resolve(process.cwd(), 'flexy.secret.json')

  if (!existsSync(flexyConfigPath)) {
    console.log(chalk.red(`Flexy config file not found at ${flexyConfigPath}`))
    return
  }
  if (!existsSync(flexySecretPath)) {
    console.log(chalk.red(`Flexy secret file not found at ${flexySecretPath}`))
    return
  }

  const flexyConfig = await import(flexyConfigPath)

  console.log(
    chalk.blueBright(`    ________    _______  ____  __
   / ____/ /   / ____/ |/ /\\ \/  \/
  / /_  / /   / __/  |   /  \\  /
 / __/ / /___/ /___ /   |   / /
/_/   /_____/_____//_/|_|  /_/`)
  )

  const moduleJsonPath = path.resolve(__dirname, '../package.json')
  const packageJson = JSON.parse(String(readFileSync(moduleJsonPath)))

  console.log(
    chalk.blueBright(`\nWelcome to Flexy CLI! (${packageJson.version})`)
  )

  for (const fileIdAlias of Object.keys(flexyConfig.figmaUrls)) {
    console.log('')
    console.log(
      chalk.blueBright(`[Flexy] [${fileIdAlias}] Cache Refresh in progress...`)
    )
    const fileId = flexyConfig.figmaUrls[fileIdAlias].replace(
      /^https:\/\/www\.figma\.com\/file\/(.*)\/(.*)$/,
      '$1'
    )
    await purgeCache(fileId)
    console.log(
      chalk.blueBright(
        `[Flexy] [${fileIdAlias}] Local Cache Invalidation finished.`
      )
    )

    await axios.post('https://api.flexy.design/v1/invalidate', {
      fileId
    })

    console.log(
      chalk.blueBright(
        `[Flexy] [${fileIdAlias}] API Server Cache Invalidation finished.`
      )
    )
  }
})()
