import { addPositions, createPos, subPositions } from 'Src/data_types/pos.js'
import { getViewport, vh, vw } from 'Src/util/browser.js'
import { createDwellBtn, createDwellBtnFromDwellBtnAndCenter } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import {
  getMinDistToEdgeFromSettings, getQuitBtn, showAndActivateDwellBtns
} from 'Src/main_program/util.js'
import { moveLeft, moveRight, moveUp, moveDown } from 'Src/main_program/zoom.js'
import moveDownIcon from 'Assets/icons/arrow_down.png'
import moveLeftIcon from 'Assets/icons/arrow_left.png'
import moveRightIcon from 'Assets/icons/arrow_right.png'
import moveUpIcon from 'Assets/icons/arrow_up.png'

function startMoveMode (app) {
  const quitBtn = getQuitBtn(app)

  const moveLeftBtn = createDwellBtn({
    action: () => {
      moveLeft(app.state.zoom)
      redraw(app)
    },
    domId: 'moveLeftBtn',
    icon: moveLeftIcon,
    size: app.minGazeTargetSize
  })
  const moveUpBtn = createDwellBtn({
    action: () => {
      moveUp(app.state.zoom)
      redraw(app)
    },
    domId: 'moveUpBtn',
    icon: moveUpIcon,
    size: app.minGazeTargetSize,
    title: 'Up'
  })
  const moveRightBtn = createDwellBtn({
    action: () => {
      moveRight(app.state.zoom)
      redraw(app)
    },
    domId: 'moveRightBtn',
    icon: moveRightIcon,
    size: app.minGazeTargetSize
  })
  const moveDownBtn = createDwellBtn({
    action: () => {
      moveDown(app.state.zoom)
      redraw(app)
    },
    domId: 'moveDownBtn',
    icon: moveDownIcon,
    size: app.minGazeTargetSize,
    title: 'Down'
  })

  const arrangedMoveBtns = arrangeDwellBtnsMoveMode({
    app, moveLeftBtn, moveUpBtn, moveRightBtn, moveDownBtn, quitBtn
  })

  redraw(app)
  showAndActivateDwellBtns(arrangedMoveBtns, app)
}

function arrangeDwellBtnsMoveMode ({
  app, moveLeftBtn, moveUpBtn, moveRightBtn, moveDownBtn, quitBtn
}) {
  const minDistToEdge = getMinDistToEdgeFromSettings()
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
    x: vw() / 2,
    y: vh() - minDistToEdge.y - moveDownBtn.ellipse.radii.y
  })
  const quitBtnPos = subPositions(
    getViewport(), minDistToEdge, quitBtn.ellipse.radii
  )

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
  startMoveMode
}
