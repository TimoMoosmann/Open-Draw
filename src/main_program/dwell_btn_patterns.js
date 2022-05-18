import { checkDwellBtn, checkEquallySizedDwellBtns, checkIdxInBounds, checkUnsignedInteger, createDwellBtnFromDwellBtnAndCenter, createPos, posEqual } from '../data_types.js';
import { checkAddArgNameToErrMsg } from '../util/error_handling.js';

const arrangeEquallySizedDwellBtnsToParallelMenu = ({
  distToNeighbor,
  endIdx = false,
  equallySizedDwellBtns,
  minDistToEdge,
  getNextBtn,
  getPrevBtn,
  startIdx = 0,
  viewport
}) => {
  checkEquallySizedDwellBtns(equallySizedDwellBtns, 'equallySizedDwellBtns');

  const checkDwellBtnCorrectSized = (dwellBtn, argName) => {
    if (!posEqual(
      equallySizedDwellBtns[0].ellipse.radii, dwellBtn.ellipse.radii
    )) {
      throw new TypeError(argName + ': Not sized like equallySizedDwellBtns.');
    }
  };

  if (startIdx) {
    checkUnsignedInteger(startIdx, 'startIdx');
    checkIdxInBounds(startIdx, equallySizedDwellBtns, 'startIdx');
    endIdx = false;
  }
  if (endIdx) {
    checkUnsignedInteger(endIdx, 'endIdx');
    checkIdxInBounds(endIdx, equallySizedDwellBtns, 'endIdx');
    startIdx = false;
  }

  if (getNextBtn && !(typeof(getNextBtn) === 'function')) {
    throw new TypeError('getNextBtn: Needs to be a callback function.');
  }
  if (getPrevBtn && !(typeof(getPrevBtn) === 'function')) {
    throw new TypeError('getPrevBtn: Needs to be a callback function.');
  }

  const btnRadii = equallySizedDwellBtns[0].ellipse.radii;

  const availableXs = getAvailableCoordsPerAxis({
    axisBtnRadii: btnRadii.x,
    axisDistToNeighbor: distToNeighbor.x,
    axisMinDistToEdge: minDistToEdge.x,
    axisViewport: viewport.x
  });

  const availableYs = getAvailableCoordsPerAxis({
    axisBtnRadii: btnRadii.y,
    axisDistToNeighbor: distToNeighbor.y,
    axisMinDistToEdge: minDistToEdge.y,
    axisViewport: viewport.y
  })

  const availablePositions = [];
  for (const y of availableYs) {
    for (const x of availableXs) {
      availablePositions.push(createPos({x, y}));
    }
  }

  let numFreePositions = availablePositions.length;
  let hasNextBtn = false;
  let hasPrevBtn = false;

  if (Number.isInteger(startIdx)) {
    if ( startIdx > 0 && getPrevBtn ) {
      hasPrevBtn = true;
      numFreePositions--;
    }
    if (
      startIdx + numFreePositions < equallySizedDwellBtns.length &&
      getNextBtn
    ) {
      hasNextBtn = true;
      numFreePositions--;
    }
    endIdx = startIdx + numFreePositions - 1;
    if (endIdx >= equallySizedDwellBtns.length) {
      endIdx = equallySizedDwellBtns.length - 1;
    }
  }
  else if (Number.isInteger(endIdx)) {
    if ( endIdx < equallySizedDwellBtns.length - 1 && getNextBtn ) {
      hasNextBtn = true;
      numFreePositions--;
    }
    if (endIdx - numFreePositions > 0 && getPrevBtn) {
      hasPrevBtn = true;
      numFreePositions--;
    }
    startIdx = endIdx - numFreePositions + 1;
    if (startIdx < 0) startIdx = 0;
  }

  const arrangedDwellBtns = [];
  let availablePositionsIdx = 0;

  if (hasPrevBtn) {
    const prevBtn = getPrevBtn(startIdx - 1);
    checkDwellBtn(prevBtn, 'getPrevBtn return');
    checkDwellBtnCorrectSized(prevBtn, 'getPrevBtn return');
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      prevBtn,
      availablePositions[0]
    ));
    availablePositionsIdx++;
  }

  for (let menuBtnIdx = startIdx; menuBtnIdx <= endIdx; menuBtnIdx++) {
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      equallySizedDwellBtns[menuBtnIdx],
      availablePositions[availablePositionsIdx],
    ));
    availablePositionsIdx++;
  }
  
  if (hasNextBtn) {
    const nextBtn = getNextBtn(endIdx + 1);
    checkDwellBtn(nextBtn, 'getNextBtn return');
    checkDwellBtnCorrectSized(nextBtn, 'getNextBtn return');
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      nextBtn,
      availablePositions[availablePositions.length - 1]
    ));
  }

  return {arrangedDwellBtns, hasNextBtn, hasPrevBtn};
};

const getAvailableCoordsPerAxis = ({
  axisBtnRadii, axisDistToNeighbor, axisMinDistToEdge, axisViewport
}) => {
  let current = axisMinDistToEdge + axisBtnRadii;
  const available = []
  while ((current + axisBtnRadii) <= axisViewport - axisMinDistToEdge) {
    available.push(current);
    current += (2 * axisBtnRadii) + axisDistToNeighbor;
  }
  // Now center the given values
  const distFromLastToEdge =
    axisViewport - (available[available.length -1] + axisBtnRadii);
  const shiftValue = (distFromLastToEdge - axisMinDistToEdge)  / 2;
  const availableCentered = available.map(el => el + shiftValue);
  return availableCentered;
};

export { arrangeEquallySizedDwellBtnsToParallelMenu };
