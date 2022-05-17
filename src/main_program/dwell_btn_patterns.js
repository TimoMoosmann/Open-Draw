import { checkDwellBtn, checkEquallySizedDwellBtns, createDwellBtnFromDwellBtnAndCenter, createPos, posEqual } from '../data_types.js';
import { checkAddArgNameToErrMsg } from '../util/error_handling.js';

const arrangeEquallySizedDwellBtnsToParallelMenu = ({
  distToNeighbor,
  equallySizedDwellBtns,
  minDistToEdge,
  nextBtn,
  prevBtn,
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

  if (nextBtn) {
    checkDwellBtn(nextBtn, 'nextBtn') 
    checkDwellBtnCorrectSized(nextBtn, 'nextBtn');
  }
  if (prevBtn) {
    checkDwellBtn(prevBtn, 'prevBtn');
    checkDwellBtnCorrectSized(prevBtn, 'prevBtn');
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

  const arrangedDwellBtns = [];
  const numAvailableDwellBtns = equallySizedDwellBtns.length - startIdx;
  let lastArrangedBtnIdx = startIdx -1;

  for (
    let positionsIdx = 0;
    positionsIdx < availablePositions.length;
    positionsIdx++
  ) {
    let currDwellBtn = false;

    if (positionsIdx === 0 && prevBtn && startIdx > 0) {
      currDwellBtn = prevBtn;
    } else if (
      positionsIdx === availablePositions.length - 1 &&
      nextBtn &&
      // Checks if there are one or less dwell btns left
      // Because only when there is more than one dwell btn left a next btn
      // id needed.
      lastArrangedBtnIdx < equallySizedDwellBtns.length - 2
    ) {
      currDwellBtn = nextBtn;
    } else if (equallySizedDwellBtns.length > lastArrangedBtnIdx + 1) {
      currDwellBtn = equallySizedDwellBtns[++lastArrangedBtnIdx];
    }
    if (currDwellBtn) {
      const arrangedDwellBtn = createDwellBtnFromDwellBtnAndCenter(
        currDwellBtn,
        availablePositions[positionsIdx],
      );
      arrangedDwellBtns.push(arrangedDwellBtn);
    } else break;
  }

  return {arrangedDwellBtns, lastArrangedBtnIdx};
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
