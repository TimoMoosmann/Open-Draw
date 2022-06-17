import {
  checkDwellBtn, createDwellBtnFromDwellBtnAndCenter
} from 'Src/main_program/data_types/dwell_btn.js'
import { checkEquallySizedDwellBtns } from 'Src/main_program/data_types/equally_sized_dwell_btns.js'
import { checkIdxInBounds } from 'Src/data_types/array.js'
import {
  addPositions, checkPositiveNumericPos, createPos, isPosEqual, subPositions
} from 'Src/data_types/pos.js'
import { checkUnsignedInteger } from 'Src/data_types/numbers.js'
import { getViewport } from 'Src/util/browser.js'
import { getMinDistToEdgeFromSettings, getSmallDistToNeighborTarget } from 'Src/main_program/util.js'

function arrangeEquallySizedDwellBtnsToParallelMenu ({
  distToNeighbor = getSmallDistToNeighborTarget(),
  endIdx = false,
  equallySizedDwellBtns,
  minDistToEdge = getMinDistToEdgeFromSettings(),
  getNextBtn,
  getPrevBtn,
  startIdx = 0,
  viewport = getViewport()
}) {
  checkEquallySizedDwellBtns(equallySizedDwellBtns, 'equallySizedDwellBtns')
  checkPositiveNumericPos(distToNeighbor, 'distToNeighbor')
  checkPositiveNumericPos(minDistToEdge, 'minDistToEdge')
  checkPositiveNumericPos(viewport, 'viewport')

  const checkDwellBtnCorrectSized = (dwellBtn, argName) => {
    if (!isPosEqual(
      equallySizedDwellBtns[0].ellipse.radii, dwellBtn.ellipse.radii
    )) {
      throw new TypeError(argName + ': Not sized like equallySizedDwellBtns.')
    }
  }

  if (startIdx) {
    checkUnsignedInteger(startIdx, 'startIdx')
    checkIdxInBounds(startIdx, equallySizedDwellBtns, 'startIdx')
    endIdx = false
  }
  if (endIdx) {
    checkUnsignedInteger(endIdx, 'endIdx')
    checkIdxInBounds(endIdx, equallySizedDwellBtns, 'endIdx')
    startIdx = false
  }

  if (getNextBtn && !(typeof (getNextBtn) === 'function')) {
    throw new TypeError('getNextBtn: Needs to be a callback function.')
  }
  if (getPrevBtn && !(typeof (getPrevBtn) === 'function')) {
    throw new TypeError('getPrevBtn: Needs to be a callback function.')
  }

  const btnRadii = equallySizedDwellBtns[0].ellipse.radii

  const availableXs = getAvailableCoordsPerAxis({
    axisBtnRadii: btnRadii.x,
    axisDistToNeighbor: distToNeighbor.x,
    axisMinDistToEdge: minDistToEdge.x,
    axisViewport: viewport.x
  })

  const availableYs = getAvailableCoordsPerAxis({
    axisBtnRadii: btnRadii.y,
    axisDistToNeighbor: distToNeighbor.y,
    axisMinDistToEdge: minDistToEdge.y,
    axisViewport: viewport.y
  })

  const availablePositions = []
  for (const y of availableYs) {
    for (const x of availableXs) {
      availablePositions.push(createPos({ x, y }))
    }
  }

  let numFreePositions = availablePositions.length

  let hasNextBtn = false
  let hasPrevBtn = false

  if (Number.isInteger(startIdx)) {
    if (
      startIdx > 0 &&
      numFreePositions > 0 &&
      getPrevBtn
    ) {
      hasPrevBtn = true
      numFreePositions--
    }
    if (
      startIdx + numFreePositions < equallySizedDwellBtns.length &&
      numFreePositions > 0 &&
      getNextBtn
    ) {
      hasNextBtn = true
      numFreePositions--
    }
    endIdx = startIdx + numFreePositions - 1
    if (endIdx >= equallySizedDwellBtns.length) {
      endIdx = equallySizedDwellBtns.length - 1
    }
  } else if (Number.isInteger(endIdx)) {
    if (
      endIdx < equallySizedDwellBtns.length - 1 &&
      numFreePositions > 0 &&
      getNextBtn
    ) {
      hasNextBtn = true
      numFreePositions--
    }
    if (
      endIdx - numFreePositions > 0 &&
      numFreePositions > 0 &&
      getPrevBtn
    ) {
      hasPrevBtn = true
      numFreePositions--
    }
    startIdx = endIdx - numFreePositions + 1
    if (startIdx < 0) startIdx = 0
  }

  const arrangedDwellBtns = []
  let availablePositionsIdx = 0

  if (hasPrevBtn) {
    const prevBtn = getPrevBtn(startIdx - 1)
    checkDwellBtn(prevBtn, 'getPrevBtn return')
    checkDwellBtnCorrectSized(prevBtn, 'getPrevBtn return')
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      prevBtn,
      availablePositions[0]
    ))
    availablePositionsIdx++
  }

  for (let menuBtnIdx = startIdx; menuBtnIdx <= endIdx; menuBtnIdx++) {
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      equallySizedDwellBtns[menuBtnIdx],
      availablePositions[availablePositionsIdx]
    ))
    availablePositionsIdx++
  }

  if (hasNextBtn) {
    const nextBtn = getNextBtn(endIdx + 1)
    checkDwellBtn(nextBtn, 'getNextBtn return')
    checkDwellBtnCorrectSized(nextBtn, 'getNextBtn return')
    arrangedDwellBtns.push(createDwellBtnFromDwellBtnAndCenter(
      nextBtn,
      availablePositions[availablePositions.length - 1]
    ))
  }

  return arrangedDwellBtns
}

