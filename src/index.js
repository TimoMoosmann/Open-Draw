/* global webgazer */
import { addPositions, createPos, dividePositions, scalePosByVal } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { createZoom } from 'Src/main_program/data_types/zoom.js'
import { getDrawingCanvas } from 'Src/main_program/drawing_canvas.js'
import { getCalibrationMode } from 'Src/main_program/modes/calibration.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getBackgroundGrid, getDrawingCanvasInContainer } from 'Src/main_program/view.js'
import {
  getDispersionThresholdFromPrec, getMinGazeTargetSizeFromAcc,
  getSmallDistToNeighborTarget
} from 'Src/main_program/util.js'
import { setupWebgazer } from 'Src/setup_webgazer/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { setWebgazerGazeDotColor, showWebgazerVideoWhenFaceIsNotDetected } from 'Src/webgazer_extensions/setup/main.js'

import {
  borderAcc, borderPrec, defaultLineWidth, eyeModeOn, minDistToEdgeInPct,
  standardGazeDotColor
} from 'Settings'

async function main () {
  const app = {
    eyeModeOn,
    rootDomEl: document.body,
    state: {
      lines: [
        createLine({
          startPoint: createPos({ x: 100, y: 200 }),
          endPoint: createPos({ x: 400, xy: 300 }),
          strokeProperties: createStrokeProperties({
            color: 'blue',
            lineWidth: 5
          })
        }),
        createLine({
          startPoint: createPos({ x: 150, y: 50 }),
          endPoint: createPos({ x: 2200, y: 1300 }),
          strokeProperties: createStrokeProperties({
            color: 'red',
            lineWidth: 2
          })
        }),
        createLine({
          startPoint: createPos({ x: 700, y: 10 }),
          endPoint: createPos({ x: 2, y: 423 }),
          strokeProperties: createStrokeProperties({
            color: 'red',
            lineWidth: 2
          })
        })
      ],
      newLineProperties: createStrokeProperties({
        color: 'blue',
        lineWidth: defaultLineWidth
      }),
      zoom: createZoom()
    }
  }
  // For edit Mode to work with predefined lines
  app.state.linesBuffer = JSON.parse(JSON.stringify(app.state.lines))
  app.state.linesBufferIdx = app.state.linesBuffer.length - 1

  const { drawingCanvasDomEl, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  app.drawingCanvas = getDrawingCanvas(drawingCanvasDomEl)

  app.backgroundGrid = getBackgroundGrid()
  app.rootDomEl.appendChild(app.backgroundGrid)
  app.showBackgroundGrid = show => {
    show
      ? app.backgroundGrid.style.visibility = 'visible'
      : app.backgroundGrid.style.visibility = 'hidden'
  }

  if (eyeModeOn) {
    app.webgazer = await makeWebgazerReady()
    setWebgazerGazeDotColor(standardGazeDotColor)

    activateMode(app, getCalibrationMode())
    document.addEventListener('keydown', event => {
      if (event.key === 'r' && app.activeMode.name !== 'calibration') {
        activateMode(app)
      }
    })
  } else {
    const acc = getAbsPosFromPosRelativeToViewport(borderAcc)
    const prec = getAbsPosFromPosRelativeToViewport(borderPrec)

    app.dispersionThreshold = getDispersionThresholdFromPrec(prec)
    app.minGazeTargetSize = getMinGazeTargetSizeFromAcc(acc)

    // print how many btns fit in x and y direction every time the app
    // is started with eyeModeOn === false
    console.log('Number of buttons that fit on the screen:')
    console.log(calcNumBtnsFitOnScreen(app))

    activateMode(app, getMainMenuClosedMode(app))

  }
}

async function makeWebgazerReady () {
  const webgazerLocal = webgazer
  await setupWebgazer({
    webgazer: webgazerLocal,
    mouseModeOn: false,
    root: document.body,
    showPredictionPoints: false
  })
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal)
  return webgazerLocal
}

function calcNumBtnsFitOnScreen (app) {
  const distToNeighbor = dividePositions(
    getSmallDistToNeighborTarget(app), getViewport()
  )
  const distToEdge = scalePosByVal(minDistToEdgeInPct, 1 / 100)
  const btnSize = dividePositions(app.minGazeTargetSize, getViewport())
  return dividePositions(
    addPositions(
      createPos({ x: 1, y: 1 }),
      scalePosByVal(distToEdge, -2),
      distToNeighbor
    ),
    addPositions(btnSize, distToNeighbor)
  )
}

main()
