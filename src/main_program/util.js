import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl
} from 'Src/main_program/view.js'
import { vh, vw } from 'Src/util/browser.js'

import { minDistToEdgeInPct } from 'Settings'

function getMinDistToEdgeFromSettings () {
  return createPos({
    x: (1 / 100) * vw() * minDistToEdgeInPct.x,
    y: (1 / 100) * vh() * minDistToEdgeInPct.y
  })
}

function getSmallDistToNeighborTarget (minGazeTargetSize) {
  return scalePosByVal(minGazeTargetSize, 1 / 2)
}

function addDwellBtnsToRoot (dwellBtns, rootEl) {
  const dwellBtnContainer = getDwellBtnContainer()
  for (const dwellBtn of dwellBtns) {
    dwellBtnContainer.appendChild(getDwellBtnDomEl(dwellBtn))
  }
  rootEl.appendChild(dwellBtnContainer)
  return dwellBtnContainer
}

function clearDwellBtns () {
  document.getElementById('dwellBtnContainer').remove()
}

function removeDwellBtnsAndGazeListener (app) {
  endGazeBtnListenerIfNeeded(app)
  clearDwellBtns()
}

function addCanvasToRootAndDrawLines (app) {
  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  drawingCanvas.drawLines(app.state.lines)
  return drawingCanvas
}

function endGazeBtnListenerIfNeeded (app) {
  if (app.eyeModeOn) {
    app.gazeAtDwellBtnListener.unregister()
  }
}

function registerDwellBtnsForGazeListenerIfNeeded (dwellBtns, app) {
  if (app.eyeModeOn) {
    app.gazeAtDwellBtnListener.register(dwellBtns)
  }
}

function showAndActivateDwellBtns (dwellBtns, app) {
  addDwellBtnsToRoot(dwellBtns, app.rootDomEl)
  registerDwellBtnsForGazeListenerIfNeeded(dwellBtns, app)
}

export {
  addCanvasToRootAndDrawLines,
  endGazeBtnListenerIfNeeded,
  getMinDistToEdgeFromSettings,
  getSmallDistToNeighborTarget,
  removeDwellBtnsAndGazeListener,
  showAndActivateDwellBtns
}
