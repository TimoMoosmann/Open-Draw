import { createPos, scalePos } from 'Src/data_types/pos.js'
import { getPosRelativeToViewport } from 'Src/util/main.js'
import { calcSampleStandardDeviation, meanOffset } from 'Src/util/math.js'
import {
  checkValidationData
} from 'Src/webgazer_extensions/calibration/data_types/validation_data.js'

function getWorstRelAccAndPrec (validationData) {
  checkValidationData(validationData)
  let worstRelAcc, worstRelPrec
  for (const gazeAtTargetData of validationData) {
    const { relAcc, relPrec } =
      createEvaluatedGazeAtTargetData(gazeAtTargetData)

    if (worstRelAcc === undefined) {
      worstRelAcc = relAcc
      worstRelPrec = relPrec
    } else {
      if (relAcc.x > worstRelAcc.x) worstRelAcc.x = relAcc.x
      if (relAcc.y > worstRelAcc.y) worstRelAcc.y = relAcc.y
      if (relPrec.x > worstRelPrec.x) worstRelPrec.x = relPrec.x
      if (relPrec.y > worstRelPrec.y) worstRelPrec.y = relPrec.y
    }
  }
  return { worstRelAcc, worstRelPrec }
}

// Works only for if validation is done with 5 targets (which is standard).
function getRelTargetPosName (targetPosRel) {
  const isCenter = num => num > 0.49 && num < 0.51
  const isLower = num => num <= 0.49
  let name = ''

  if (isCenter(targetPosRel.y)) {
    name += 'center '
  } else if (isLower(targetPosRel.y)) {
    name += 'upper '
  } else {
    name += 'lower '
  }

  if (isCenter(targetPosRel.x)) {
    name += 'center'
  } else if (isLower(targetPosRel.x)) {
    name += 'left'
  } else {
    name += 'right'
  }
  return name
}

function createEvaluatedGazeAtTargetData (gazeAtTargetData) {
  const targetPos = gazeAtTargetData.targetPos
  const gazeEstimations = gazeAtTargetData.gazeEstimations
  const viewportPos = gazeAtTargetData.viewport
  return {
    relAcc: getPosRelativeToViewport({
      pos: getGazeAtTargetAccuracy({ targetPos, gazeEstimations }),
      viewportPos
    }),
    relPrec: getPosRelativeToViewport({
      pos: getGazePrecision(gazeEstimations),
      viewportPos
    })
  }
}

function getGazeAtTargetAccuracy ({
  targetPos,
  gazeEstimations
}) {
  return createPos({
    x: meanOffset(targetPos.x, gazeEstimations.map(pos => pos.x)),
    y: meanOffset(targetPos.y, gazeEstimations.map(pos => pos.y))
  })
}

function getGazePrecision (gazeEstimations) {
  return createPos({
    x: calcSampleStandardDeviation(gazeEstimations.map(pos => pos.x)),
    y: calcSampleStandardDeviation(gazeEstimations.map(pos => pos.y))
  })
}

function getMinGazeTargetSize (accuracy) {
  return scalePos(accuracy, 2)
}

/*
 * Precision is the standard deviation, so we know that about 95% of the
 * gaze points lie within 2 times the precision, if the
 * gaze points are normaly distributed
 * Choose a bigger factor than 2 if success rate over 95% is necassary.
 */
function getRecommendedFixationSize (precision, sigma = 2) {
  return scalePos(precision, sigma)
}

export {
  getGazeAtTargetAccuracy,
  getGazePrecision,
  getMinGazeTargetSize,
  getRecommendedFixationSize,
  getRelTargetPosName,
  getWorstRelAccAndPrec
}
