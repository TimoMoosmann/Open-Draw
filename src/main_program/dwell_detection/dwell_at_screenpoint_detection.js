import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types/timed_gaze_point.js'
import { createFixation } from 'Src/webgazer_extensions/fixation_detection/data_types/fixation.js'
import { createTimedPosItem } from 'Src/webgazer_extensions/fixation_detection/data_types/timed_pos_item.js'
import {
  createPos, getMaxXAndY, getMinXAndY, isPosLowerThanOrEqual, subPositions
} from 'Src/data_types/pos.js'
import { mean } from 'Src/util/math.js'

import { List } from 'OtherModules/linked-list.js'

function runWebgazerFixationDetection ({
  dispersionThreshold,
  durationThreshold,
  maxFixationDuration,
  onFixation,
  webgazer
}) {
  const timedGazePositions = new List()
  let lastDetectionWasAFixation = false

  webgazer.setGazeListener((gazePos, timestamp) => {
    if (!gazePos) return false

    timedGazePositions.append(createTimedPosItem({ timestamp, pos: gazePos }))

    const fixation = idtOneIteration({
      dispersionThreshold,
      durationThreshold,
      maxFixationDuration,
      timedGazePositions
    })
    if (fixation || lastDetectionWasAFixation) {
      onFixation(fixation)
    }
    if (fixation) lastDetectionWasAFixation = true
  })
}

function idtOneIteration ({
  dispersionThreshold,
  durationThreshold,
  maxFixationDuration,
  timedGazePositions
}) {
  if (maxFixationDuration) {
    fitTimedPositionsInMaxFixationDuration({
      maxFixationDuration, timedGazePositions
    })
  }
  if (timedGazePositions.size >= 2) {
    fitTimedPositionsInDispersionThreshold({
      dispersionThreshold, timedGazePositions
    })
    const windowFirstEl = timedGazePositions.head
    const windowLastEl = (timedGazePositions.size === 1)
      ? timedGazePositions.head
      : timedGazePositions.tail
    let fixationDuration
    if (
      (fixationDuration = windowLastEl.timestamp - windowFirstEl.timestamp) >=
      durationThreshold
    ) {
      const fixationCenter = getCenterPoint(
        timedGazePositions.toArray().map(it => it.pos)
      )
      return createFixation({
        center: fixationCenter,
        duration: fixationDuration
      })
    }
  }
  return false
}

function dwellDetectTest (app) {
  app.webgazer.showPredictionPoints(true)
  runDwellDetection({
    dispersionThreshold: app.dispersionThreshold,
    dwellDurationThreshold: 1000,
    onDwell: dwellPoint => window.alert(JSON.stringify(dwellPoint)),
    webgazer: app.webgazer
  })
}

function runDwellDetection ({
  dispersionThreshold,
  dwellDurationThreshold,
  onDwell,
  webgazer
}) {
  const timedGazePoints = []

  webgazer.setGazeListener((gazePoint, time) => {
    timedGazePoints.push(createTimedGazePoint({ pos: gazePoint, time }))

    const dwellPoint = getDwellPoint({
      dispersionThreshold,
      dwellDurationThreshold,
      timedGazePoints
    })
    if (dwellPoint) onDwell(dwellPoint)
  })
}

// Based on IDT algorithm
function getDwellPoint ({
  dispersionThreshold,
  dwellDurationThreshold,
  timedGazePoints
}) {
  while (
    gazePointsCoverDurationThreshold(
      timedGazePoints, dwellDurationThreshold
    )
  ) {
    if (
      gazePointsFitInDispersionThreshold(
        timedGazePoints.map(it => it.pos), dispersionThreshold
      )
    ) {
      const dwellPoint = getCenterPoint(timedGazePoints.map(
        timedGazePoint => timedGazePoint.pos)
      )
      timedGazePoints.length = 0
      return dwellPoint
    } else {
      timedGazePoints.shift()
    }
  }
  return false
}

function gazePointsCoverDurationThreshold (gazePoints, durationThreshold) {
  if (gazePoints.length > 1) {
    return (
      gazePoints[gazePoints.length - 1].time - gazePoints[0].time >=
      durationThreshold
    )
  }
  return false
}

function gazePointsFitInDispersionThreshold (gazePoints, dispersionThreshold) {
  if (gazePoints.length < 2) {
    throw new TypeError('Need at least to gazePoints to calculate dispersion')
  }
  let minPoint = gazePoints[0]
  let maxPoint = gazePoints[0]
  for (let i = 1; i < gazePoints.length; i++) {
    minPoint = getMinXAndY(minPoint, gazePoints[i])
    maxPoint = getMaxXAndY(maxPoint, gazePoints[i])
  }
  console.log(subPositions(maxPoint, minPoint))
  return isPosLowerThanOrEqual(
    subPositions(maxPoint, minPoint),
    dispersionThreshold
  )
}

function fitTimedPositionsInMaxFixationDuration ({
  maxFixationDuration, timedGazePositions
}) {
  let currentTimedPos = (timedGazePositions.size > 1)
    ? timedGazePositions.tail.prev
    : false
  while (currentTimedPos) {
    if (
      (timedGazePositions.tail.timestamp - currentTimedPos.timestamp) >
      maxFixationDuration
    ) {
      removeFromElToHead(currentTimedPos)
      break
    }
    currentTimedPos = currentTimedPos.prev
  }
}

function fitTimedPositionsInDispersionThreshold ({
  dispersionThreshold, timedGazePositions
}) {
  const maxPos = createPos(timedGazePositions.tail.pos)
  const minPos = createPos(timedGazePositions.tail.pos)
  let itemsFitInDispersionThreshold = false
  let prevItem = timedGazePositions.tail
  let currentItem = timedGazePositions.tail.prev
  while (
    (itemsFitInDispersionThreshold = fitsInDispersionThreshold({
      maxPos, minPos, dispersionThreshold
    })) && currentItem) {
    updateMax({ maxPos, updatePos: currentItem.pos })
    updateMin({ minPos, updatePos: currentItem.pos })
    prevItem = currentItem
    currentItem = currentItem.prev
  }
  if (!itemsFitInDispersionThreshold) {
    removeFromElToHead(prevItem)
  }
  return timedGazePositions
}

function fitsInDispersionThreshold ({ maxPos, minPos, dispersionThreshold }) {
  return isPosLowerThanOrEqual(
    subPositions(maxPos, minPos), dispersionThreshold
  )
}

function updateMax ({ maxPos, updatePos }) {
  maxPos.x = Math.max(maxPos.x, updatePos.x)
  maxPos.y = Math.max(maxPos.y, updatePos.y)
}

function updateMin ({ minPos, updatePos }) {
  minPos.x = Math.min(minPos.x, updatePos.x)
  minPos.y = Math.min(minPos.y, updatePos.y)
}

function removeFromElToHead (el) {
  if (el.prev !== null) removeFromElToHead(el.prev)
  el.detach()
}

function getCenterPoint (posArr) {
  return createPos({
    x: Math.round(mean(posArr.map(pos => pos.x))),
    y: Math.round(mean(posArr.map(pos => pos.y)))
  })
}

export {
  dwellDetectTest,
  idtOneIteration,
  runWebgazerFixationDetection
}
