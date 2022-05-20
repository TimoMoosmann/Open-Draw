import {vh, vw} from './util/browser.js';
import {checkAddArgNameToErrMsg, checkSetErrMsg} from './util/error_handling.js';
import {meanOffset, round, calcSampleStandardDeviation} from './util/math.js';
import {stripIndent} from 'common-tags';
import {List, Item} from '../other_modules/linked-list.js';

import eyeIcon from '../assets/img/eye-scanner.png';

// Unsigned Integer
const checkUnsignedInteger = (val, argName) => {
  if (!Number.isInteger(val) || val < 0) {
    throw new TypeError(argName + ': Needs to be an unsigned Integer.');
  }
};

// Pos
const createPos = ({
  x = 0,
  y = 0
} = {}) => ({
  x,
  y
});

const checkPos = (pos, argName) => {
  if(!(pos.hasOwnProperty('x') && pos.hasOwnProperty('y'))) {
    throw new TypeError(argName + ': Invalid pos.');
  }
};

const checkNumericPos = (pos, argName) => {
  checkPos(pos, argName);
  if(isNaN(pos.x) || isNaN(pos.y)) {
    throw new TypeError(argName + ': Invalid numericPos.');
  }
};

const checkPositiveNumericPos = (pos, argName) => {
  checkNumericPos(pos, argName);
  if(pos.x <= 0 || pos.y <= 0) {
    throw argName + ': Invalid positiveNumericPos.';
  }
};

const multPos = (pos, mult) => createPos({
  x: pos.x * mult,
  y: pos.y * mult
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

// Arrays
const checkArray = (arr, argName) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(argName + ': Invalid Array given.');
  }
};

const checkNonEmptyArray = (array, argName) => {
  checkArray(array, argName);
  if (array.length === 0) {
    throw new TypeError(argName + ': Invalid NonEmptyArray given.');
  }
};

const checkNumbersArray = (numbers, argName) => {
  checkNonEmptyArray(numbers);
  for (let num of numbers) {
    if (isNaN(num)) {
      throw new TypeError(argName + ': Invalid NumbersArray given.');
    }
  }
};

const checkIdxInBounds = ( idx, array, argName ) => {
  if ( idx >= array.length ) {
    throw new TypeError(argName + ': Index out of bounds.');
  }
};

// Line
const createLine = ({startPoint, endPoint, strokeProperties}) => ({
  startPoint,
  endPoint,
  strokeProperties
});

// Stroke Properties
const createStrokeProperties = ({color, lineWidth}) => ({color, lineWidth});

// Dot Colors
const createDrawStateGazeDotColors = ({drawing, looking}) => ({drawing, looking});

// Ellipse
const createEllipse = ({center, radii}) => ({center, radii});

const checkEllipse = (ellipse, argName) => {
  checkNumericPos(ellipse.center, argName + '.center');
  checkPositiveNumericPos(ellipse.radii, argName + '.radii');
};

const inEllipse = ({ellipse, pos}) => ((
  (Math.pow(pos.x - ellipse.center.x, 2) / Math.pow(ellipse.radii.x, 2)) +
  (Math.pow(pos.y - ellipse.center.y, 2) / Math.pow(ellipse.radii.y, 2))
) <= 1);

const createDwellBtn = ({
  action = () => {},
  center= createPos({x: 0, y: 0}),
  domId,
  icon = eyeIcon,
  size,
  timeTillActivation = 1000,
  title = false
}) => ({
  action,
  ellipse: createEllipse({
    center,
    radii: createPos({x: size.x / 2, y: size.y / 2})
  }),
  domId,
  icon,
  timeTillActivation,
  title
});

const createDwellBtnFromDwellBtnAndCenter = (dwellBtn, center) => createDwellBtn({
  center,
  domId: dwellBtn.domId, 
  icon: dwellBtn.icon,
  size: multPos(dwellBtn.ellipse.radii, 2),
  timeTillActivation: dwellBtn.timeTillActivation,
  action: dwellBtn.action
});