function getAvailableCoordsPerAxis ({
  axisBtnRadii, axisDistToNeighbor, axisMinDistToEdge, axisViewport
}) {
  let current = axisMinDistToEdge + axisBtnRadii
  const available = []
  while ((current + axisBtnRadii) <= axisViewport - axisMinDistToEdge) {
    available.push(current)
    current += (2 * axisBtnRadii) + axisDistToNeighbor
  }
  // Now center the given values
  const distFromLastToEdge =
    axisViewport - (available[available.length - 1] + axisBtnRadii)
  const shiftValue = (distFromLastToEdge - axisMinDistToEdge) / 2
  const availableCentered = available.map(el => el + shiftValue)
  return availableCentered
}

function arrangeOneBtnToLowerRight ({
  dwellBtn,
  minDistToEdge = getMinDistToEdgeFromSettings(),
  viewport = getViewport()
}) {
  checkDwellBtn(dwellBtn, 'dwellBtn')
  checkPositiveNumericPos(minDistToEdge, 'minDistToEdge')
  checkPositiveNumericPos(viewport, 'viewport')

  return createDwellBtnFromDwellBtnAndCenter(
    dwellBtn,
    subPositions(subPositions(viewport, minDistToEdge), dwellBtn.ellipse.radii)
  )
}

function arrangeTwoBtnsUpperLeftOneBtnLowerRight (btns, btnSize) {
  const upperLeftLeftPos = addPositions(
    getMinDistToEdgeFromSettings(), btns[0].ellipse.radii
  )
  const upperLeftPos = createPos({
    x: upperLeftLeftPos.x + getSmallDistToNeighborTarget(btnSize).x +
      btns[0].ellipse.radii.x + btns[1].ellipse.radii.x,
    y: upperLeftLeftPos.y
  })
  const lowerRightPos = subPositions(
    getViewport(), getMinDistToEdgeFromSettings(), btns[2].ellipse.radii
  )
  return [
    createDwellBtnFromDwellBtnAndCenter(
      btns[0], upperLeftLeftPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      btns[1], upperLeftPos
    ),
    createDwellBtnFromDwellBtnAndCenter(
      btns[2], lowerRightPos
    )
  ]
}

export {
  arrangeEquallySizedDwellBtnsToParallelMenu,
  arrangeOneBtnToLowerRight,
  arrangeTwoBtnsUpperLeftOneBtnLowerRight
}
