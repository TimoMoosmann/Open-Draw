import {vh, vw} from './util/browser.js';
import {meanOffset, round, standardDeviation} from './util/math.js';
import {stripIndent} from 'common-tags';
import {Item} from '../other_modules/linked-list.js';

// Pos
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

// Timed Pos
const createTimedPosItem = ({timestamp, pos}) => {
  const it = new Item()
  it.timestamp = timestamp;
  it.pos = pos;
  return it;
};

// Line
const createLine = ({startPoint, endPoint, properties}) => ({
  startPoint,
  endPoint,
  properties
});

// Stroke Properties
const createStrokeProperties = ({color, lineWidth}) => ({color, lineWidth});

// Dot Colors
const createDrawStateGazeDotColors = ({drawing, looking}) => ({drawing, looking});

// Ellipse
const createEllipse = ({center, radii}) => ({center, radii});

const inEllipse = ({ellipse, pos}) => ((
  (Math.pow(pos.x - ellipse.center.x, 2) / Math.pow(ellipse.radii.x, 2)) +
  (Math.pow(pos.y - ellipse.center.y, 2) / Math.pow(ellipse.radii.y, 2))
) <= 1);

// Fixation
const createFixation = ({center, duration}) => ({center, duration});

// Simple Gaze at Target Data
const createGazeAtTargetData = ({
  targetPos,
  gazeEstimations
}) => ({
  targetPos,
  gazeEstimations,
  viewport: createPos({x: vw(), y: vh()})
});

// Detailed Gaze at Target Data
const createDetailedInformationGazeAtTargetData = (gazeAtTargetData) => {
  const viewportPos = gazeAtTargetData.viewport;
  const targetPos = gazeAtTargetData.targetPos;
  const targetPosRelative = relativePos({pos: targetPos, viewportPos});
  const gazeEstimations = gazeAtTargetData.gazeEstimations;
  const accuracy = gazeAtTargetAccuracy({targetPos, gazeEstimations});
  const precision = gazePrecision(gazeEstimations);
  const minTargetSize = getMinGazeTargetSize({accuracy, precision});
  const recommendedFixationSize = getRecommendedFixationSize(precision);

  return {
    targetPos: gazeAtTargetData.targetPos,
    gazeEstimations: gazeAtTargetData.gazeEstimations,
    targetPosRelative: targetPosRelative,
    targetPosName: getRelativeTargetPosName(targetPosRelative),
    accuracy,
    accuracyRelative: relativePos({pos: accuracy, viewportPos}),
    minTargetSize,
    minTargetSizeRelative: relativePos({
      pos: recommendedTargetSize,
      viewportPos
    }),
    precision,
    precisionRelative: relativePos({pos: precision, viewportPos}),
    recommendedFixationSize,
    recommendedFixationSizeRelative: relativePos({
      pos: recommendedFixationSize,
      viewportPos
    }),
    viewport: viewportPos
  }
};

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

const getMinGazeTargetSize = accuracy => createPos({
  x: 2 * accuracy.x,
  y: 2 * accuracy.y
});

const getRecommendedFixationSize = precision => {
  /*
   * Precision is the standard deviation, so we know that about 95% of the
   * gaze points lie within a dispersion of 2 times the precision, if the
   * gaze points are normaly distributed;
   * Choose a higher factot if a higher success rate than 95% is necassary.
   */
  const distributionFactor = 2;
  return createPos({
    x: distributionFactor * precision.x,
    y: distributionFactor * precision.y
});
};

const relativePos = ({pos, viewportPos}) => {
  const roundThreeDigitsAfterComma = num => round({num, digitsAfterComma: 3});
  return createPos({
    x: roundThreeDigitsAfterComma(pos.x / viewportPos.x),
    y: roundThreeDigitsAfterComma(pos.y / viewportPos.y)
  });
};

// Works only for if validation is done with 5 targets (which is standard).
const getRelativeTargetPosName = relTargetPos => {
  const isCenter = num => num > 49 && num < 51;
  const isLower = num => num <= 49;
  let name = '';

  if (isCenter(relTargetPos.y)) {
    name += 'center ';
  } else if (isLower(relTargetPos.y)) {
    name += 'upper ';
  } else {
    name += 'lower ';
  }

  if (isCenter(relTargetPos.x)) {
    name += 'center';
  } else if (isLower(relTargetPos.x)) {
    name += 'left';
  } else {
    name += 'right';
  }
};

export {
  createDetailedInformationGazeAtTargetData, createDrawStateGazeDotColors,
  createEllipse, createFixation, createGazeAtTargetData, createLine, createPos,
  createStrokeProperties, createTimedPosItem, inEllipse, posLowerThanOrEqual,
  posSubtract
};

