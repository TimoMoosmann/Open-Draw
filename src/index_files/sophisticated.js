import { createAndStartApp } from 'Src/startup_helper.js'
import { sophisticatedSettings } from 'Settings/sophisticated.js'

async function main () {
  sophisticatedSettings.eyeModeOn = true
  sophisticatedSettings.debugModeOn = false
  await createAndStartApp(sophisticatedSettings)
}

main()
