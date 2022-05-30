import { getGazeAtTargetAccuracy, getGazePrecision } from 'Src/calibration/validation_data_evaluation.js'
import { getPosRelativeToViewport } from 'Src/util/main.js'

function createEvaluatedGazeAtTargetData (gazeAtTargetData) {
  const { gazeEstimations, targetPos, viewport } = gazeAtTargetData

  return {
    relAcc: getPosRelativeToViewport({
      pos: getGazeAtTargetAccuracy({ targetPos, gazeEstimations }),
      viewport
    }),
    relPrec: getPosRelativeToViewport({
      pos: getGazePrecision(gazeEstimations),
      viewport
    })
  }
}

export {
  createEvaluatedGazeAtTargetData
}
