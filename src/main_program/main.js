import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
// import { createLine } from 'Src/main_program/data_types/line.js'
// import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import {
  arrangeEquallySizedDwellBtnsToParallelMenu, arrangeOneBtnToLowerRight
} from 'Src/main_program/dwell_btn_patterns.js'
import { getGazeAtDwellBtnListener } from 'Src/main_program/evaluate_fixations.js'
import { startChooseColorMode } from 'Src/main_program/modes/choose_color.js'
import { getMinDistToEdge, getSmallDistToNeighborTarget } from 'Src/main_program/util.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl
} from 'Src/main_program/view.js'
import { createPos } from 'Src/data_types/pos.js'
import {
  getViewport, vh, vw
} from 'Src/util/browser.js'

import { standardDwellBtnActivationTime } from 'Settings'

import openMenuIcon from 'Assets/img/open_menu.png'
import startDrawLineModeIcon from 'Assets/img/start_draw_line_mode.png'

function startMainProgram ({
  app
}) {
  if (app.eyeModeOn) {
    app.gazeAtDwellBtnListener = getGazeAtDwellBtnListener(app)
  }
  startChooseColorMode(app)
  /*
  const mainProgramContainer = getMainProgramContainer()
  document.body.appendChild(mainProgramContainer)

  const testLines = [
    createLine({
      startPoint: createPos({ x: 0, y: 0 }),
      endPoint: createPos({ x: 200, y: 200 }),
      strokeProperties: createStrokeProperties({
        color: 'blue',
        lineWidth: 2
      })
    })
  ]

  startMainMenuClosedScreen({
    lines: testLines,
    minDwellBtnSize: minTargetSize,
    root: mainProgramContainer
  })
  */
}

function startMainMenu ({
  lines,
  minDwellBtnSize,
  root
}) {
  const mainMenuDwellBtns = [
    getStartDrawLineModeDwellBtn(minDwellBtnSize),
    getStartEditModeDwellBtn(minDwellBtnSize),
    getStartColorChooserDwellBtn(minDwellBtnSize)
  ]

  const mainMenuDwellBtnsArranged = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor: getSmallDistToNeighborTarget(minDwellBtnSize),
    equallySizedDwellBtns: mainMenuDwellBtns,
    minDistToEdge: getMinDistToEdge(),
    getNextBtn: () => createDwellBtn({
      action: () => window.alert('next'),
      domId: 'nextBtn',
      size: minDwellBtnSize
    }),
    getPrevBtn: () => createDwellBtn({
      action: () => window.alert('prev'),
      domId: 'prevBtn',
      size: minDwellBtnSize
    }),
    viewport: getViewport()
  })

  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()

  for (const mainMenuDwellBtn of mainMenuDwellBtnsArranged) {
    root.appendChild(getDwellBtnDomEl(mainMenuDwellBtn))
  }

  root.appendChild(drawingCanvasContainer)

  drawingCanvas.drawLines(lines)
}

/*
  const arrngedMainMenuDwellBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor,
    */

function getStartDrawLineModeDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: () => window.alert('Start Draw Line Mode'),
    domId: 'startDrawLineModeDwellBtn',
    icon: startDrawLineModeIcon,
    size: minDwellBtnSize,
    tite: 'Draw Line'
  })
}

function getStartEditModeDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: () => window.alert('Start Edit Mode'),
    domId: 'startEditModeDwellBtn',
    size: minDwellBtnSize,
    tite: 'Edit'
  })
}

function getStartColorChooserDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: () => window.alert('Start Color Chooser'),
    domId: 'startColorChooserDwellBtn',
    size: minDwellBtnSize,
    tite: 'Choose Color'
  })
}

function startMainMenuClosedScreen ({
  lines,
  minDwellBtnSize,
  root
}) {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => startMainMenu(
      arguments[0]
    ),
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: minDwellBtnSize,
    timeTillActivation: standardDwellBtnActivationTime,
    title: 'Open Menu'
  })

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn,
    minDistToEdge: getMinDistToEdge(),
    viewport: createPos({ x: vw(), y: vh() })
  })

  const dwellBtnContainer = getDwellBtnContainer()
  dwellBtnContainer.appendChild(getDwellBtnDomEl(
    arrangedOpenMainMenuDwellBtn
  ))

  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()

  root.appendChild(dwellBtnContainer)
  root.appendChild(drawingCanvasContainer)
  drawingCanvas.drawLines(lines)
}

/*
function runMainProgram ({
  dwellDurationThreshold,
  fixationDispersionThreshold,
  fixationDurationThreshold,
  maxFixationDuration,
  minTargetRadii,
  webgazer
}) {
  const container = getDwellBtnContainer()
  document.body.appendChild(container)
  for (const dwellBtn of getDwellBtns()) {
    container.appendChild(getDwellBtnDomEl(dwellBtn))
  }

  const lines = []
  const runFixationDetectionFixedThresholds = onFixation => {
    return runWebgazerFixationDetection({
      dispersionThreshold: fixationDispersionThreshold,
      durationThreshold: fixationDurationThreshold,
      maxFixationDuration,
      onFixation,
      webgazer
    })
  }

  const actionOnDwellFixedThreshold = ({ btnList, fixation }) => actionOnDwell({
    btnList, fixation, dwellDurationThreshold
  })

  mainMenuPage({
    actionOnDwellFixedThreshold,
    dwellDurationThreshold,
    lines,
    minTargetRadii,
    runFixationDetectionFixedThresholds
  })

  startDrawLineMode({
    dwellDurationThreshold,
    lines,
    minTargetRadii,
    runFixationDetectionFixedThresholds,
    webgazer
  })
}
*/

function drawLines ({ drawingCanvas, lines }) {
  const ctx = drawingCanvas.getContext('2d')
  clearCanvas(drawingCanvas)
  for (const line of lines) {
    drawLine({ ctx, line })
  }
}

/*
const createZoomedLine = ({line, viewport, zoom}) => {
  drawLine(canvasCtx, createLine({
   startPoint: createPos{
     x: line.startPoint.x * zoom.level.factor - zoom.canvasOffsetFactor *
}

const createUnzoomedLine = ({line, viewport, zoom}) => {
}

const drawLinesZoomed = ({lines, zoom}) => {
  clearCanvas({canvas, canvsCtx})
  for (const line of lines) {
    drawLine(canvasCtx, createLine({
      startPoint: createPos{
        x:
}
*/

function clearCanvas (canvas) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawLine ({ ctx, line }) {
  ctx.strokeStyle = line.strokeProperties.color
  ctx.lineWidth = line.strokeProperties.lineWidth
  ctx.beginPath()
  ctx.moveTo(line.startPoint.x, line.startPoint.y)
  ctx.lineTo(line.endPoint.x, line.endPoint.y)
  ctx.stroke()
}

export { drawLine, drawLines, startMainProgram }
