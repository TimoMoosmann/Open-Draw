import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
// import { createLine } from 'Src/main_program/data_types/line.js'
// import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { redraw } from 'Src/main_program/draw.js'
import { arrangeOneBtnToLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { startChooseColorMode } from 'Src/main_program/modes/choose_color.js'
import { startDrawLineMode } from 'Src/main_program/modes/draw_line.js'
import { startMoveMode } from 'Src/main_program/modes/move.js'
import { startZoomMode } from 'Src/main_program/modes/zoom.js'
import { getBackgroundGrid } from 'Src/main_program/modes/view.js'
import { drawAndActivateParallelMenu } from 'Src/main_program/parallel_menu.js'
import {
  removeDwellBtnsAndGazeListener, showAndActivateDwellBtns
} from 'Src/main_program/util.js'

import { standardDwellBtnActivationTime } from 'Settings'

import openMenuIcon from 'Assets/icons/menu.png'
import chooseColorModeIcon from 'Assets/icons/color-wheel.png'
import drawLineModeIcon from 'Assets/icons/line.png'
import moveModeIcon from 'Assets/icons/move.png'
import zoomModeIcon from 'Assets/icons/magnifying-glass.png'

function startMainProgram (app) {
  startMainMenuClosedMode(app)
}

function startMainMenu (app) {
  const btnSize = app.minGazeTargetSize

  const getStartModeDwellBtn = ({
    domId, icon, startMode, title
  }) => createDwellBtn({
    action: () => {
      removeDwellBtnsAndGazeListener(app)
      app.drawingCanvas.clear()
      startMode(app)
    },
    domId,
    icon,
    size: app.minGazeTargetSize,
    title
  })

  const startDrawLineModeDwellBtn = getStartModeDwellBtn({
    startMode: startDrawLineMode,
    domId: 'startDrawlineModeDwellBtn',
    icon: drawLineModeIcon,
    title: 'Draw Line'
  })
  const startZoomModeDwellBtn = getStartModeDwellBtn({
    startMode: startZoomMode,
    domId: 'startZoomDwellBtn',
    icon: zoomModeIcon,
    title: 'Zoom'
  })
  const startMoveModeDwellBtn = getStartModeDwellBtn({
    startMode: startMoveMode,
    domId: 'startMoveDwellBtn',
    icon: moveModeIcon,
    title: 'Move'
  })
  const startChooseColorModeDwellBtn = getStartModeDwellBtn({
    startMode: startChooseColorMode,
    domId: 'startColorChooserDwellBtn',
    icon: chooseColorModeIcon,
    title: 'Choose Color'
  })

  redraw(app)
  drawAndActivateParallelMenu({
    app,
    btnSize,
    equallySizedDwellBtns: [
      startDrawLineModeDwellBtn,
      startZoomModeDwellBtn,
      startMoveModeDwellBtn,
      startChooseColorModeDwellBtn
    ]
  })
}

function startMainMenuClosedMode (app) {
  app.rootDomEl.appendChild(getBackgroundGrid())
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => {
      removeDwellBtnsAndGazeListener(app)
      app.drawingCanvas.clear()
      startMainMenu(app)
    },
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: app.minGazeTargetSize,
    activationTime: standardDwellBtnActivationTime,
    title: 'Open Menu'
  })

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn
  })
  showAndActivateDwellBtns([arrangedOpenMainMenuDwellBtn], app)
  redraw(app)
}

export {
  startMainMenuClosedMode,
  startMainProgram
}
