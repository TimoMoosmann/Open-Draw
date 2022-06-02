// Pos
function createPos ({
  x = 0,
  y = 0
} = {}) {
  return {
    x,
    y
  }
}

function isPos (pos) {
  return (
    pos &&
    Object.prototype.hasOwnProperty.call(pos, 'x') &&
    Object.prototype.hasOwnProperty.call(pos, 'y')
  )
}

function checkPos (pos, argName) {
  if (!isPos(pos)) {
    throw new TypeError(argName + ': Invalid Pos.')
  }
}

function isNumericPos (pos) {
  return isPos(pos) && !isNaN(pos.x) && !isNaN(pos.y)
}

function checkNumericPos (pos, argName) {
  if (!isNumericPos(pos)) {
    throw new TypeError(argName + ': Invalid NumericPos.')
  }
}

function checkPositiveNumericPos (pos, argName) {
  if (!isNumericPos(pos) || pos.x <= 0 || pos.y <= 0) {
    throw new TypeError(argName + ': Invalid PositiveNumericPos.')
  }
}

function dividePositions (numeratorPos, denominatorPos) {
  return createPos({
    x: numeratorPos.x / denominatorPos.x,
    y: numeratorPos.y / denominatorPos.y
  })
}

function scalePosByVal (pos, scaleFactor) {
  return createPos({
    x: pos.x * scaleFactor,
    y: pos.y * scaleFactor
  })
}

function scalePosByPos (pos1, pos2) {
  return createPos({
    x: pos1.x * pos2.x,
    y: pos1.y * pos2.y
  })
}

function subPositions (pos1, pos2) {
  return createPos({
    x: pos1.x - pos2.x, y: pos1.y - pos2.y
  })
}

function isPosEqual (pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function isPosLowerThanOrEqual (pos1, pos2) {
  return pos1.x <= pos2.x && pos1.y <= pos2.y
}

function getMinXAndY (pos1, pos2) {
  return createPos({
    x: pos1.x < pos2.x ? pos1.x : pos2.x,
    y: pos1.y < pos2.y ? pos1.y : pos2.y
  })
}

export {
  checkNumericPos,
  checkPos,
  checkPositiveNumericPos,
  createPos,
  dividePositions,
  getMinXAndY,
  isPosEqual,
  isPosLowerThanOrEqual,
  scalePosByPos,
  scalePosByVal,
  subPositions
}
