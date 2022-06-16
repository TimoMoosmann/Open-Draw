import { addPositions, createPos, subPositions } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { createDwellBtn, createDwellBtnFromDwellBtnAndCenter } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import {
  getMinDistToEdgeFromSettings, getQuitBtn, getSmallDistToNeighborTarget
} from 'Src/main_program/util.js'
import { zoomIn, zoomOut } from 'Src/main_program/zoom.js'

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

  const arrangedZoomBtns = arrangeDwellBtnsZoomMode({
    btnSize, quitBtn, zoomInBtn, zoomOutBtn
  })
  return getDwellBtnMode(arrangedZoomBtns)
}

function arrangeDwellBtnsZoomMode ({
  btnSize,
  quitBtn,
  zoomInBtn,
  zoomOutBtn
}) {
  const zoomInBtnPos = addPositions(
    getMinDistToEdgeFromSettings(), zoomInBtn.ellipse.radii
  )
  const zoomOutBtnPos = createPos({
    x: zoomInBtnPos.x + getSmallDistToNeighborTarget(btnSize).x +
      zoomInBtn.ellipse.radii.x + zoomOutBtn.ellipse.radii.x,
    y: zoomInBtnPos.y
  })
  const quitBtnPos = subPositions(
    getViewport(), getMinDistToEdgeFromSettings(), quitBtn.ellipse.radii
  )
  return [
    createDwellBtnFromDwellBtnAndCenter(
      quitBtn, quitBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      zoomInBtn, zoomInBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      zoomOutBtn, zoomOutBtnPos
    )
  ]
}

export {
  getZoomMode
}
