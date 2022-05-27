import { checkNumericPos, checkPositiveNumericPos } from 'Src/data_types/pos.js'
import {
  checkGazeEstimations
} from 'Src/webgazer_extensions/calibration/data_types/gaze_estimations.js'

function createGazeAtTargetData ({
  targetPos,
  gazeEstimations,
  viewport
}) {
  const gazeAtTargetData = {
    targetPos,
    gazeEstimations,
    viewport
  }
  checkGazeAtTargetData(arguments[0], 'createGazeAtTargetData-given')
  return gazeAtTargetData
}

function checkGazeAtTargetData (gazeAtTargetData, argName) {
  const { targetPos, viewport, gazeEstimations } = gazeAtTargetData

  checkNumericPos(targetPos, argName + '.targetPos')
  checkPositiveNumericPos(viewport, argName + '.viewport')
  checkGazeEstimations(gazeEstimations, argName + '.gazeEstimations')
}

export {
  checkGazeAtTargetData,
  createGazeAtTargetData
}
