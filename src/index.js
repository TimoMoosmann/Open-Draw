/* global webgazer */
import { addPositions, createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { createZoom } from 'Src/main_program/data_types/zoom.js'
import { getDrawingCanvas } from 'Src/main_program/drawing_canvas.js'
import { getCalibrationMode } from 'Src/main_program/modes/calibration.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getDrawingCanvasInContainer } from 'Src/main_program/view.js'
import { setupWebgazer } from 'Src/setup_webgazer/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { setWebgazerGazeDotColor, showWebgazerVideoWhenFaceIsNotDetected } from 'Src/webgazer_extensions/setup/main.js'

import {
  borderAcc, perfectAcc, borderPrec,
  calibrationType, defaultLineWidth, eyeModeOn, numCalibrationTargets,
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

  const { drawingCanvasDomEl, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  app.drawingCanvas = getDrawingCanvas(drawingCanvasDomEl)

  if (eyeModeOn) {
    app.webgazer = await makeWebgazerReady()
    setWebgazerGazeDotColor(standardGazeDotColor)

    activateMode(app, getCalibrationMode())
    document.addEventListener('keydown', event => {
      if (event.key === 'r' && app.activeMode.name !== 'calibration') {
        activateMode(app, getCalibrationMode())
      }
    })
  } else {
    const acc = getAbsPosFromPosRelativeToViewport(borderAcc)
    const prec = getAbsPosFromPosRelativeToViewport(borderPrec)

    app.minGazeTargetSize = scalePosByVal(
      addPositions(acc, scalePosByVal(prec, 2)), 2.2
    )
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

main()
