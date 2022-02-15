import {vh, vw} from './util/browser.js';
import {meanOffset, round, standardDeviation} from './util/math.js';
import {stripIndent} from 'common-tags';
import {Item} from '../other_modules/linked-list.js';

const createPos = ({
  x = 0,
  y = 0
} = {}) => ({
  x,
  y
});

const posEqual = (pos1, pos2) => pos1.x === pos2.x && pos1.y === pos2.y;

const posLowerThanOrEqual = (pos1, pos2) => {
  return pos1.x <= pos2.x && pos1.y <= pos2.y;
};

const posSubtract = (pos1, pos2) => createPos({
  x: pos1.x - pos2.x, y: pos1.y - pos2.y
});

const createTimedPosItem = ({timestamp, pos}) => {
  const it = new Item()
  it.timestamp = timestamp;
  it.pos = pos;
  return it;
}

const createEllipse = ({center, radius}) => ({center, radius});

const isInCircle = ({ellipse, pos}) => ((
  (Math.pow(pos.x - ellipse.center.x, 2) / Math.pow(ellipse.radius.x, 2)) +
  (Math.pow(pos.y - ellipse.center.y, 2) / Math.pow(ellipse.radius.y, 2))
) <= 1);

const createFixation = ({center, duration}) => ({center, duration});

const gazeAtTargetAccuracy = ({
  targetPos,
  gazeEstimations
}) => createPos({
  x: meanOffset(targetPos.x, gazeEstimations.map(pos => pos.x)),
  y: meanOffset(targetPos.y, gazeEstimations.map(pos => pos.y))
});

const gazePrecision = gazeEstimations => createPos({
  x: standardDeviation(gazeEstimations.map(pos => pos.x)), 
  y: standardDeviation(gazeEstimations.map(pos => pos.y))
});

const recommendedGazeTargetSize = ({
  accuracy,
  precision,
  sigmaFactor = 2
}) => createPos({
  x: gazeTargetLength({
    accuracy: accuracy.x, precision: precision.x, sigmaFactor
  }),
  y: gazeTargetLength({
    accuracy: accuracy.y, precision: precision.y, sigmaFactor
  })
});

/*
 * According to: Toward Everyday Gaze Input: Accuracy and Precision of
 * Eye Tracking and Implications for Design, by Feit, et. al. (2017)
 */
const gazeTargetLength = ({
  accuracy,
  precision,
  sigmaFactor = 2
}) => Math.round(2 * (accuracy + sigmaFactor * precision));

const relativePos = ({pos, viewportPos}) => {
  const roundThreeDigitsAfterComma = num => round({num, digitsAfterComma: 3});
  return createPos({
    x: roundThreeDigitsAfterComma(pos.x / viewportPos.x),
    y: roundThreeDigitsAfterComma(pos.y / viewportPos.y)
  });
};

const createGazeAtTargetData = ({
  targetPos,
  gazeEstimations
}) => ({
  targetPos,
  gazeEstimations,
  viewport: createPos({x: vw(), y: vh()})
});

const createDetailedInformationGazeAtTargetData = (gazeAtTargetData) => {
  const viewportPos = gazeAtTargetData.viewport;
  const targetPos = gazeAtTargetData.targetPos;
  const gazeEstimations = gazeAtTargetData.gazeEstimations;
  const accuracy = gazeAtTargetAccuracy({targetPos, gazeEstimations});
  const precision = gazePrecision(gazeEstimations);
  const recommendedTargetSize = recommendedGazeTargetSize({accuracy, precision});

  return {
    targetPos: gazeAtTargetData.targetPos,
    gazeEstimations: gazeAtTargetData.gazeEstimations,
    targetPosRelative: relativePos({pos: targetPos, viewportPos}),
    accuracy,
    accuracyRelative: relativePos({pos: accuracy, viewportPos}),
    precision,
    precisionRelative: relativePos({pos: precision, viewportPos}),
    recommendedTargetSize,
    recommendedTargetSizeRelative: relativePos({
      pos: recommendedTargetSize,
      viewportPos
    }),
    viewport: viewportPos
  }
};

export {createPos, createFixation, createGazeAtTargetData,
  createDetailedInformationGazeAtTargetData, createTimedPosItem,
  posLowerThanOrEqual, posSubtract
};

