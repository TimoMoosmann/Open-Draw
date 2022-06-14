/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { activateBtnsOnDwell, createBucketItem } from 'Src/main_program/dwell_detection/dwell_at_btn_detection.js'

function activateBtnsOnDwellTestSettings (btns, buckets, timedGazePoint1, id) {
  return activateBtnsOnDwell(btns, buckets, timedGazePoint1, id, () => {})
}

test('Simplified typical gaze routine', (done) => {
  let timesLeftBtnTriggered = 0
  let timesRightBtnTriggered = 0
  let id = 0
  const createStandardDwellBtn = ({ action, center, domId }) => createDwellBtn({
    action,
    center,
    domId,
    size: createPos({ x: 200, y: 200 }),
    activationTime: 500
  })
  const dwellBtnLeft = createStandardDwellBtn({
    action: () => timesLeftBtnTriggered++,
    center: createPos({ x: 200, y: 200 }),
    domId: 'btnLeft'
  })
  const dwellBtnRight = createStandardDwellBtn({
    action: () => timesRightBtnTriggered++,
    center: createPos({ x: 800, y: 200 }),
    domId: 'btnRight'
  })
  const btns = [dwellBtnLeft, dwellBtnRight]
  const buckets = [[], []]

  // Gaze at left button
  const timedGazePoint1 = createTimedGazePoint({
    pos: createPos({ x: 101, y: 200 }),
    time: 1000
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint1, id)
  expect(buckets).toEqual([[createBucketItem({ id: 0, time: 1000 })], []])

  // Gaze at right button
  id++
  const timedGazePoint2 = createTimedGazePoint({
    pos: createPos({ x: 899, y: 200 }),
    time: 1200
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint2, id)
  expect(buckets).toEqual([[], [createBucketItem({ id: 1, time: 1200 })]])

  // Gaze at right button again, and long time since last gaze
  expect(timesRightBtnTriggered).toBe(0)
  id++
  const timedGazePoint3 = createTimedGazePoint({
    pos: createPos({ x: 800, y: 299 }),
    time: 1700
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint3, id)
  // After activation bucket list should be empty again.
  expect(buckets).toEqual([[], []])
  expect(timesRightBtnTriggered).toBe(1)

  // Another Gaze at right button
  id++
  const timedGazePoint4 = createTimedGazePoint({
    pos: createPos({ x: 800, y: 101 }),
    time: 2000
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint4, id)
  expect(buckets).toEqual([[], [createBucketItem({ id: 3, time: 2000 })]])

  // Gaze at no button
  id++
  const timedGazePoint5 = createTimedGazePoint({
    pos: createPos({ x: 901, y: 200 }),
    time: 2200
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint5, id)
  expect(buckets).toEqual([[], []])

  expect(timesLeftBtnTriggered).toBe(0)
  expect(timesRightBtnTriggered).toBe(1)

  setTimeout(() => done(), 200)
})
