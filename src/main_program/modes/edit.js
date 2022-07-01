import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { arrangeBtnsTwoHighOneLow, arrangeTwoBtnsUpperLeftOneBtnLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { getQuitBtn } from 'Src/main_program/util.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'

import undoIcon from 'Assets/icons/undo.png'
import redoIcon from 'Assets/icons/redo.png'

function getEditMode (app) {
  const btnSize = app.minGazeTargetSize
  const quitBtn = getQuitBtn(app, btnSize)

  const undoBtn = createDwellBtn({
    action: () => {
      undo(app)
      redraw(app)
    },
    domId: 'undoBtn',
    icon: undoIcon,
    size: btnSize,
    title: 'Undo'
  })
  const redoBtn = createDwellBtn({
    action: () => {
      redo(app)
      redraw(app)
    },
    domId: 'redoBtn',
    icon: redoIcon,
    size: btnSize,
    title: 'Redo'
  })

  let arrangedBtns = false
  const minDistToEdge = getAbsPosFromPosRelativeToViewport(
    app.settings.minDistToEdgeRel
  )
  if (app.settings.useSimpleBtnPatterns) {
    arrangedBtns = arrangeBtnsTwoHighOneLow(
      [undoBtn, quitBtn, redoBtn], minDistToEdge
    )
  } else {
    arrangedBtns = arrangeTwoBtnsUpperLeftOneBtnLowerRight({
      btns: [undoBtn, redoBtn, quitBtn],
      minDistToEdge,
      xDistBetweenTopTargets: app.settings.getSmallDistBetweenTargets(btnSize).x
    })
  }
  return getDwellBtnMode(arrangedBtns)
}

function undo (app) {
  // go back one element
  if (app.state.lines.length > 0) {
    app.state.lines.pop()
    app.state.linesBufferIdx--
  }
}

function redo (app) {
  if (app.state.lines < app.state.linesBuffer) {
    app.state.lines.push(app.state.linesBuffer[++app.state.linesBufferIdx])
  }
}

export {
  getEditMode
}
