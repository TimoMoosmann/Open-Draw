import { addPositions, createPos, subPositions } from 'Src/data_types/pos.js'
import { getViewport, vh, vw } from 'Src/util/browser.js'
import { createDwellBtn, createDwellBtnFromDwellBtnAndCenter } from 'Src/main_program/data_types/dwell_btn.js'
import { redraw } from 'Src/main_program/draw.js'
import {
  getMinDistToEdgeFromSettings, getQuitBtn, showAndActivateDwellBtns
} from 'Src/main_program/util.js'
import { moveLeft, moveRight, moveUp, moveDown } from 'Src/main_program/zoom.js'
import moveLeftIcon from 'Assets/img/left_arrow.png'
import moveRightIcon from 'Assets/img/right_arrow.png'

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
