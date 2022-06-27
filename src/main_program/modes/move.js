import { addPositions, createPos } from 'Src/data_types/pos.js'
import { vh, vw } from 'Src/util/browser.js'
import { createDwellBtn, createDwellBtnFromDwellBtnAndCenter } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { arrangeBtnsTwoHighOneLow } from 'Src/main_program/dwell_btn_patterns.js'
import { getQuitBtn } from 'Src/main_program/util.js'
import { moveLeft, moveRight, moveUp, moveDown } from 'Src/main_program/zoom.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'

import moveDownIcon from 'Assets/icons/arrow_down.png'
import moveLeftIcon from 'Assets/icons/arrow_left.png'
import moveRightIcon from 'Assets/icons/arrow_right.png'
import moveUpIcon from 'Assets/icons/arrow_up.png'

function getMoveMode (app) {
  if (app.settings.useSimpleBtnPatterns) {
    return getSimpleMoveMode(app)
  } else {
    // Original Move Mode
    const btnSize = app.minGazeTargetSize
    const quitBtn = getQuitBtn(app, btnSize)

    const moveLeftBtn = createDwellBtn({
      action: () => {
        moveLeft(app.state.zoom)
        redraw(app)
      },
      domId: 'moveLeftBtn',
      icon: moveLeftIcon,
      size: btnSize
    })
    const moveUpBtn = createDwellBtn({
      action: () => {
        moveUp(app.state.zoom)
        redraw(app)
      },
      domId: 'moveUpBtn',
      icon: moveUpIcon,
      size: btnSize
    })
    const moveRightBtn = createDwellBtn({
      action: () => {
        moveRight(app.state.zoom)
        redraw(app)
      },
      domId: 'moveRightBtn',
      icon: moveRightIcon,
      size: btnSize
    })
    const moveDownBtn = createDwellBtn({
      action: () => {
        moveDown(app.state.zoom)
        redraw(app)
      },
      domId: 'moveDownBtn',
      icon: moveDownIcon,
      size: btnSize
    })

    return getDwellBtnMode(arrangeDwellBtnsMoveMode({
      app,
      minDistToEdge: getAbsPosFromPosRelativeToViewport(
        app.settings.minDistToEdgeRel
      ),
      moveLeftBtn,
      moveUpBtn,
      moveRightBtn,
      moveDownBtn,
      quitBtn
    }))
  }
}

function getSimpleMoveMode (app) {
  const btnSize = app.minGazeTargetSize
  return getMoveHorizontalMode(app, btnSize)
}

function getMoveHorizontalMode (app, btnSize) {
  const moveLeftBtn = createDwellBtn({
    action: () => {
      moveLeft(app.state.zoom)
      redraw(app)
    },
    domId: 'moveLeftBtn',
    icon: moveLeftIcon,
    size: btnSize
  })
  const moveRightBtn = createDwellBtn({
    action: () => {
      moveRight(app.state.zoom)
      redraw(app)
    },
    domId: 'moveRightBtn',
    icon: moveRightIcon,
    size: btnSize
  })
  const quitOrChangeStateBtn = getChangeOrQuitBtn('vertical', app, btnSize)

  return getDwellBtnMode(arrangeBtnsTwoHighOneLow(
    [moveLeftBtn, quitOrChangeStateBtn, moveRightBtn],
    getAbsPosFromPosRelativeToViewport(
      app.settings.minDistToEdgeRel
    )
  ))
}

function getMoveVerticalMode (app, btnSize) {
  const moveUpBtn = createDwellBtn({
    action: () => {
      moveUp(app.state.zoom)
      redraw(app)
    },
    domId: 'moveUpBtn',
    icon: moveUpIcon,
    size: btnSize
  })
  const moveDownBtn = createDwellBtn({
    action: () => {
      moveDown(app.state.zoom)
      redraw(app)
    },
    domId: 'moveDownBtn',
    icon: moveDownIcon,
    size: btnSize
  })
  const quitOrChangeStateBtn = getChangeOrQuitBtn('horizontal', app, btnSize)

  return getDwellBtnMode(arrangeBtnsTwoHighOneLow(
    [moveUpBtn, quitOrChangeStateBtn, moveDownBtn],
    getAbsPosFromPosRelativeToViewport(
      app.settings.minDistToEdgeRel
    )
  ))
}

function getChangeOrQuitBtn (nextState, app, btnSize) {
  let getNextMode = ''
  if (nextState === 'horizontal') {
    getNextMode = getMoveHorizontalMode
  } else if (nextState === 'vertical') {
    getNextMode = getMoveVerticalMode
  } else {
    throw new TypeError(
      "nextState needs to be either 'horizontal', or 'vertical'."
    )
  }
  return createDwellBtn({
    action: () => activateMode(app, getNextMode(app, btnSize)),
    levelTwoAction: () => activateMode(app, getMainMenuClosedMode(app)),
    domId: 'quitOrChangeBtn',
    size: btnSize,
    title: 'Wechseln / Beenden'
  })
}

function arrangeDwellBtnsMoveMode ({
  app,
  minDistToEdge,
  moveLeftBtn,
  moveUpBtn,
  moveRightBtn,
  moveDownBtn,
  quitBtn
}) {
  const moveLeftBtnPos = addPositions(
    minDistToEdge, moveLeftBtn.ellipse.radii
  )
  const moveUpBtnPos = createPos({
    x: vw() / 2,
    y: moveLeftBtnPos.y
  })
  const moveRightBtnPos = createPos({
    x: vw() - minDistToEdge.x - moveRightBtn.ellipse.radii.x,
    y: moveLeftBtnPos.y
  })
  const moveDownBtnPos = createPos({
    x: (moveLeftBtnPos.x + moveUpBtnPos.x) / 2,
    y: vh() - minDistToEdge.y - moveDownBtn.ellipse.radii.y
  })
  const quitBtnPos = createPos({
    x: (moveUpBtnPos.x + moveRightBtnPos.x) / 2,
    y: moveDownBtnPos.y
  })

  return [
    createDwellBtnFromDwellBtnAndCenter(
      moveLeftBtn, moveLeftBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      moveUpBtn, moveUpBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      moveRightBtn, moveRightBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      moveDownBtn, moveDownBtnPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      quitBtn, quitBtnPos
    )
  ]
}

export {
  getMoveMode
}
