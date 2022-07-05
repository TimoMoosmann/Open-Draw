import { createAndStartApp } from 'Src/startup_helper.js'
import { mainSettings } from 'NewSettings/main.js'

async function main () {
  mainSettings.eyeModeOn = false
  mainSettings.debugOn = true
  await createAndStartApp(mainSettings)
}

main()