const checkEquallySizedDwellBtns = (dwellBtns, argName) => {
    if (!Array.isArray(dwellBtns) || dwellBtns.length < 1) {
      throw new TypeError(
        argName +
        ': Object of type EquallySizedDwellBtns is an Array ' +
        'with at least one element.'
      );
    }
    let prevDwellBtnRadii = false;
    for (const dwellBtn of dwellBtns) {
      checkDwellBtn(dwellBtn, argName + ': DwellBtn');

      if (
        prevDwellBtnRadii !== false &&
        !posEqual(dwellBtn.ellipse.radii, prevDwellBtnRadii)
      ) {
        throw new TypeError(argName + ': DwellBtns are not sized equally.');
      }
      prevDwellBtnRadii = dwellBtn.ellipse.radii;
    }
  };

const checkDwellBtn = (dwellBtn, argName) => {
  const preText = argName + ': Illegal DwellBtn Object, ';
  const {ellipse, domId, icon, size, timeTillActivation, action} = dwellBtn;

  if (!(typeof(domId) === 'string')) {
    throw new TypeError(
      preText + 'domId needs to be a string.'
    );
  }
  if (!(typeof(icon) === 'string')) {
    throw new TypeError(preText + 'icon needs to be a string.');
  }
  if (!(Number.isInteger(timeTillActivation) && timeTillActivation > 0)) {
    throw new TypeError(
      preText +
      'timeTillActivation needs to be a number greater than 0.'
    );
  }
  if (!(typeof action === 'function')) {
    throw new TypeError(preText + 'action needs to be function.');
  }

  checkEllipse(ellipse, argName);
};

const createDwellBtnProgress = ({
  btnId = false,
  progressInPct = 0
}) => ({
  btnId,
  progressInPct
});


// Zoom
const createZoom = ({offsetFactorShiftAmount, zoomFactors}) => ({
  level: createZoomLevels(zoomFactors.map(zoomFactor => zoomFactor / 2)),
  canvasOffsetFactor: createPos({x: 0, y: 0}),
  offsetFactorShiftAmount
});

// Zoom Levels
// Use Halfs, because zoom Factors needs to be divisable by two
const createZoomLevels = zoomFactorHalfs => {
  if (zoomFactorHalfs[0] !== 0.5) {
    throw new Error('Initial Zoom Factor always needs to be 1.0');
  }
  const zoomLevels = new List();
  for (let zoomFactorHalf of zoomFactorHalfs) {
    let lastEl;
    if (zoomLevels.tail) lastEl = zoomLevels.tail;
    if (!lastEl && zoomLevels.head) lastEl = zoomLevels.head;
    if (lastEl && lastEl.factor / 2 >= zoomFactorHalf) {
      throw new Error(
        'Zoom Levels needs to be definded in an ascending order.'
      );
    }
    const zoomLevel = new Item();
    zoomLevel.factor = zoomFactorHalf * 2;
    zoomLevel.maxCanvasOffsetFactor = zoomFactorHalf * 2 - 1.0;
    zoomLevels.append(zoomLevel);
  }
  return zoomLevels.head;
};

// Fixation
const createFixation = ({center, duration}) => ({center, duration});

// Gaze at Target Data Raw Informations
const createGazeAtTargetData = ({
  targetPos,
  gazeEstimations,
  viewport = createPos({x: vw(), y: vh()})
}) => {
  const gazeAtTargetData = {
    targetPos,
    gazeEstimations,
    viewport
  };
  checkGazeAtTargetData(gazeAtTargetData);
  return gazeAtTargetData;
};

const checkValidTargetPosAndViewport = ({targetPos, viewport}) => {
  checkPositiveNumericPos(targetPos);
  checkPositiveNumericPos(viewport);
  if (targetPos.x >= viewport.x || targetPos.y >= viewport.y) {
    throw 'targetPos is outside the viewport.';
  };
}

const checkValidGazeEstimations = gazeEstimations => {
  if (!Array.isArray(gazeEstimations)) {
    throw 'Invalid gazeEstimations.';
  }
  for (let gazeEstimation of gazeEstimations) {
    checkNumericPos(gazeEstimation);
  }
  if (gazeEstimations.length < 2) {
    throw 'gazeEstimations needs at least two estimations to be valid.';
  }
};

const checkGazeAtTargetData = gazeAtTargetData => {
  const {targetPos, viewport, gazeEstimations} = gazeAtTargetData;
  if (
    targetPos === undefined ||
    viewport === undefined ||
    gazeEstimations === undefined
  ) {
    throw('Invalid GazeEstimations object given.');
  }
  checkValidTargetPosAndViewport({targetPos, viewport});
  checkValidGazeEstimations(gazeEstimations);
};

