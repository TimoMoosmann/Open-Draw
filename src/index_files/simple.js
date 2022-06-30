import { createAndStartApp } from 'Src/startup_helper.js'
import { mainSettings } from 'NewSettings/main.js'

async function main () {
  mainSettings.eyeModeOn = true
  mainSettings.debugModeOn = false
  await createAndStartApp(mainSettings)
}

main()
