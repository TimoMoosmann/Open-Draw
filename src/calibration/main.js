import {getPatternCoordsInPct} from './patterns.js';
import {getGazeTarget, getGazeTargetsContainer} from './view.js';
import {vh, vw} from '../util/browser.js';
import {clickCalibration, gazeCalibration, validation} from '../webgazer_extensions/calibration.js';

const nineTargetsCalibrationFiveTargetsValidation = async (webgazer) => {

  const calibrationPattern = getPatternCoordsInPct({
    type: 'calibration', numTargets: 5
  });
  const validationPattern = getPatternCoordsInPct({
    type: 'validation', numTargets: 4
  });
  const gazeTargetsContainer = getGazeTargetsContainer();

  await gazeCalibration({
    webgazer,
    gazeTargetsCoords: calibrationPattern,
    drawGazeTarget: getDrawGazeTargetCallback(gazeTargetsContainer)
  });

  const validationData = await validation({
    webgazer,
    gazeTargetsCoords: validationPattern,
    drawGazeTarget: getDrawGazeTargetCallback(gazeTargetsContainer)
  });
  gazeTargetsContainer.remove();
}

const runGazeCalibration = async ({numTargets, webgazer}) => {
  const calibrationPattern = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const gazeTargetsContainer = getGazeTargetsContainer();

  await gazeCalibration({
    webgazer,
    gazeTargetsCoords: calibrationPattern,
    drawGazeTarget: getDrawGazeTargetCallback(gazeTargetsContainer)
  });
  gazeTargetsContainer.remove();
};

const runClickCalibration = async ({numTargets, webgazer}) => {
  const calibrationPattern = getPatternCoordsInPct({
    type: 'calibration', numTargets
  });
  const gazeTargetsContainer = getGazeTargetsContainer();

  await clickCalibration({
    webgazer,
    gazeTargetsCoords: calibrationPattern,
    drawGazeTarget: getDrawGazeTargetCallback(gazeTargetsContainer)
  });
  gazeTargetsContainer.remove();
};

const getDrawGazeTargetCallback = (targetsContainer) => {
  return (pos) => {
    return getGazeTarget({
      targetsContainer: targetsContainer,
      targetPos: pos,
      radius: 20
    });
  };
};

export {
  getDrawGazeTargetCallback, runGazeCalibration, runClickCalibration,
  nineTargetsCalibrationFiveTargetsValidation
};

