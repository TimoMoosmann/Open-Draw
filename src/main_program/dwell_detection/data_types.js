import { isPos } from 'Src/data_types/pos.js'

function createTimedGazePoint ({ pos, time }) {
  isTimedGazePoint(arguments[0])
  return { pos, time }
}

function isTimedGazePoint (timedGazePoint) {
  const { pos, time } = timedGazePoint
  return isPos(pos) && typeof(time) === 'number'
}

function checkTimedGazePoint (timedGazePoint, argName) {
  if (!timedGazePoint || !isTimedGazePoint(timedGazePoint)) {
    throw new TypeError(argName + ': Invalid TimedGazePoint.')
  }
}

export {
  checkTimedGazePoint,
  createTimedGazePoint
}