const checkValidationData = validationData => {
  if (!Array.isArray(validationData)) {
    throw 'ValidationData object needs to be an array.';
  }
  if (validationData.length < 1) {
    throw 'ValidationData object needs at least one element in it.';
  }
  for (let gazeAtTargetData of validationData) {
    checkGazeAtTargetData(gazeAtTargetData);
  }
};

const createEvaluatedGazeAtTargetData = gazeAtTargetData => {
  const targetPos = gazeAtTargetData.targetPos;
  const gazeEstimations = gazeAtTargetData.gazeEstimations;
  const viewportPos = gazeAtTargetData.viewport;
  return {
    relAcc: getRelativePos({
      pos: gazeAtTargetAccuracy({targetPos, gazeEstimations}),
      viewportPos
    }),
    relPrec: getRelativePos({
      pos: gazePrecision(gazeEstimations),
      viewportPos
    })
  }
};

// Detailed Gaze at Target Data
const createDetailedInformationGazeAtTargetData = (gazeAtTargetData) => {
  const viewportPos = gazeAtTargetData.viewport;
  const targetPos = gazeAtTargetData.targetPos;
  const targetPosRelative = getRelativePos({pos: targetPos, viewportPos});
  const gazeEstimations = gazeAtTargetData.gazeEstimations;
  const accuracy = gazeAtTargetAccuracy({targetPos, gazeEstimations});
  const precision = gazePrecision(gazeEstimations);
  const minTargetSize = getMinGazeTargetSize(accuracy);
  const recommendedFixationSize = getRecommendedFixationSize(precision);

  return {
    targetPos: gazeAtTargetData.targetPos,
    gazeEstimations: gazeAtTargetData.gazeEstimations,
    targetPosRelative,
    targetPosName: getRelativeTargetPosName(targetPosRelative),
    accuracy,
    accuracyRelative: getRelativePos({pos: accuracy, viewportPos}),
    minTargetSize,
    minTargetSizeRelative: getRelativePos({
      pos: minTargetSize,
      viewportPos
    }),
    precision,
    precisionRelative: getRelativePos({pos: precision, viewportPos}),
    recommendedFixationSize,
    recommendedFixationSizeRelative: getRelativePos({
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
  x: calcSampleStandardDeviation(gazeEstimations.map(pos => pos.x)), 
  y: calcSampleStandardDeviation(gazeEstimations.map(pos => pos.y))
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

const getRelativePos = ({pos, viewportPos}) => {
  const roundThreeDigitsAfterComma = num => round(num, 3);
  return createPos({
    x: roundThreeDigitsAfterComma(pos.x / viewportPos.x),
    y: roundThreeDigitsAfterComma(pos.y / viewportPos.y)
  });
};

// Works only for if validation is done with 5 targets (which is standard).
const getRelativeTargetPosName = targetPosRel => {
  const isCenter = num => num > 0.49 && num < 0.51;
  const isLower = num => num <= 0.49;
  let name = '';

  if (isCenter(targetPosRel.y)) {
    name += 'center ';
  } else if (isLower(targetPosRel.y)) {
    name += 'upper ';
  } else {
    name += 'lower ';
  }

  if (isCenter(targetPosRel.x)) {
    name += 'center';
  } else if (isLower(targetPosRel.x)) {
    name += 'left';
  } else {
    name += 'right';
  }
  return name;
};

export {
  checkDwellBtn,
  checkEquallySizedDwellBtns,
  checkGazeAtTargetData,
  checkIdxInBounds,
  checkNumbersArray,
  checkPositiveNumericPos,
  checkUnsignedInteger,
  checkValidationData,
  createDetailedInformationGazeAtTargetData,
  createDrawStateGazeDotColors,
  createDwellBtn,
  createDwellBtnFromDwellBtnAndCenter,
  createDwellBtnProgress,
  createEllipse,
  createEvaluatedGazeAtTargetData,
  createFixation,
  createGazeAtTargetData,
  createLine,
  createPos,
  createStrokeProperties,
  createTimedPosItem,
  createZoom,
  createZoomLevels,
  inEllipse,
  multPos,
  posEqual,
  posLowerThanOrEqual,
  posSubtract
};

