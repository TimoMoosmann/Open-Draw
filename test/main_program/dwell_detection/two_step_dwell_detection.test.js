/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { getTwoStepDwellDetector } from 'Src/main_program/dwell_detection/two_step_dwell_detection.js'

function getTwoStepDwellDetectorWithTestSettings () {
  return getTwoStepDwellDetector({
    dispersionThreshold: createPos({ x: 100, y: 100 }),
    firstStepDurationThreshold: 500,
    secondStepDurationThreshold: 1200
  })
}

test('Illegal Inputs should fail', () => {
  const dwellDetector = getTwoStepDwellDetectorWithTestSettings()
  expect(() => dwellDetector.step()).toThrow(
    'timedGazePoint: Invalid TimedGazePoint.'
  )
  expect(() => dwellDetector.step(42)).toThrow(
    'timedGazePoint: Invalid TimedGazePoint.'
  )
})

test('Less then two timedGazePoints should return no dwellPoints', () => {
  const dwellDetector = getTwoStepDwellDetectorWithTestSettings()
  expect(dwellDetector.step(createTimedGazePoint({
    pos: createPos({ x: 200, y: 200 }), time: 3000
  }))).toBe(false)
})

test(
  'Dwell points in dispersionThreshold should trigger callbacks correctly',
  () => {
    const dwellDetector = getTwoStepDwellDetectorWithTestSettings()
    dwellDetector.timedGazePoints.push(
      createTimedGazePoint({ pos: createPos({ x: 200, y: 100 }), time: 0 })
    )
    // Fixation duration is less then fisrstStepDurationThreshold
    expect(dwellDetector.step(
      createTimedGazePoint({ pos: createPos({ x: 300, y: 200 }), time: 499 })
    )).toBe(false)
    expect(dwellDetector.timedGazePoints.length).toBe(2)

    // Fixation duration is equal to firstStepDurationThreshold
    expect(dwellDetector.step(
      createTimedGazePoint({ pos: createPos({ x: 250, y: 150 }), time: 500 })
    )).toEqual({
      dwellPoint: createPos({ x: 250, y: 150 }),
      step: 1
    })
    expect(dwellDetector.timedGazePoints.length).toBe(3)

    expect(dwellDetector.step(
      createTimedGazePoint({ pos: createPos({ x: 200, y: 100 }), time: 700 })
    )).toBe(false)
    expect(dwellDetector.timedGazePoints.length).toBe(4)
    expect(dwellDetector.step(
      createTimedGazePoint({ pos: createPos({ x: 300, y: 200 }), time: 1199 })
    )).toBe(false)
    expect(dwellDetector.timedGazePoints.length).toBe(5)

    // Fixation duration is equal to secondStepDurationThreshold
    expect(dwellDetector.step(
      createTimedGazePoint({ pos: createPos({ x: 250, y: 150 }), time: 1200 })
    )).toEqual({
      dwellPoint: createPos({ x: 250, y: 150 }),
      step: 2
    })
    expect(dwellDetector.timedGazePoints).toEqual([])
  }
)

test('Dwell points outside of dispersionThreshold', () => {
  const dwellDetector = getTwoStepDwellDetectorWithTestSettings()
  dwellDetector.timedGazePoints = [
    createTimedGazePoint({ pos: createPos({ x: 200, y: 100 }), time: 0 }),
    createTimedGazePoint({ pos: createPos({ x: 200, y: 100 }), time: 100 }),
    createTimedGazePoint({ pos: createPos({ x: 300, y: 100 }), time: 200 })
  ]
  expect(dwellDetector.step(
    createTimedGazePoint({ pos: createPos({ x: 400, y: 200 }), time: 499 })
  )).toBe(false)
  // First two elements should be removed, so that dwellPoints fit in
  // dispersionThreshold
  expect(dwellDetector.timedGazePoints.length).toBe(2)

  // Activate firstStep
  expect(dwellDetector.step(
    createTimedGazePoint({ pos: createPos({ x: 350, y: 150 }), time: 700 })
  )).toEqual({ dwellPoint: createPos({ x: 350, y: 150 }), step: 1 })
  expect(dwellDetector.timedGazePoints.length).toBe(3)

  // When firstStep was already activated, then missing the dispersionThreshold
  // should lead to discarding the dwell and look for a new one.
  expect(dwellDetector.step(
    createTimedGazePoint({ pos: createPos({ x: 350, y: 50 }), time: 800 })
  )).toEqual({ dwellPoint: false, step: 2 })
  expect(dwellDetector.timedGazePoints).toEqual([])
})
