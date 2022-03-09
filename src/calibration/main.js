import {getPatternCoordsInPct} from './patterns.js';
import {getGazeTarget, getGazeTargetsContainer} from './view.js';
import {clickCalibration, gazeCalibration, validation} from '../webgazer_extensions/calibration.js';

const runGazeCalibration = async ({
  afterRecordBufferDuration = 500,
  numTargets,
  recordDuration = 1000,
  recordIntervalDuration = 100,
  targetRadius = 20,
  timeTillRecord = 800,
  webgazer
}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const calibrationProcedure = drawGazeTarget => gazeCalibration({
    afterRecordBufferDuration,
    drawGazeTarget,
    gazeTargetsCoords,
    recordDuration,
    recordIntervalDuration,
    timeTillRecord,
    webgazer
  });
  await runCalibrationProcedure({calibrationProcedure, targetRadius});
};

const runClickCalibration = async ({
  numTargets,
  targetRadius = 20,
  webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const calibrationProcedure = drawGazeTarget => clickCalibration({
    drawGazeTarget,
    gazeTargetsCoords,
    webgazer
  });
  await runCalibrationProcedure({calibrationProcedure, targetRadius});
};

const runValidation = async ({
  afterCaptureBufferDuration=500,
  captureDuration=1000,
  numTargets,
  targetRadius = 20,
  timeTillCapture = 1000,
  webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'validation', numTargets
  });
  const calibrationProcedure = drawGazeTarget => validation({
    afterCaptureBufferDuration,
    captureDuration,
    drawGazeTarget,
    gazeTargetsCoords,
    timeTillCapture,
    webgazer
  });
  return await runCalibrationProcedure({calibrationProcedure, targetRadius});
};

const runCalibrationProcedure = async ({
  calibrationProcedure, targetRadius
})=> {
  const gazeTargetsContainer = getGazeTargetsContainer();
  const drawGazeTarget = getDrawGazeTargetCallback({
    radius: targetRadius, targetsContainer: gazeTargetsContainer
  });
  document.body.appendChild(gazeTargetsContainer);
  const procedureResult = await calibrationProcedure(drawGazeTarget);
  gazeTargetsContainer.remove();
  return procedureResult;
};

const getDrawGazeTargetCallback = ({radius, targetsContainer}) => {
  return pos => getGazeTarget({
    targetsContainer,
    targetPos: pos,
    radius
  });
};

export {
  runClickCalibration, runGazeCalibration, runValidation
};

