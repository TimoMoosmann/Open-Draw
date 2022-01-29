import {vh, vw} from './util/browser.js';
import {meanOffset, round, standardDeviation} from './util/math.js';
import {stripIndent} from 'common-tags';

const createPos = ({
  x = 0,
  y = 0
} = {}) => ({
  x,
  y,

  toString() {
    return `(${this.x}|${this.y})`;
  }
});

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

const relativePos = ({pos, viewPortPos}) => {
  const roundThreeDigitsAfterComma = num => round({num, digitsAfterComma: 3});
  return createPos({
    x: roundThreeDigitsAfterComma(pos.x / viewPortPos.x),
    y: roundThreeDigitsAfterComma(pos.y / viewPortPos.y)
  });
};

const createGazeAtTargetData = ({
  targetPos,
  gazeEstimations
}) => ({
  targetPos,
  gazeEstimations,
  viewPort: createPos({x: vw(), y: vh()})
});

const createDetailedInformationGazeAtTargetData = (gazeAtTargetData) => {
  const viewPortPos = gazeAtTargetData.viewPort;
  const targetPos = gazeAtTargetData.targetPos;
  const gazeEstimations = gazeAtTargetData.gazeEstimations;
  const accuracy = gazeAtTargetAccuracy({targetPos, gazeEstimations});
  const precision = gazePrecision(gazeEstimations);
  const recommendedTargetSize = recommendedGazeTargetSize({accuracy, precision});

  return {
    targetPos: gazeAtTargetData.targetPos,
    gazeEstimations: gazeAtTargetData.gazeEstimations,
    targetPosRelative: relativePos({pos: targetPos, viewPortPos}),
    accuracy,
    accuracyRelative: relativePos({pos: accuracy, viewPortPos}),
    precision,
    precisionRelative: relativePos({pos: precision, viewPortPos}),
    recommendedTargetSize,
    recommendedTargetSizeRelative: relativePos({
      pos: recommendedTargetSize,
      viewPortPos
    }),
    viewPort: viewPortPos
  }
};

export {createPos, createGazeAtTargetData,
  createDetailedInformationGazeAtTargetData
};

