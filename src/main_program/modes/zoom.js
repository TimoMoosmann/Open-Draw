import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { arrangeBtnsTwoHighOneLow, arrangeTwoBtnsUpperLeftOneBtnLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import {
  getQuitBtn
} from 'Src/main_program/util.js'
import { zoomIn, zoomOut } from 'Src/main_program/zoom.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'

import zoomInIcon from 'Assets/icons/plus.png'
import zoomOutIcon from 'Assets/icons/minus.png'

function getZoomMode (app) {
  const btnSize = app.minGazeTargetSize
  const quitBtn = getQuitBtn(app, btnSize)

  const zoomInBtn = createDwellBtn({
    action: () => {
      zoomIn(app.state.zoom)
      redraw(app)
    },
    domId: 'zoomInBtn',
    icon: zoomInIcon,
    size: btnSize
  })
  const zoomOutBtn = createDwellBtn({
    action: () => {
      zoomOut(app.state.zoom)
      redraw(app)
    },
    domId: 'zoomOutBtn',
    icon: zoomOutIcon,
    size: btnSize
  })

  const minDistToEdge = getAbsPosFromPosRelativeToViewport(
    app.settings.minDistToEdgeRel
  )
  let arrangedZoomBtns = false
  if (app.settings.useSimpleBtnPatterns) {
    arrangedZoomBtns = arrangeBtnsTwoHighOneLow(
      [zoomInBtn, quitBtn, zoomOutBtn],
      minDistToEdge
    )
  } else {
    arrangedZoomBtns = arrangeTwoBtnsUpperLeftOneBtnLowerRight({
      btns: [zoomInBtn, zoomOutBtn, quitBtn],
      minDistToEdge,
      xDistBetweenTopTargets: app.settings.getSmallDistBetweenTargets(btnSize).x
    })
  }
  return getDwellBtnMode(arrangedZoomBtns)
}

export {
  getZoomMode
}
