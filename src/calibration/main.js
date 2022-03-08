import {getPatternCoordsInPct} from './patterns.js';
import {getGazeTarget, getGazeTargetsContainer} from './view.js';
import {clickCalibration, gazeCalibration, validation} from '../webgazer_extensions/calibration.js';

const runGazeCalibration = async ({numTargets, webgazer}) => {
  await runCalibration({
    calibrationType: 'gaze',
    numTargets,
    webgazer
  });
};

const runClickCalibration = async ({numTargets, webgazer}) => {
  await runCalibration({
    calibrationType: 'click',
    numTargets,
    webgazer
  });
};

const runCalibration = async ({calibrationType, numTargets, webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  let calibrationProcedure;
  switch (calibrationType) {
    case 'click':
      calibrationProcedure = clickCalibration;
      break;
    case 'gaze':
      calibrationProcedure = gazeCalibration;
      break;
    default:
      throw new Error("calibrationType needs to be either 'click', or 'gaze'");
  }
  runCalibrationProcedure({
    calibrationProcedure,
    gazeTargetsCoords,
    webgazer
  });
};

const runValidation = async ({numTargets, webgazer}) => {
  const gazeTargetsCoords = getPatternCoordsInPct({
    type: 'validation', numTargets
  });
  return await runCalibrationProcedure({
    calibrationProcedure: validation,
    gazeTargetsCoords,
    webgazer
  });
};

const runCalibrationProcedure = async ({
  calibrationProcedure, gazeTargetsCoords, webgazer
}) => {
  const gazeTargetsContainer = getGazeTargetsContainer();
  const drawGazeTarget = getDrawGazeTargetCallback(gazeTargetsContainer);
  document.body.appendChild(gazeTargetsContainer);
  const procedureResult = await calibrationProcedure({
    drawGazeTarget,
    gazeTargetsCoords,
    webgazer
  });
  gazeTargetsContainer.remove();
  return procedureResult;
};

const getDrawGazeTargetCallback = ({radius, targetsContainer}) => {
  return pos =>  getGazeTarget({
    targetsContainer,
    targetPos: pos,
    radius
  });
};

export {
  runClickCalibration, runGazeCalibration, runValidation
};

