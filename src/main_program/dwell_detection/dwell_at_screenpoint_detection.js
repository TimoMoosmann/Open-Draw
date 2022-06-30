import {
  createPos, getMaxXAndY, getMinXAndY, isPosLowerThanOrEqual, subPositions
} from 'Src/data_types/pos.js'
import { getCenterPoint, getTimeSpan } from 'Src/main_program/dwell_detection/util.js'
import { addScreenPointListener } from 'Src/util/main.js'

import { Item, List } from 'OtherModules/linked-list.js'

function runWebgazerFixationDetection ({
  app,
  dispersionThreshold,
  durationThreshold = 300,
  maxFixationDuration,
  onFixation
}) {
  const timedGazePositions = new List()
  let lastDetectionWasAFixation = false

  addScreenPointListener(
    app.webgazer, app.mouseListeners, 'dwell_at_screenpoint',
    (gazePos, timestamp) => {
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
    }
  )
}

function idtOneIteration ({
  dispersionThreshold,
  durationThreshold,
  maxFixationDuration,
  timedGazePositions
}) {
  if (
    getTimeSpan(timedGazePositions.toArray().map(el => el.timestamp)) >
    maxFixationDuration
  ) {
    for (const timedGazePos of timedGazePositions) {
      timedGazePos.detach()
    }
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
