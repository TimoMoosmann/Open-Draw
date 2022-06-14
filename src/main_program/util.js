import { activateDwellBtnGazeListener } from 'Src/main_program/dwell_detection/dwell_at_btn_detection.js'
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { startMainMenuClosedMode } from 'Src/main_program/main.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl
} from 'Src/main_program/view.js'
import { vh, vw } from 'Src/util/browser.js'

import { minDistToEdgeInPct } from 'Settings'
import quitIcon from 'Assets/icons/close.png'

function getMinDistToEdgeFromSettings () {
  return createPos({
    x: (1 / 100) * vw() * minDistToEdgeInPct.x,
    y: (1 / 100) * vh() * minDistToEdgeInPct.y
  })
}

function getSmallDistToNeighborTarget (minGazeTargetSize) {
  return scalePosByVal(minGazeTargetSize, 1 / 6)
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
    app.webgazer.showPredictionPoints(false)
    app.gazeAtDwellBtnListener.unregister()
  }
}

function registerDwellBtnsForGazeListenerIfNeeded (dwellBtns, app) {
  if (app.eyeModeOn) {
    app.webgazer.showPredictionPoints(true)
    activateDwellBtnGazeListener(dwellBtns, app.webgazer)
    // app.gazeAtDwellBtnListener.register(dwellBtns)
  }
}

function showAndActivateDwellBtns (dwellBtns, app) {
  addDwellBtnsToRoot(dwellBtns, app.rootDomEl)
  registerDwellBtnsForGazeListenerIfNeeded(dwellBtns, app)
}

function executeQuitRoutine (app, startMode = startMainMenuClosedMode) {
  app.drawingCanvas.clear()
  removeDwellBtnsAndGazeListener(app)
  startMode(app)
}

function getQuitBtn (
  app,
  startMode = startMainMenuClosedMode,
  size = false
) {
  if (!size) size = app.minGazeTargetSize
  return createDwellBtn({
    action: () => {
      executeQuitRoutine(app, startMode)
    },
    domId: 'quitBtn',
    icon: quitIcon,
    size,
    title: 'Quit Mode'
  })
}

export {
  addCanvasToRootAndDrawLines,
  endGazeBtnListenerIfNeeded,
  getMinDistToEdgeFromSettings,
  getSmallDistToNeighborTarget,
  getQuitBtn,
  removeDwellBtnsAndGazeListener,
  showAndActivateDwellBtns
}
