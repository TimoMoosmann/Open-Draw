// import { activateDwellBtnGazeListener } from 'Src/main_program/dwell_detection/dwell_at_btn_detection.js'
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl
} from 'Src/main_program/view.js'
import { vh, vw } from 'Src/util/browser.js'

import { lang, minDistToEdgeInPct } from 'Settings'
import quitIcon from 'Assets/icons/close.png'

function getMinDistToEdgeFromSettings () {
  return createPos({
    x: (1 / 100) * vw() * minDistToEdgeInPct.x,
    y: (1 / 100) * vh() * minDistToEdgeInPct.y
  })
}

function getSmallDistToNeighborTarget (app) {
  return app.dispersionThreshold
}

function addDwellBtnsToRoot (dwellBtns, rootEl) {
  clearDwellBtns()
  const dwellBtnContainer = getDwellBtnContainer()
  for (const dwellBtn of dwellBtns) {
    dwellBtnContainer.appendChild(getDwellBtnDomEl(dwellBtn))
  }
  rootEl.appendChild(dwellBtnContainer)
  return dwellBtnContainer
}

function clearDwellBtns () {
  const dwellBtnContainer = document.getElementById('dwellBtnContainer')
  if (dwellBtnContainer) dwellBtnContainer.remove()
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
    // app.webgazer.clearGazeListener()
    app.gazeAtDwellBtnListener.unregister()
  }
}

function registerDwellBtnsForGazeListenerIfNeeded (dwellBtns, app) {
  if (app.eyeModeOn) {
    app.webgazer.showPredictionPoints(true)
    // activateDwellBtnGazeListener(dwellBtns, app.webgazer)
    app.gazeAtDwellBtnListener.register(dwellBtns)
  }
}

function showAndActivateDwellBtns (dwellBtns, app) {
  addDwellBtnsToRoot(dwellBtns, app.rootDomEl)
  registerDwellBtnsForGazeListenerIfNeeded(dwellBtns, app)
}

function getQuitBtn (
  app,
  size,
  nextMode
) {
  if (!nextMode) nextMode = getMainMenuClosedMode(app)
  return createDwellBtn({
    action: () => activateMode(app, nextMode),
    domId: 'quitBtn',
    icon: quitIcon,
    size,
    title: (lang === 'de') ? 'Modus Beenden' : 'Quit Mode'
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
