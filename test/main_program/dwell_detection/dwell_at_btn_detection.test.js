/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { activateBtnsOnDwell, createBucketListItem, createEmptyBucket } from 'Src/main_program/dwell_detection/dwell_at_btn_detection.js'

function activateBtnsOnDwellTestSettings (btns, buckets, timedGazePoint, id) {
  return activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint,
    id,
    shadeBtn: () => {}
  })
}

function createStandardDwellBtn ({
  action, levelTwoAction = false, center, domId
}) {
  return createDwellBtn({
    action,
    levelTwoAction,
    center,
    domId,
    size: createPos({ x: 200, y: 200 }),
    activationTime: 500
  })
}

test('Simplified typical gaze routine', (done) => {
  let timesLeftBtnTriggered = 0
  let timesRightBtnTriggered = 0
  let id = 0
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
  const buckets = [createEmptyBucket(), createEmptyBucket()]

  // Gaze at left button
  const timedGazePoint1 = createTimedGazePoint({
    pos: createPos({ x: 101, y: 200 }),
    time: 1000
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint1, id)
  expect(buckets).toEqual([
    {
      list: [createBucketListItem({ id: 0, time: 1000 })],
      levelOneActionTriggered: false
    },
    createEmptyBucket()
  ])

  // Gaze at right button
  id++
  const timedGazePoint2 = createTimedGazePoint({
    pos: createPos({ x: 899, y: 200 }),
    time: 1200
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint2, id)
  expect(buckets).toEqual([createEmptyBucket(), {
    list: [{ id: 1, time: 1200 }],
    levelOneActionTriggered: false
  }])

  // Gaze at right button again, and long time since last gaze
  expect(timesRightBtnTriggered).toBe(0)
  id++
  const timedGazePoint3 = createTimedGazePoint({
    pos: createPos({ x: 800, y: 299 }),
    time: 1700
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint3, id)
  // After activation bucket list should be empty again.
  expect(buckets).toEqual([createEmptyBucket(), createEmptyBucket()])
  expect(timesRightBtnTriggered).toBe(1)

  // Another Gaze at right button
  id++
  const timedGazePoint4 = createTimedGazePoint({
    pos: createPos({ x: 800, y: 101 }),
    time: 2000
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint4, id)
  expect(buckets).toEqual([createEmptyBucket(), {
    list: [{ id: 3, time: 2000 }],
    levelOneActionTriggered: false
  }])

  // Gaze at no button
  id++
  const timedGazePoint5 = createTimedGazePoint({
    pos: createPos({ x: 901, y: 200 }),
    time: 2200
  })
  activateBtnsOnDwellTestSettings(btns, buckets, timedGazePoint5, id)
  expect(buckets).toEqual([createEmptyBucket(), createEmptyBucket()])

  expect(timesLeftBtnTriggered).toBe(0)
  expect(timesRightBtnTriggered).toBe(1)

  setTimeout(() => done(), 200)
})

test('Very long gaze at button triggers level two action', () => {
  let timesLevelOneActionTriggered = 0
  let timesLevelTwoActionTriggered = 0
  let timesShadeBtnTriggered = 0
  const dwellBtnWithLevelTwoAction = createStandardDwellBtn({
    action: () => timesLevelOneActionTriggered++,
    levelTwoAction: () => timesLevelTwoActionTriggered++,
    center: createPos({ x: 200, y: 200 }),
    domId: 'btn'
  })
  const btns = [dwellBtnWithLevelTwoAction]
  const buckets = [createEmptyBucket()]

  let id = 10
  const gazeAtTwoActionBtn = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 1500
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
      expect([id, progress]).toEqual(['btn', 0])
    },
    timedGazePoint: gazeAtTwoActionBtn
  })
  expect(buckets).toEqual([{
    list: [createBucketListItem({ id: 10, time: 1500 })],
    levelOneActionTriggered: false
  }])
  expect(timesLevelOneActionTriggered).toBe(0)
  expect(timesLevelTwoActionTriggered).toBe(0)
  expect(timesShadeBtnTriggered).toBe(1)

  id++
  const gazeAtTwoActionBtnII = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 2000
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: gazeAtTwoActionBtnII,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
      expect([id, progress]).toEqual(['btn', 0])
    }
  })
  expect(buckets).toEqual([{
    list: [
      createBucketListItem({ id: 10, time: 1500 }),
      createBucketListItem({ id: 11, time: 2000 })
    ],
    levelOneActionTriggered: true
  }])
  expect(timesLevelOneActionTriggered).toBe(1)
  expect(timesLevelTwoActionTriggered).toBe(0)
  expect(timesShadeBtnTriggered).toBe(2)

  id++
  const gazeAtTwoActionBtnIII = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 2250
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: gazeAtTwoActionBtnIII,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
      expect([id, progress]).toEqual(['btn', 0.5])
    }
  })

  id++
  const gazeAtTwoActionBtnIV = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 2500
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: gazeAtTwoActionBtnIV,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
      expect([id, progress]).toEqual(['btn', 1])
    }
  })
  expect(buckets).toEqual([createEmptyBucket()])
  expect(timesLevelOneActionTriggered).toBe(1)
  expect(timesLevelTwoActionTriggered).toBe(1)
  expect(timesShadeBtnTriggered).toBe(3)

  id++
  const gazeAtTwoActionBtnV = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 3000
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: gazeAtTwoActionBtnV,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
    }
  })
  id++
  const gazeAtTwoActionBtnVI = createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }),
    time: 3500
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: gazeAtTwoActionBtnVI,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
    }
  })
  id++
  const targetMissingGaze = createTimedGazePoint({
    pos: createPos({ x: 800, y: 200 }),
    time: 3600
  })
  activateBtnsOnDwell({
    btns,
    buckets,
    timedGazePoint: targetMissingGaze,
    id,
    shadeBtn: (id, progress) => {
      timesShadeBtnTriggered++
    }
  })
  expect(buckets).toEqual([createEmptyBucket()])
})
