import { getMinXAndY } from 'Src/data_types/pos.js'
import { runClickCalibration, runGazeCalibration, runValidation } from 'Src/calibration/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { getCalibrationScoreEvaluation } from 'Src/calibration/success_score.js'
import { getWorstRelAccAndPrec } from 'Src/calibration/validation_data_evaluation.js'
import { getCalibrationInstructionPage, getCalibrationScorePage } from 'Src/calibration/view.js'
import { getGazeAtDwellBtnListener } from 'Src/main_program/evaluate_fixations.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { getDispersionThresholdFromPrec, getMinGazeTargetSizeFromAcc } from 'Src/main_program/util.js'

import {
  borderAcc, perfectAcc, borderPrec, calibrationType, numCalibrationTargets,
  dwellBtnDetectionAlgorithm
} from 'Settings'

function getCalibrationMode () {
  return new CalibrationMode()
}

class CalibrationMode {
  name = 'calibration'

  start (app) {
    getCalibrationResults({
      lang: app.settings.lang,
      rootDomEl: app.rootDomEl,
      targetSizeIsFixed: app.settings.targetSizeIsFixed,
      webgazer: app.webgazer
    }).then(res => {
      const { minGazeTargetSize, dispersionThreshold } = res
      app.minGazeTargetSize = minGazeTargetSize
      app.dispersionThreshold = dispersionThreshold
      if (dwellBtnDetectionAlgorithm === 'screenpoint') {
        app.gazeAtDwellBtnListener = getGazeAtDwellBtnListener(app)
      }
      activateMode(app, getMainMenuClosedMode(app))
    })
  }

  stop (app) {
    // There shouldn't be any asnchronous action that aborts the calibration
    // process. Stop is only there for CalibrationMode to be a valid mode.
  }
}

function getCalibrationResults ({
  lang,
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

      // If worst Acc or Prec is lower than border Acc or Prec, targets are
      // too big. So in that case use border Acc or Prec.
      const worstAccOrBorderAccRel = getMinXAndY(worstRelAcc, borderAcc)
      const worstPrecOrBorderPrecRel = getMinXAndY(worstRelPrec, borderPrec)
      const acc = getAbsPosFromPosRelativeToViewport(worstAccOrBorderAccRel)
      const prec = getAbsPosFromPosRelativeToViewport(worstPrecOrBorderPrecRel)

      const dispersionThreshold = getDispersionThresholdFromPrec(prec)
      const minGazeTargetSize = targetSizeIsFixed
        ? getMinGazeTargetSizeFromAcc(
          getAbsPosFromPosRelativeToViewport(borderAcc)
        )
        : getMinGazeTargetSizeFromAcc(acc)

      const calibrationScorePage = getCalibrationScorePage({
        calibrationScore,
        lang,
        onContinue: () => {
          calibrationScorePage.remove()
          resolve({ dispersionThreshold, minGazeTargetSize })
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
