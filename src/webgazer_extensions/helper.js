function addGazeListener (webgazer, listenerName, listener) {
  if (!webgazer.gazeListeners) webgazer.gazeListeners = {}
  webgazer.gazeListeners[listenerName] = listener
  webgazer.setGazeListener((gazePoint, time) => {
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
