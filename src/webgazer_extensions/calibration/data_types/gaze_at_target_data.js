import { checkGazeEstimations } from 'Src/webgazer_extensions/calibration/data_types/gaze_estimations.js'
import { checkPositiveNumericPos, isPosLowerThanOrEqual } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'

function createGazeAtTargetData ({
  targetPos,
  gazeEstimations,
  viewport = getViewport()
}) {
  const gazeAtTargetData = {
    targetPos,
    gazeEstimations,
    viewport
  }

  checkGazeAtTargetData(gazeAtTargetData, 'createGazeAtTargetData-given')
  return gazeAtTargetData
}

function checkGazeAtTargetData (gazeAtTargetData, argName) {
  const { targetPos, viewport, gazeEstimations } = gazeAtTargetData

  checkPositiveNumericPos(targetPos, argName + '.targetPos')
  checkGazeEstimations(gazeEstimations, argName + '.gazeEstimations')
  checkPositiveNumericPos(viewport, argName + '.viewport')

  if (!isPosLowerThanOrEqual(targetPos, viewport)) {
    throw new TypeError(argName + ': targetPos is outside viewport.')
  }
}

export {
  checkGazeAtTargetData,
  createGazeAtTargetData
}
