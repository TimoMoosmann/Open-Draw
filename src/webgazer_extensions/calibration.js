import {createGazeAtTargetData, createPos} from '../data_types';
import {popRandomItem} from '../util/main.js';

/*
 * Draws the current target for the user to look at.
 *
 * @callback drawTargetCallback
 * @param {Object} position - Position of the target
 * @param {number} position.x - Percentage value on the x-Axis.
 * @param {number} position.y - Percentage value on the y-Axis.
 * @returns {Object} - HTML Element that represents the target and can be
 * deleted when before a new target is shown.
 */

/*
 * Webgazer Calibration Process that displays a new target when after clicking
 * on the current target.
 *
 * @param {object[]} gazeTargetsCoords - Coordinates for each target the user
 * should look at. Order doesn't matter.
 * @param {drawTargetCallback} drawTarget - Function that draws a target.
 * @param {function} onFinsh - Callback that is executed when the calibration
 * is done.
 */
const clickCalibration = ({ 
  webgazer,
  gazeTargetsCoords = [{x: 25, y: 25}, {x: 50, y: 50}, {x: 75, y: 75}],
  drawGazeTarget = pos => {},
} = {}) => {
  return new Promise(resolve => {
    drawGazeTargets({
      targetsCoords: gazeTargetsCoords,
      drawTarget: drawGazeTarget,
      onFinish: () => resolve(),
      onTargetActive: (currentTarget, drawNextTarget) => {
        currentTarget.addEventListener('click', () => {
          drawNextTarget();
        });
      }
    });
  });
};

/*
 * Webgazer Calibration Process that displays a new target after a given time.
 * Captures click data, without users need to click on the target.
 * 
 * @param {object} webgazer - The webgazer object.
 * @param {object[]} gazeTargetsCoords - Coordinates for each target the user
 * should look at. Order doesn't matter.
 * @param {number} timeTillRecord - Milliseconds that pass when a new target
 * appears until the gaze data of the user is recorded.
 * @param {number} recordDuration - Duration the users gaze is captured in
 * Milliseconds.
 * @param {number} recordIntervalTime - Milliseconds that pass until a new
 * gaze point is captured.
 * @param {number} bufferDuration - Milliseconds that pass after capturing
 * users gaze point. Serve as a buffer for potential webgazer delays.
 * @param {drawTargetCallback} drawTarget - Function that draws a target.
 * @param {function} onFinsh - Callback that is executed when the calibration
 * is done.
 */
const gazeCalibration = ({
  webgazer,
  gazeTargetsCoords = [{x: 25, y: 25}, {x: 50, y: 50}, {x: 75, y: 75}],
  timeTillRecord = 800,
  recordDuration = 1000,
  recordIntervalDuration = 100,
  afterRecordBufferDuration = 500,
  drawGazeTarget = pos => {},
} = {}) => {
  return new Promise(resolve => {
    drawGazeTargets({
      targetsCoords: gazeTargetsCoords,
      drawTarget: drawGazeTarget,
      onFinish: () => resolve(),
      onTargetActive: (currentTarget, drawNextTarget) => {
        recordGazeAtTarget({
          webgazer,
          target: currentTarget,
          timeTillRecord,
          recordDuration,
          recordIntervalDuration,
          afterRecordBufferDuration,
          onFinish: drawNextTarget
        });
      }
    });
  });
};

const validation = ({
  webgazer,
  gazeTargetsCoords = [createPos({x: 0, y: 0})],
  timeTillCapture = 1000,
  captureDuration=1000,
  drawGazeTarget = pos => {}
}) => {
  return new Promise(resolve => {
    const validationData = [];
    drawGazeTargets({
      targetsCoords: gazeTargetsCoords,
      drawTarget: drawGazeTarget,
      onFinish: () => resolve(validationData),
      onTargetActive: (currentTarget, drawNextTarget) => {
        captureValidationDataForTarget({
          webgazer,
          validationData,
          target: currentTarget,
          timeTillCapture,
          captureDuration,
          onFinish: drawNextTarget
        });
      }
    });
  });
}

const drawGazeTargets = ({
  targetsCoords, drawTarget, onFinish, onTargetActive
} = {}) => {
  if (targetsCoords.length > 0) {
    const currentTarget = drawTarget(popRandomItem(targetsCoords));
    onTargetActive(currentTarget, () => {
      currentTarget.remove();
      drawGazeTargets({targetsCoords, drawTarget, onFinish, onTargetActive});
    });
  } else {
    onFinish();
  }
}

const recordGazeAtTarget = ({
  webgazer,
  target,
  timeTillRecord,
  recordDuration,
  recordIntervalDuration,
  afterRecordBufferDuration,
  onFinish
}) => {
  const targetPos = getElementsCenter(target);
  const startTime = Date.now();
  setTimeout(() => {
    const recordGazeAtTargetInterval = setInterval(() => {
      webgazer.recordScreenPosition(targetPos.x, targetPos.y, 'click');
    }, recordIntervalDuration);
    setTimeout(() => {
      clearInterval(recordGazeAtTargetInterval);
      onFinish();
    }, recordDuration);
  }, timeTillRecord);
}

const getElementsCenter = element => {
  const boundingRect = element.getBoundingClientRect();
  return createPos({
    x: Math.round(boundingRect.x + (boundingRect.width / 2)),
    y: Math.round(boundingRect.y + (boundingRect.height / 2))
  });
}

const captureValidationDataForTarget = ({
  webgazer,
  validationData,
  target,
  timeTillCapture,
  captureDuration,
  onFinish
}) => {
  const targetPos = getElementsCenter(target);
  setTimeout(() => {
    const gazeEstimations = [];
    const gazeEstimationCaptureStartTime = Date.now();
    webgazer.setGazeListener((estimatedGazePoint, elapsedTime) => {
      if (estimatedGazePoint &&
        (Date.now() - gazeEstimationCaptureStartTime) < captureDuration
      ){
        gazeEstimations.push(createPos({
          x: Math.round(estimatedGazePoint.x),
          y: Math.round(estimatedGazePoint.y)
        }));
      } else {
        validationData.push(createGazeAtTargetData({
          targetPos,
          gazeEstimations
        }));
        webgazer.clearGazeListener();
        onFinish();
      }
    });
  }, timeTillCapture);
}

export {clickCalibration, gazeCalibration, validation};

