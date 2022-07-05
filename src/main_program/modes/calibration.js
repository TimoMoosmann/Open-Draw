import { getMinXAndY } from 'Src/data_types/pos.js'
import { runClickCalibration, runGazeCalibration, runValidation } from 'Src/calibration/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { getCalibrationScoreEvaluation } from 'Src/calibration/success_score.js'
import { getWorstRelAccAndPrec } from 'Src/calibration/validation_data_evaluation.js'
import { getCalibrationInstructionPage, getCalibrationScorePage } from 'Src/calibration/view.js'
import { getGazeAtDwellBtnListener } from 'Src/main_program/dwell_detection/dwell_at_btn_listener.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'

import {
  calibrationType, numCalibrationTargets
} from 'Settings/main.js'

function getCalibrationMode () {
  return new CalibrationMode()
}

class CalibrationMode {
  name = 'calibration'

  constructor (onCalibrated = () => {}) {
    this.onCalibrated = onCalibrated
  }

  start (app) {
    getCalibrationResults({
      borderAcc: app.settings.borderAccRel,
      borderPrec: app.settings.borderPrecRel,
      getDispersionThreshold: app.settings.getDispersionThreshold,
      getMinTargetSize: app.settings.getMinTargetSize[
        app.settings.dwellBtnDetectionAlgorithm
      ],
      lang: app.settings.lang,
      perfectAcc: app.settings.perfectAccRel,
      rootDomEl: app.rootDomEl,
      targetSizeIsFixed: app.settings.targetSizeIsFixed,
      webgazer: app.webgazer
    }).then(res => {
      const { accuracy, minGazeTargetSize, dispersionThreshold } = res
      app.accuracy = accuracy
      app.minGazeTargetSize = minGazeTargetSize
      app.dispersionThreshold = dispersionThreshold
      if (app.settings.dwellBtnDetectionAlgorithm === 'screenpoint') {
        app.gazeAtDwellBtnListener = getGazeAtDwellBtnListener(app)
      }
      this.onCalibrated()
      activateMode(app, getMainMenuClosedMode(app))
    })
  }

  stop (app) {
    // There shouldn't be any asnchronous action that aborts the calibration
    // process. Stop is only there for CalibrationMode to be a valid mode.
  }
}

function getCalibrationResults ({
  borderAcc,
  borderPrec,
  getDispersionThreshold,
  getMinTargetSize,
  lang,
  perfectAcc,
  targetSizeIsFixed,
  rootDomEl,
  webgazer
}) {
  return new Promise(resolve => {
    const calibrate = async webgazer => {
      const { worstRelAcc, worstRelPrec } =
        await evaluateCalibrationAndValidation(rootDomEl, webgazer)

      const colorCodes = {
        green: 'green',
        orange: 'darkorange',
        red: 'red',
        yellow: 'gold'
      }

      const calibrationScore = getCalibrationScoreEvaluation({
        borderAcc,
        colorCodes,
        perfectAcc,
        borderPrec,
        lang,
        minForGreen: 80,
        minForYellow: 65,
        minForOrange: 50,
        relAcc: worstRelAcc,
        relPrec: worstRelPrec
      })

      let absoluteRelevantAcc = getAbsPosFromPosRelativeToViewport(
        borderAcc
      )
      let absoluteRelevantPrec = getAbsPosFromPosRelativeToViewport(
        borderPrec
      )
      if (!targetSizeIsFixed) {
        // If worst Acc or Prec is lower than border Acc or Prec, targets are
        // too big. So in that case use border Acc or Prec.
        absoluteRelevantAcc = getMinXAndY(
          getAbsPosFromPosRelativeToViewport(worstRelAcc),
          absoluteRelevantAcc
        )
        absoluteRelevantPrec = getMinXAndY(
          getAbsPosFromPosRelativeToViewport(worstRelPrec),
          absoluteRelevantPrec
        )
      }

      const dispersionThreshold = getDispersionThreshold(absoluteRelevantPrec)
      const minGazeTargetSize = getMinTargetSize(
        absoluteRelevantAcc, absoluteRelevantPrec
      )

      const calibrationScorePage = getCalibrationScorePage({
        calibrationScore,
        lang,
        onContinue: () => {
          calibrationScorePage.remove()
          resolve({
            accuracy: absoluteRelevantAcc,
            dispersionThreshold,
            minGazeTargetSize
          })
        },
        onRecalibrate: () => {
          calibrationScorePage.remove()
          calibrate(webgazer)
        }
      })
      rootDomEl.appendChild(calibrationScorePage)
    }
    calibrate(webgazer)
  })
}

async function evaluateCalibrationAndValidation (root, webgazer) {
  const showInstructionsTime = 6000
  let runCal
  switch (calibrationType) {
    case 'click':
      runCal = () => runClickCalibration({
        numTargets: numCalibrationTargets, webgazer
      })
      break
    case 'gaze':
      runCal = () => runGazeCalibration({
        numTargets: numCalibrationTargets, webgazer
      })
      break
    default:
      throw new TypeError(
        "calibrationType needs to be either 'click', or 'gaze."
      )
  }
  await showPageForMilliseconds(
    root, getCalibrationInstructionPage(calibrationType), showInstructionsTime
  )
  await runCal()
  await showPageForMilliseconds(
    root, getCalibrationInstructionPage('validation'), showInstructionsTime
  )
  const validationData = await runValidation({ webgazer })
  return getWorstRelAccAndPrec(validationData)
}

function showPageForMilliseconds (root, page, milliseconds) {
  return new Promise(resolve => {
    root.appendChild(page)
    setTimeout(() => {
      page.remove()
      resolve()
    }, milliseconds)
  })
}

export {
  getCalibrationMode
}
