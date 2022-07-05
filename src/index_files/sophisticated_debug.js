import { createAndStartApp } from 'Src/startup_helper.js'
import { sophisticatedSettings } from 'Settings/sophisticated.js'

async function main () {
  sophisticatedSettings.eyeModeOn = false
  sophisticatedSettings.debugOn = true
  await createAndStartApp(sophisticatedSettings)
}

main()
