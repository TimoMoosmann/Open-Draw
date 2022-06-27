import { dividePositions, scalePosByPos } from 'Src/data_types/pos.js'
import { addMouseListener, clearMouseListeners, getViewport, removeMouseListener } from 'Src/util/browser.js'
import { addGazeListener, clearGazeListeners, removeGazeListener } from 'Src/webgazer_extensions/helper.js'

function popRandomItem (arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
};

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

function addScreenPointListener (app, listenerName, listener) {
  if (app.eyeModeOn) {
    addGazeListener(app.webgazer, listenerName, listener)
  } else {
    addMouseListener(app, listenerName, listener)
  }
}

function removeScreenPointListener (app, listenerName) {
  if (app.eyeModeOn) {
    removeGazeListener(app.webgazer, listenerName)
  } else {
    removeMouseListener(app, listenerName)
  }
}

function clearScreenPointListeners (app) {
  if (app.eyeModeOn) {
    clearGazeListeners(app.webgazer)
  } else {
    clearMouseListeners(app)
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
