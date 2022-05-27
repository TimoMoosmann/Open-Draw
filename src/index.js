import { runClickCalibration, runGazeCalibration, runValidation } from './calibration/main.js'
import { createPos } from './data_types/pos.js'
import { startMainProgram } from './main_program/main.js'
import { setupWebgazer } from './setup_webgazer/main.js'
import { showWebgazerVideoWhenFaceIsNotDetected } from './webgazer_extensions/setup/main.js'

import { getCalibrationScoreEvaluation } from './calibration/success_score.js'
import { getWorstRelAccAndPrec } from './calibration/validation_data_evaluation.js'
import { getCalibrationScorePage } from './calibration/view.js'

const main = async () => {
  /*
  const webgazerLocal = webgazer
  await setupWebgazer({
    webgazer: webgazerLocal,
    mouseModeOn: false,
    root: document.body,
    showPredictionPoints: false
  })
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal)

  await runClickCalibration({ numTargets: 13, webgazer: webgazerLocal })
  const validationData = await runValidation({ webgazer: webgazerLocal })

  const { worstRelAcc, worstRelPrec } = getWorstRelAccAndPrec(validationData)

  // Determined after evaluating the calibration study.
  const borderAcc = createPos({ x: 0.06, y: 0.12 })
  const perfectAcc = createPos({ x: 0.03, y: 0.06 })
  const borderPrec = createPos({ x: 0.06, y: 0.1 })

  const trys = { trys: 0 }
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

  const calibrationScorePage = getCalibrationScorePage(calibrationScore)
  document.body.appendChild(calibrationScorePage)

  const minTargetSize = worstRelAcc * 2.5
  const maxFixationDispersion = worstRelPrec * 2.5

  // Sized Thresholds in html px
  const testMaxFixationDispersion = createPos({ x: 150, y: 150 })

  // Timed Thresholds
  const fixationDurationThreshold = 200
  const dwellDurationThreshold = 1000
  const webgazerBufferDuration = 500
  const maxFixationDuration =
    2 * dwellDurationThreshold + webgazerBufferDuration
  */

  const testMinTargetSize = createPos({ x: 200, y: 200 })

  startMainProgram({
    minTargetSize: testMinTargetSize
  })
  /*
  startMainProgram({
    dwellDurationThreshold,
    fixationDispersionThreshold: maxFixationDispersion,
    fixationDurationThreshold,
    maxFixationDuration,
    minTargetSize,
    webgazer: webgazerLocal
  })
  */
}

main()
