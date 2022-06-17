import { createDwellBtn, createDwellBtnFromDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { getLineWidthDisplay } from 'Src/main_program/modes/view.js'
import { arrangeTwoBtnsUpperLeftOneBtnLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import {
  getQuitBtn, getSmallDistToNeighborTarget
} from 'Src/main_program/util.js'
import { maxLineWidth } from 'Settings'

import increaseIcon from 'Assets/icons/plus.png'
import decreaseIcon from 'Assets/icons/minus.png'

function getChangeLineWidthMode (app) {
  const btnSize = app.minGazeTargetSize
  const quitBtn = getQuitBtn(app, btnSize)

  const increaseBtn = createDwellBtn({
    domId: 'increaseLineWidthBtn',
    icon: increaseIcon,
    size: btnSize,
  })
  const decreaseBtn = createDwellBtn({
    domId: 'decreaseLineWidthBtn',
    icon: decreaseIcon,
    size: btnSize,
  })

  let [arrangedIncreaseBtn, arrangedDecreaseBtn, arrangedQuitBtn] =
    arrangeTwoBtnsUpperLeftOneBtnLowerRight(
      [increaseBtn, decreaseBtn, quitBtn], btnSize
    )

  const displayLeft = arrangedDecreaseBtn.ellipse.center.x +
    arrangedDecreaseBtn.ellipse.radii.x + getSmallDistToNeighborTarget(btnSize).x
  const displayTop = arrangedIncreaseBtn.ellipse.center.y
  const lineWidthDisplay = getLineWidthDisplay(
    app.state.newLineProperties.lineWidth, displayLeft, displayTop
  )

  arrangedIncreaseBtn.action = () => {
    if (app.state.newLineProperties.lineWidth < maxLineWidth) {
      app.state.newLineProperties.lineWidth++
      actualizeLineWidthDisplay(
        lineWidthDisplay, app.state.newLineProperties.lineWidth
      )
      redraw(app)
    }
  }
  // To activate the onClick listener
  arrangedIncreaseBtn = createDwellBtnFromDwellBtn(arrangedIncreaseBtn)
  arrangedDecreaseBtn.action = () => {
    if (app.state.newLineProperties.lineWidth > 1) {
      app.state.newLineProperties.lineWidth--
      actualizeLineWidthDisplay(
        lineWidthDisplay, app.state.newLineProperties.lineWidth
      )
      redraw(app)
    }
  }
  arrangedDecreaseBtn = createDwellBtnFromDwellBtn(arrangedDecreaseBtn)

  const onStart = () => {
    app.rootDomEl.appendChild(lineWidthDisplay)
  }
  const onStop = () => lineWidthDisplay.remove()
  return getDwellBtnMode(
    [arrangedIncreaseBtn, arrangedDecreaseBtn, arrangedQuitBtn],
    { onStart, onStop }
  )
}

function actualizeLineWidthDisplay (display, newLineWidth) {
  display.querySelector('#lineWidth').innerHTML = newLineWidth
}

export {
  getChangeLineWidthMode
}
