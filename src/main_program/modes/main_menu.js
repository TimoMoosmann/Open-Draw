import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { getChooseColorMode } from 'Src/main_program/modes/choose_color.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getDrawLineMode } from 'Src/main_program/modes/draw_line.js'
import { getMoveMode } from 'Src/main_program/modes/move.js'
import { getParallelMenuMode } from 'Src/main_program/modes/parallel_menu.js'
import { getZoomMode } from 'Src/main_program/modes/zoom.js'

import chooseColorModeIcon from 'Assets/icons/color-wheel.png'
import drawLineModeIcon from 'Assets/icons/line.png'
import moveModeIcon from 'Assets/icons/move.png'
import zoomModeIcon from 'Assets/icons/magnifying-glass.png'

function getMainMenuMode (app) {
  const btnSize = app.minGazeTargetSize

  const getStartModeDwellBtn = ({
    domId, icon, mode, title
  }) => createDwellBtn({
    action: () => {
      activateMode(app, mode)
    },
    domId,
    icon,
    size: app.minGazeTargetSize,
    title
  })

  const startDrawLineModeDwellBtn = getStartModeDwellBtn({
    mode: getDrawLineMode(),
    domId: 'startDrawlineModeDwellBtn',
    icon: drawLineModeIcon,
    title: 'Draw Line'
  })
  const startZoomModeDwellBtn = getStartModeDwellBtn({
    mode: getZoomMode(app),
    domId: 'startZoomDwellBtn',
    icon: zoomModeIcon,
    title: 'Zoom'
  })
  const startMoveModeDwellBtn = getStartModeDwellBtn({
    mode: getMoveMode(app),
    domId: 'startMoveDwellBtn',
    icon: moveModeIcon,
    title: 'Move'
  })
  const startChooseColorModeDwellBtn = getStartModeDwellBtn({
    mode: getChooseColorMode(app),
    domId: 'startColorChooserDwellBtn',
    icon: chooseColorModeIcon,
    title: 'Choose Color'
  })

  return getParallelMenuMode({
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

export {
  getMainMenuMode
}
