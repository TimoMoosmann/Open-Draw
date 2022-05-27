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

function checkPos (pos, argName) {
  if (!(
    Object.prototype.hasOwnProperty.call(pos, 'x') &&
    Object.prototype.hasOwnProperty.call(pos, 'y')
  )) {
    throw new TypeError(argName + ': Invalid pos.')
  }
}

function checkNumericPos (pos, argName) {
  checkPos(pos, argName)
  if (isNaN(pos.x) || isNaN(pos.y)) {
    throw new TypeError(argName + ': Invalid numericPos.')
  }
}

function checkPositiveNumericPos (pos, argName) {
  checkNumericPos(pos, argName)
  if (pos.x <= 0 || pos.y <= 0) {
    throw new TypeError(argName + ': Invalid positiveNumericPos.')
  }
}

function dividePositions (numeratorPos, denominatorPos) {
  return createPos({
    x: numeratorPos.x / denominatorPos.x,
    y: numeratorPos.y / denominatorPos.y
  })
}

function scalePos (pos, scaleFactor) {
  return createPos({
    x: pos.x * scaleFactor,
    y: pos.y * scaleFactor
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

export {
  checkNumericPos,
  checkPos,
  checkPositiveNumericPos,
  createPos,
  dividePositions,
  isPosEqual,
  isPosLowerThanOrEqual,
  scalePos,
  subPositions
}
