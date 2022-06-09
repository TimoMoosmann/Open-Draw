/* global webgazer */
import { runClickCalibration, runGazeCalibration, runValidation } from 'Src/calibration/main.js'
import { createPos, scalePosByVal, getMinXAndY } from 'Src/data_types/pos.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { createZoom } from 'Src/main_program/data_types/zoom.js'
import { getDrawingCanvas } from 'Src/main_program/drawing_canvas.js'
import { getGazeAtDwellBtnListener } from 'Src/main_program/evaluate_fixations.js'
import { startMainProgram } from 'Src/main_program/main.js'
import { getDrawingCanvasInContainer } from 'Src/main_program/view.js'
import { setupWebgazer } from 'Src/setup_webgazer/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { setWebgazerGazeDotColor, showWebgazerVideoWhenFaceIsNotDetected } from 'Src/webgazer_extensions/setup/main.js'
import { getCalibrationScoreEvaluation } from 'Src/calibration/success_score.js'
import { getWorstRelAccAndPrec } from 'Src/calibration/validation_data_evaluation.js'
import { getCalibrationScorePage } from 'Src/calibration/view.js'

import {
  calibrationType, eyeModeOn, numCalibrationTargets, standardGazeDotColor
} from 'Settings'

async function main () {
  /*
  const ll = new List()
  ll.append(new Item())
  */
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
        lineWidth: 2
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

    const { minGazeTargetSize, maxFixationDispersion } =
      await getCalibrationResults(webgazer, app.rootDomEl)
    app.minGazeTargetSize = minGazeTargetSize
    app.maxFixationDispersion = maxFixationDispersion
  } else {
    app.minGazeTargetSize = createPos({ x: 200, y: 200 })
  }

  app.gazeAtDwellBtnListener = getGazeAtDwellBtnListener(app)

  startMainProgram(app)
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

function getCalibrationResults (webgazer, rootDomEl) {
  const calibrationTrys = { trys: 0 }
  if (process.env.NODE_ENV === 'development') {
    // No need for recalibration during testing.
    calibrationTrys.trys++
  }

  return new Promise(resolve => {
    const calibrate = async (webgazer, trys) => {
      // Determined after evaluating the calibration study.
      const borderAcc = createPos({ x: 0.06, y: 0.12 })
      const perfectAcc = createPos({ x: 0.03, y: 0.06 })
      const borderPrec = createPos({ x: 0.06, y: 0.1 })

      const { worstRelAcc, worstRelPrec } =
        await evaluateCalibrationAndValidation(webgazer)

      const calibrationScore = getCalibrationScoreEvaluation({
        borderAcc,
        perfectAcc,
        borderPrec,
        minForGreen: 80,
        minForYellow: 65,
        minForOrange: 50,
        relAcc: worstRelAcc,
        relPrec: worstRelPrec,
        trys
      })

      // If worst Acc or Prec is lower than border Acc or Prec, targets are
      // too big. So in that case use border Acc or Prec.
      const worstAccOrBorderAccRel = getMinXAndY(worstRelAcc, borderAcc)
      const worstPrecOrBorderPrecRel = getMinXAndY(worstRelPrec, borderPrec)
      const minGazeTargetSize = scalePosByVal(
        getAbsPosFromPosRelativeToViewport(worstAccOrBorderAccRel), 2.5
      )
      const maxFixationDispersion = scalePosByVal(
        getAbsPosFromPosRelativeToViewport(worstPrecOrBorderPrecRel), 2.5
      )

      const calibrationScorePage = getCalibrationScorePage({
        calibrationScore,
        onContinue: () => {
          calibrationScorePage.remove()
          resolve({ maxFixationDispersion, minGazeTargetSize })
        },
        onRecalibrate: () => {
          calibrationScorePage.remove()
          calibrate(webgazer, trys)
        }
      })
      rootDomEl.appendChild(calibrationScorePage)
    }
    calibrate(webgazer, calibrationTrys)
  })
}

async function evaluateCalibrationAndValidation (webgazer) {
  switch (calibrationType) {
    case 'click':
      await runClickCalibration({
        numTargets: numCalibrationTargets, webgazer
      })
      break
    case 'gaze':
      await runGazeCalibration({
        numTargets: numCalibrationTargets, webgazer
      })
      break
    default:
      throw new TypeError(
        "calibrationType needs to be either 'click', or 'gaze."
      )
  }
  const validationData = await runValidation({ webgazer })
  return getWorstRelAccAndPrec(validationData)
}

main()
