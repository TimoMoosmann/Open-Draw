import {getPatternCoordsInPct} from './patterns.js';
import {getGazeTarget, getGazeTargetsContainer} from './view.js';
import {clickCalibration, gazeCalibration, validation} from '../webgazer_extensions/calibration.js';

const defaultTargetRadius = 27;
const recommendedTimeTillCapture = 700;

const runGazeCalibration = async ({
  numTargets,
  recordDuration = 1300,
  recordIntervalDuration = 50,
  targetRadius = defaultTargetRadius,
  timeTillRecord = recommendedTimeTillCapture,
  webgazer
}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const calibrationProcedure = drawGazeTarget => gazeCalibration({
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
  targetRadius = defaultTargetRadius,
  webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const calibrationProcedure = drawGazeTarget => clickCalibration({
    drawGazeTarget,
    gazeTargetsCoords,
    webgazer
  });
  webgazer.addMouseEventListeners();
  await runCalibrationProcedure({calibrationProcedure, targetRadius});
  webgazer.removeMouseEventListeners();
};

const runValidation = async ({
  captureDuration=1000,
  numTargets = 4,
  targetRadius = defaultTargetRadius,
  timeTillCapture = recommendedTimeTillCapture,
  webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'validation', numTargets
  });
  const calibrationProcedure = drawGazeTarget => validation({
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

