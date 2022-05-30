import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import {
  arrangeEquallySizedDwellBtnsToParallelMenu, arrangeOneBtnToLowerRight
} from 'Src/main_program/dwell_btn_patterns.js'
import { startDrawLineMode } from 'Src/main_program/draw_line_mode.js'
import { getMinDistToEdge, getSmallDistToNeighborTarget } from 'Src/main_program/util.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl,
  getMainMenuPage, getMainProgramContainer
} from 'Src/main_program/view.js'
import { createPos } from 'Src/data_types/pos.js'
import {
  getElementCenter, getElementRadii, getViewport, vh, vw
} from 'Src/util/browser.js'
import { runWebgazerFixationDetection } from 'Src/webgazer_extensions/fixation_detection/main.js'

import { standardDwellBtnActivationTime } from 'Settings'

import openMenuIcon from 'Assets/img/open_menu.png'
import startDrawLineModeIcon from 'Assets/img/start_draw_line_mode.png'

/*
const getMainMenuDwellBtns () => {
  return [
    getStartDrawModeDwellBtn(), getStartZoomModeDwellBtn(),
    getStartColorChooserDwellBtn(),
}
*/

function startMainProgram ({
  minTargetSize
}) {
  const mainProgramContainer = getMainProgramContainer()

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

  document.body.appendChild(mainProgramContainer)

  startMainMenuClosedScreen({
    lines: testLines,
    minTargetSize,
    root: mainProgramContainer
  })
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
    distToNeighbor: getSmallDistToNeighborTarget(),
    equallySizedDwellBtns: mainMenuDwellBtns,
    minDistToEdge: getMinDistToEdge(),
    getNextBtn: createDwellBtn({
      action: () => alert('next'),
      domId: 'nextBtn',
      size: minDwellBtnSize
    }),
    getPrevBtn: createDwellBtn({
      action: () => alert('prev'),
      domId: 'prevBtn',
      size: minDwellBtnSize
    }),
    viewport: getViewport()
  })

  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()

  root.appendChild(mainMenuDwellBtnsArranged)
  root.appendChild(drawingCanvasContainer)

  drawingCanvas.drawLines(lines)
}

/*
  const arrngedMainMenuDwellBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor,
    */

function getStartDrawLineModeDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: document.alert('Start Draw Line Mode'),
    domId: 'startDrawLineModeDwellBtn',
    icon: startDrawLineModeIcon,
    size: minDwellBtnSize,
    tite: 'Draw Line'
  })
}

function getStartEditModeDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: document.alert('Start Edit Mode'),
    domId: 'startEditModeDwellBtn',
    size: minDwellBtnSize,
    tite: 'Edit'
  })
}

function getStartColorChooserDwellBtn (minDwellBtnSize) {
  return createDwellBtn({
    action: document.alert('Start Color Chooser'),
    domId: 'startColorChooserDwellBtn',
    icon: startColorChooserIcon,
    size: minDwellBtnSize,
    tite: 'Choose Color'
  })
}

function startMainMenuClosedScreen ({
  lines,
  minTargetSize,
  root
}) {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => alert('open Main menu now.'),
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: minTargetSize,
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

function mainMenuPage ({
  actionOnDwellFixedThreshold,
  dwellDurationThreshold,
  lines,
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  webgazer
}) {
  const mainMenuPage = getMainMenuPage()
  document.body.append(mainMenuPage)
  const dwellBtnList = Array.from(mainMenuPage.querySelectorAll('button')).map(
    btn => {
      // TODO: Reset from btn.id to btn.name
      const btnAction = getDwellBtnAction({
        dwellBtnId: btn.id,
        dwellDurationThreshold,
        lines,
        mainMenuPage,
        minTargetRadii,
        runFixationDetectionFixedThresholds,
        webgazer
      })
      btn.addEventListener('click', btnAction)
      const btnEllipse = createEllipse({
        center: getElementCenter(btn),
        radii: getElementRadii(btn)
      })
      return { action: btnAction, ellipse: btnEllipse }
    }
  )
  runFixationDetectionFixedThresholds(fixation => actionOnDwellFixedThreshold({
    btnList: dwellBtnList, fixation
  }))
}

function actionOnDwell ({ btnList, fixation, dwellDurationThreshold }) {
  if (fixation.duration >= dwellDurationThreshold) {
    for (const btn of btnList) {
      if (inEllipse({ ellipse: btn.ellipse, pos: fixation.center })) {
        btn.action()
        break
      }
    }
  }
}

// const createDwellBtn = ({action, ellipse}) => ({action, ellipse})

// Dwell Button Specs
// Width, Height
// (Position)
// Action
// activationTime
// (Symbol / Icon)

function getDwellBtnAction ({
  dwellBtnId,
  dwellDurationThreshold,
  lines,
  mainMenuPage,
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  webgazer
}) {
  switch (dwellBtnId) {
    case 'drawBtn':
      return () => {
        mainMenuPage.remove()
        startDrawLineMode({
          dwellDurationThreshold,
          lines,
          minTargetRadii,
          runFixationDetectionFixedThresholds,
          webgazer
        })
      }
    case 'moveBtn':
      return () => alert('Move Button')
    case 'editBtn':
      return () => alert('Edit Button')
    case 'colorBtn':
      return () => alert('Color Button')
    default:
      throw new Error('No Action defined for button with ID: ' + dwellBtnId)
  }
}

export { drawLine, drawLines, startMainProgram }
