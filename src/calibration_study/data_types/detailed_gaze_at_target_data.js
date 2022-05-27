import {
  getGazeAtTargetAccuracy, getGazePrecision, getMinGazeTargetSize,
  getRecommendedFixationSize, getRelTargetPosName
} from 'Src/calibration/validation_data_evaluation.js'
import { getPosRelativeToViewport } from 'Src/util/main.js'
import {
  checkGazeAtTargetData
} from 'Src/webgazer_extensions/calibration/data_types/gaze_at_target_data.js'

function createDetailedGazeAtTargetData (gazeAtTargetData) {
  checkGazeAtTargetData(gazeAtTargetData, 'gazeAtTargetData')
  const { gazeEstimations, targetPos, viewport } = gazeAtTargetData

  const accuracy = getGazeAtTargetAccuracy({ targetPos, gazeEstimations })
  const precision = getGazePrecision(gazeEstimations)
  const minTargetSize = getMinGazeTargetSize(accuracy)
  const recommendedFixationSize = getRecommendedFixationSize(precision)
  const targetPosRelative = getPosRelativeToViewport({
    pos: targetPos, viewport
  })

  return {
    accuracy,
    accuracyRelative: getPosRelativeToViewport({ pos: accuracy, viewport }),
    gazeEstimations,
    minTargetSize,
    minTargetSizeRelative: getPosRelativeToViewport({
      pos: minTargetSize,
      viewport
    }),
    precision,
    precisionRelative: getPosRelativeToViewport({
      pos: precision, viewport
    }),
    recommendedFixationSize,
    recommendedFixationSizeRelative: getPosRelativeToViewport({
      pos: recommendedFixationSize,
      viewport
    }),
    targetPos,
    targetPosName: getRelTargetPosName(targetPosRelative),
    targetPosRelative,
    viewport
  }
}

export {
  createDetailedGazeAtTargetData
}
