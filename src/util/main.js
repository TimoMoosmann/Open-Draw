import { dividePositions, scalePosByPos } from 'Src/data_types/pos.js'
import { addMouseListener, clearMouseListeners, getViewport, removeMouseListener } from 'Src/util/browser.js'
import { calcXor } from 'Src/util/math.js'
import { addGazeListener, clearGazeListeners, removeGazeListener } from 'Src/webgazer_extensions/helper.js'

function popRandomItem (arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
}

function getPosRelativeToViewport ({
  pos, viewport = getViewport()
}) {
  return dividePositions(pos, viewport)
}

function getAbsPosFromPosRelativeToViewport (
  relPos, viewport = getViewport()
) {
  return scalePosByPos(relPos, viewport)
}

function addScreenPointListener (
  webgazer,
  mouseListeners = false,
  listenerName,
  listener
) {
  checkWebgazerOrMouseListenersGiven(webgazer, mouseListeners)
  if (webgazer) {
    addGazeListener(webgazer, listenerName, listener)
  } else {
    addMouseListener(mouseListeners, listenerName, listener)
  }
}

function removeScreenPointListener (
  webgazer, mouseListeners = false, listenerName
) {
  if (webgazer) {
    removeGazeListener(webgazer, listenerName)
  } else {
    removeMouseListener(mouseListeners, listenerName)
  }
}

function clearScreenPointListeners (webgazer, mouseListeners = false) {
  checkWebgazerOrMouseListenersGiven(webgazer, mouseListeners)
  if (webgazer) {
    clearGazeListeners(webgazer)
  } else {
    clearMouseListeners(mouseListeners)
  }
}

function checkWebgazerOrMouseListenersGiven (webgazer, mouseListeners) {
  if (!calcXor(webgazer, mouseListeners)) {
    throw new TypeError(
      'Function needs either mouseListeners or webgazer, but not both.'
    )
  }
}

export {
  addScreenPointListener,
  clearScreenPointListeners,
  getAbsPosFromPosRelativeToViewport,
  getPosRelativeToViewport,
  popRandomItem,
  removeScreenPointListener
}
