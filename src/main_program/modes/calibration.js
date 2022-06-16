import { addPositions, scalePosByVal, getMinXAndY } from 'Src/data_types/pos.js'
import { runClickCalibration, runGazeCalibration, runValidation } from 'Src/calibration/main.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'
import { getCalibrationScoreEvaluation } from 'Src/calibration/success_score.js'
import { getWorstRelAccAndPrec } from 'Src/calibration/validation_data_evaluation.js'
import { getCalibrationScorePage } from 'Src/calibration/view.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'

import {
  borderAcc, perfectAcc, borderPrec, calibrationType, numCalibrationTargets
} from 'Settings'

function getCalibrationMode () {
  return new CalibrationMode()
}

class CalibrationMode {
  name = 'calibration'

  start (app) {
    getCalibrationResults(app.webgazer, app.rootDomEl).then(res => {
      const { minGazeTargetSize, dispersionThreshold } = res
      app.minGazeTargetSize = minGazeTargetSize
      app.dispersionThreshold = dispersionThreshold
      activateMode(app, getMainMenuClosedMode(app))
    })
  }

  stop (app) {
    // There shouldn't be any asnchronous action that aborts the calibration
    // process. Stop is only there for CalibrationMode to be a valid mode.
  }
}

function getCalibrationResults (webgazer, rootDomEl) {
  return new Promise(resolve => {
    const calibrate = async webgazer => {
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
        relPrec: worstRelPrec
      })

      // If worst Acc or Prec is lower than border Acc or Prec, targets are
      // too big. So in that case use border Acc or Prec.
      const worstAccOrBorderAccRel = getMinXAndY(worstRelAcc, borderAcc)
      const worstPrecOrBorderPrecRel = getMinXAndY(worstRelPrec, borderPrec)
      const acc = getAbsPosFromPosRelativeToViewport(worstAccOrBorderAccRel)
      const prec = getAbsPosFromPosRelativeToViewport(worstPrecOrBorderPrecRel)

      const minGazeTargetSize = scalePosByVal(
        addPositions(acc, scalePosByVal(prec, 2)), 2.3
      )
      const dispersionThreshold = scalePosByVal(prec, 3)

      const calibrationScorePage = getCalibrationScorePage({
        calibrationScore,
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

export {
  getCalibrationMode
}
