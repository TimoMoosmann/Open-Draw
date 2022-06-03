import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
// import { createLine } from 'Src/main_program/data_types/line.js'
// import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { arrangeOneBtnToLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { startChooseColorMode } from 'Src/main_program/modes/choose_color.js'
import { drawAndActivateParallelMenu } from 'Src/main_program/parallel_menu.js'
import {
  addCanvasToRootAndDrawLines, closeDwellBtnScreen, showAndActivateDwellBtns
} from 'Src/main_program/util.js'

import { standardDwellBtnActivationTime } from 'Settings'

import openMenuIcon from 'Assets/img/open_menu.png'
// import startDrawLineModeIcon from 'Assets/img/start_draw_line_mode.png'

function startMainProgram (app) {
  startMainMenuClosedMode(app)
}

function startMainMenu (app) {
  const btnSize = app.minGazeTargetSize

  const startChooseColorModeDwellBtn = createDwellBtn({
    action: () => {
      closeDwellBtnScreen(app)
      startChooseColorMode(app)
    },
    domId: 'startColorChooserDwellBtn',
    size: app.minGazeTargetSize,
    tite: 'Choose Color'
  })

  drawAndActivateParallelMenu({
    app,
    btnSize,
    equallySizedDwellBtns: [startChooseColorModeDwellBtn]
  })
}

function startMainMenuClosedMode (app) {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => {
      closeDwellBtnScreen(app)
      startMainMenu(app)
    },
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: app.minGazeTargetSize,
    timeTillActivation: standardDwellBtnActivationTime,
    title: 'Open Menu'
  })

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn
  })
  addCanvasToRootAndDrawLines(app)
  showAndActivateDwellBtns([arrangedOpenMainMenuDwellBtn], app)
}

export {
  startMainMenuClosedMode,
  startMainProgram
}
