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
  const gazeTargetsContainer = getGazeTargetsContainer(document.body);

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
  console.log(`Viewport Width: ${vw()}, Viewport Height: ${vh()}`);
  console.log('\n');
  console.log(validationData.toString());
}

const fiveDotCalibration = () => {
  const calibrationPattern = getPatternCoordsInPct({
    type: 'calibration', numTargets: 5
  });
  const gazeTargetsContainer = getGazeTargetsContainer(document.body);

  await gazeCalibration({
    webgazer,
    gazeTargetsCoords: calibrationPattern,
    drawGazeTarget: getDrawGazeTargetCallback(gazeTargetsContainer)
  });
};

const getDrawGazeTargetCallback = (targetsContainer) => {
  return (pos) => {
    return getGazeTarget({
      targetsContainer: targetsContainer,
      targetPos: pos,
      radius: 10
    });
  };
};

export {
  getDrawGazeTargetCallback, fiveDotCalibration,
  nineTargetsCalibrationFiveTargetsValidation
};

