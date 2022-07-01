import { activateDwellBtnGazeListener } from 'Src/main_program/dwell_detection/dwell_at_btn_detection.js'
import { scalePosByVal } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl
} from 'Src/main_program/view.js'
import { clearScreenPointListeners } from 'Src/util/main.js'

import quitIcon from 'Assets/icons/close.png'

function getMinGazeTargetSizeFromAcc (acc) {
  return scalePosByVal(acc, 3.7)
}

function getDispersionThresholdFromPrec (prec) {
  return scalePosByVal(prec, 3.3)
}

function addDwellBtnsToRoot ({
  dwellBtns,
  getDwellBtnBackgroundColor,
  rootEl
}) {
  clearDwellBtns()
  const dwellBtnContainer = getDwellBtnContainer()
  for (const dwellBtn of dwellBtns) {
    dwellBtnContainer.appendChild(getDwellBtnDomEl(
      dwellBtn, getDwellBtnBackgroundColor
    ))
  }
  rootEl.appendChild(dwellBtnContainer)
  return dwellBtnContainer
}

function clearDwellBtns () {
  const dwellBtnContainer = document.getElementById('dwellBtnContainer')
  if (dwellBtnContainer) dwellBtnContainer.remove()
}

function removeDwellBtnsAndGazeListener (app) {
  endDwellBtnListener(app)
  clearDwellBtns()
}

function addCanvasToRootAndDrawLines (app) {
  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  drawingCanvas.drawLines(app.state.lines)
  return drawingCanvas
}

function endDwellBtnListener (app) {
  clearScreenPointListeners(app.webgazer, app.mouseListeners)
  app.gazeDot.hide()
  if (app.settings.dwellBtnDetectionAlgorithm === 'screenpoint') {
    app.gazeAtDwellBtnListener.unregister()
  }
}

function registerDwellBtnsForGazeListener (dwellBtns, app) {
  app.gazeDot.show()
  if (app.settings.dwellBtnDetectionAlgorithm === 'screenpoint') {
    app.gazeAtDwellBtnListener.register(dwellBtns)
  } else if (app.settings.dwellBtnDetectionAlgorithm === 'bucket') {
    activateDwellBtnGazeListener({
      app,
      dwellBtns,
      getDwellBtnBackgroundColor: app.settings.getDwellBtnBackgroundColor
    })
  } else {
    throw new TypeError(
      "dwellBtnDetectionAlgorithm needs to be either 'screenpoint', " +
      "or 'bucket'."
    )
  }
}

function showAndActivateDwellBtns (dwellBtns, app) {
  addDwellBtnsToRoot({
    dwellBtns,
    getDwellBtnBackgroundColor: app.settings.getDwellBtnBackgroundColor,
    rootEl: app.rootDomEl
  })
  registerDwellBtnsForGazeListener(dwellBtns, app)
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
    title: (app.settings.lang === 'de') ? 'Modus Beenden' : 'Quit Mode'
  })
}

export {
  addCanvasToRootAndDrawLines,
  endDwellBtnListener,
  getDispersionThresholdFromPrec,
  getMinGazeTargetSizeFromAcc,
  getQuitBtn,
  removeDwellBtnsAndGazeListener,
  showAndActivateDwellBtns
}
