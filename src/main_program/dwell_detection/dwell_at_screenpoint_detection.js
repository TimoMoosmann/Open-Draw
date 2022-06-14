import {
  createPos, getMaxXAndY, getMinXAndY, isPosLowerThanOrEqual, subPositions
} from 'Src/data_types/pos.js'
import { getCenterPoint } from 'Src/main_program/dwell_detection/util.js'

import { Item, List } from 'OtherModules/linked-list.js'

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
  let maxPos = createPos(timedGazePositions.tail.pos)
  let minPos = createPos(timedGazePositions.tail.pos)
  let itemsFitInDispersionThreshold = false
  let prevItem = timedGazePositions.tail
  let currentItem = timedGazePositions.tail.prev
  while (
    (itemsFitInDispersionThreshold = fitsInDispersionThreshold({
      maxPos, minPos, dispersionThreshold
    })) && currentItem) {
    maxPos = getMaxXAndY(maxPos, currentItem.pos)
    minPos = getMinXAndY(minPos, currentItem.pos)
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

function removeFromElToHead (el) {
  if (el.prev !== null) removeFromElToHead(el.prev)
  el.detach()
}

function createFixation ({ center, duration }) {
  return { center, duration }
}

function createTimedPosItem ({ timestamp, pos }) {
  const it = new Item()
  it.timestamp = timestamp
  it.pos = pos
  return it
}

export {
  createFixation,
  createTimedPosItem,
  idtOneIteration,
  runWebgazerFixationDetection
}