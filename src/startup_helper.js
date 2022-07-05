/* global webgazer */
import { addPositions, createPos, dividePositions, scalePosByVal } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { createZoom } from 'Src/main_program/data_types/zoom.js'
import { getDrawingCanvas } from 'Src/main_program/drawing_canvas.js'
import { getGazeAtDwellBtnListener } from 'Src/main_program/dwell_detection/dwell_at_btn_listener.js'
import { getCalibrationMode } from 'Src/main_program/modes/calibration.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getBackgroundGrid, getDrawingCanvasInContainer } from 'Src/main_program/view.js'
import { getGazeDot } from 'Src/setup_webgazer/gaze_dot.js'
import { setupWebgazer } from 'Src/setup_webgazer/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'

async function createAndStartApp (settings, showTestLines = true) {
  const getTestLines = () => [
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
  ]

  const app = {
    settings,
    rootDomEl: document.body,
    state: {
      lines: showTestLines ? getTestLines() : [],
      linesBuffer: showTestLines ? getTestLines() : [],
      linesBufferIdx: showTestLines ? getTestLines().length - 1 : -1,
      newLineProperties: createStrokeProperties({
        color: settings.defaultColor,
        lineWidth: settings.defaultLineWidth
      }),
      zoom: createZoom()
    }
  }

  const { drawingCanvasDomEl, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  app.drawingCanvas = getDrawingCanvas(drawingCanvasDomEl)

  const backgroundGrid = getBackgroundGrid()
  app.rootDomEl.appendChild(backgroundGrid)
  app.showBackgroundGrid = show => {
    show
      ? backgroundGrid.style.visibility = 'visible'
      : backgroundGrid.style.visibility = 'hidden'
  }

  app.gazeDot = getGazeDot({
    app,
    color: app.settings.standardGazeDotColor,
    refreshesPerSecond: app.settings.gazeDotRefreshesPerSecond,
    rootEl: app.rootDomEl
  })

  if (app.settings.eyeModeOn) {
    await setupWebgazerNormal(app)
    activateMode(app, getCalibrationMode())
    document.addEventListener('keydown', event => {
      if (event.key === 'r' && app.activeMode.name !== 'calibration') {
        activateMode(app, getCalibrationMode(
          setupDwellDetectionListener(app)
        ))
      }
    })
  } else {
    app.mouseListeners = {}
    const acc = getAbsPosFromPosRelativeToViewport(app.settings.borderAccRel)
    const prec = getAbsPosFromPosRelativeToViewport(app.settings.borderPrecRel)

    app.accuracy = acc
    app.minGazeTargetSize = app.settings.getMinTargetSize[
      app.settings.dwellBtnDetectionAlgorithm
    ](acc, prec)
    app.dispersionThreshold = app.settings.getDispersionThreshold(prec)
    setupDwellDetectionListener(app)

    if (app.settings.debugOn) {
      // print how many btns fit in x and y direction every time the app
      // is started with eyeModeOn === false
      console.log(
        'Number of buttons that fit in one row / column, when alligned:'
      )
      console.log(calcNumBtnsFitOnScreen(app))
    }
    activateMode(app, getMainMenuClosedMode(app))
  }
}

async function setupWebgazerNormal (app) {
  app.webgazer = await setupWebgazer({
    webgazer,
    lang: app.settings.lang,
    mouseModeOn: false,
    root: app.rootDomEl,
    showVideoWhenFaceIsNotDetected: true
  })
}

function setupDwellDetectionListener (app) {
  if (app.settings.dwellBtnDetectionAlgorithm === 'screenpoint') {
    app.gazeAtDwellBtnListener = getGazeAtDwellBtnListener(app)
  }
}

function calcNumBtnsFitOnScreen (app) {
  const distToNeighbor = dividePositions(
    app.settings.getSmallDistBetweenTargets(app.minGazeTargetSize),
    getViewport()
  )
  const distToEdge = app.settings.minDistToEdgeRel
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

export {
  createAndStartApp
}
