import { getPatternCoordsInPct } from 'Src/calibration/patterns.js'
import { getGazeTarget, getGazeTargetsContainer } from 'Src/calibration/view.js'
import { clickCalibration, gazeCalibration, validation } from 'Src/webgazer_extensions/calibration/main.js'

import {
  gazeTargetRadius,
  gazeCalibrationTimeTillRecord, gazeCalibrationRecordDuration,
  gazeCalibrationRecordIntervalDuration,
  validationCaptureDuration, validationTimeTillCapture
} from 'Settings'

async function runGazeCalibration ({
  numTargets,
  recordDuration = gazeCalibrationRecordDuration,
  recordIntervalDuration = gazeCalibrationRecordIntervalDuration,
  targetRadius = gazeTargetRadius,
  timeTillRecord = gazeCalibrationTimeTillRecord,
  webgazer
}) {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  })
  const calibrationProcedure = drawGazeTarget => gazeCalibration({
    drawGazeTarget,
    gazeTargetsCoords,
    recordDuration,
    recordIntervalDuration,
    timeTillRecord,
    webgazer
  })
  await runCalibrationProcedure({ calibrationProcedure, targetRadius })
}

async function runClickCalibration ({
  numTargets,
  targetRadius = gazeTargetRadius,
  webgazer
}) {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  })
  const calibrationProcedure = drawGazeTarget => clickCalibration({
    drawGazeTarget,
    gazeTargetsCoords,
    webgazer
  })
  webgazer.addMouseEventListeners()
  await runCalibrationProcedure({ calibrationProcedure, targetRadius })
  webgazer.removeMouseEventListeners()
}

async function runValidation ({
  captureDuration = validationCaptureDuration,
  numTargets = 4,
  targetRadius = gazeTargetRadius,
  timeTillCapture = validationTimeTillCapture,
  webgazer
}) {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'validation', numTargets
  })
  const calibrationProcedure = drawGazeTarget => validation({
    captureDuration,
    drawGazeTarget,
    gazeTargetsCoords,
    timeTillCapture,
    webgazer
  })
  return await runCalibrationProcedure({ calibrationProcedure, targetRadius })
}

async function runCalibrationProcedure ({
  calibrationProcedure, targetRadius
}) {
  const gazeTargetsContainer = getGazeTargetsContainer()
  const drawGazeTarget = getDrawGazeTargetCallback({
    radius: targetRadius, targetsContainer: gazeTargetsContainer
  })
  document.body.appendChild(gazeTargetsContainer)
  const procedureResult = await calibrationProcedure(drawGazeTarget)
  gazeTargetsContainer.remove()
  return procedureResult
}

function getDrawGazeTargetCallback ({ radius, targetsContainer }) {
  return pos => getGazeTarget({
    targetsContainer,
    targetPos: pos,
    radius
  })
}

export {
  runClickCalibration, runGazeCalibration, runValidation
}
