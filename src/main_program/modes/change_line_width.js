import { createDwellBtn, createDwellBtnFromDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { getLineWidthDisplay } from 'Src/main_program/modes/view.js'
import { arrangeBtnsTwoHighOneLow, arrangeTwoBtnsUpperLeftOneBtnLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { getQuitBtn } from 'Src/main_program/util.js'
import { vw } from 'Src/util/browser.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { maxLineWidth } from 'Settings'

import increaseIcon from 'Assets/icons/plus.png'
import decreaseIcon from 'Assets/icons/minus.png'

function getChangeLineWidthMode (app) {
  const btnSize = app.minGazeTargetSize
  const quitBtn = getQuitBtn(app, btnSize)

  const increaseBtn = createDwellBtn({
    domId: 'increaseLineWidthBtn',
    icon: increaseIcon,
    size: btnSize
  })
  const decreaseBtn = createDwellBtn({
    domId: 'decreaseLineWidthBtn',
    icon: decreaseIcon,
    size: btnSize
  })

  const minDistToEdge = getAbsPosFromPosRelativeToViewport(
    app.settings.minDistToEdgeRel
  )
  let [arrangedIncreaseBtn, arrangedDecreaseBtn, arrangedQuitBtn] =
    [false, false, false]
  if (app.settings.useSimpleBtnPatterns) {
    [arrangedIncreaseBtn, arrangedQuitBtn, arrangedDecreaseBtn] =
      arrangeBtnsTwoHighOneLow(
        [increaseBtn, quitBtn, decreaseBtn], minDistToEdge
      )
  } else {
    [arrangedIncreaseBtn, arrangedDecreaseBtn, arrangedQuitBtn] =
      arrangeTwoBtnsUpperLeftOneBtnLowerRight({
        btns: [increaseBtn, decreaseBtn, quitBtn],
        minDistToEdge,
        xDistBetweenTopTargets:
          app.settings.getSmallDistBetweenTargets(btnSize).x
      })
  }

  let displayLeft = false
  let displayTop = false
  let anchorIsCenterX = false
  let anchorIsCenterY = false
  if (app.settings.useSimpleBtnPatterns) {
    displayLeft = vw() / 2
    displayTop = minDistToEdge.y
    anchorIsCenterX = true
    anchorIsCenterY = false
  } else {
    displayLeft = arrangedDecreaseBtn.ellipse.center.x +
      arrangedDecreaseBtn.ellipse.radii.x +
      app.settings.getSmallDistBetweenTargets(btnSize).x
    displayTop = arrangedIncreaseBtn.ellipse.center.y
    anchorIsCenterX = false
    anchorIsCenterY = true
  }
  const lineWidthDisplay = getLineWidthDisplay({
    lineWidth: app.state.newLineProperties.lineWidth,
    left: displayLeft,
    top: displayTop,
    anchorIsCenterX,
    anchorIsCenterY,
    lang: app.settings.lang
  })

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
