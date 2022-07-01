import { applyToEachAxis } from 'Src/data_types/pos.js'
import { vh, vw } from 'Src/util/browser.js'

function addGazeListener (webgazer, listenerName, listener) {
  if (!webgazer.gazeListeners) webgazer.gazeListeners = {}
  webgazer.gazeListeners[listenerName] = listener
  webgazer.setGazeListener((gazePoint, time) => {
    applyToEachAxis(gazePoint, val => (val < 0) ? 0 : val)
    if (gazePoint.x > vw()) gazePoint.x = vw()
    if (gazePoint.y > vh()) gazePoint.y = vh()

    for (const listener of Object.values(webgazer.gazeListeners)) {
      listener(gazePoint, time)
    }
  })
}

function removeGazeListener (webgazer, listenerName) {
  if (webgazer.gazeListeners) {
    delete webgazer.gazeListeners[listenerName]
  }
}

function clearGazeListeners (webgazer) {
  webgazer.gazeListeners = {}
  webgazer.clearGazeListener()
}

export {
  addGazeListener,
  clearGazeListeners,
  removeGazeListener
}
