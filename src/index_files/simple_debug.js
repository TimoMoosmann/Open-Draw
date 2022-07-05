import { createAndStartApp } from 'Src/startup_helper.js'
import { mainSettings } from 'Settings/main.js'

async function main () {
  mainSettings.eyeModeOn = false
  mainSettings.debugModeOn = true
  await createAndStartApp(mainSettings)
}

main()
