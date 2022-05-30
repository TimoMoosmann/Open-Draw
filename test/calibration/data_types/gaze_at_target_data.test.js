
/* global expect, test */
import { checkGazeAtTargetData, createGazeAtTargetData } from 'Src/webgazer_extensions/calibration/data_types/gaze_at_target_data.js'
import { createPos } from 'Src/data_types/pos.js'

/*
 * Test if illegal inputs lead to errors when creating new data_types.
 */
const getLegalTargetPos = () => createPos({ x: 200, y: 100 })

const getLegalGazeEstimations = () => [
  createPos({ x: 20, y: 20 }),
  createPos({ x: 20, y: 20 }),
  createPos({ x: 20, y: 20 })
]

const getLegalViewport = () => createPos({ x: 1200, y: 600 })

const createGazeAtTargetDataWithIllegalTargetPos = illegalTargetPos => {
  return createGazeAtTargetData({
    targetPos: illegalTargetPos,
    gazeEstimations: getLegalGazeEstimations(),
    viewport: getLegalViewport()
  })
}

const createGazeAtTargetDataWithIllegalGazeEstimations =
  illegalGazeEstimations => {
    return createGazeAtTargetData({
      targetPos: getLegalTargetPos(),
      gazeEstimations: illegalGazeEstimations,
      viewport: getLegalViewport()
    })
  }

const createGazeAtTargetDataWithIllegalViewport = illegalViewport => {
  return createGazeAtTargetData({
    targetPos: getLegalTargetPos(),
    gazeEstimations: getLegalGazeEstimations(),
    viewport: illegalViewport
  })
}

test('Creating a GazeAtTargetData obj should fail on illegal inputs', () => {
  // Illegal targetPos
  expect(() => createGazeAtTargetDataWithIllegalTargetPos(24)).toThrow(
    'createGazeAtTargetData-given.targetPos: Invalid PositiveNumericPos.'
  )

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    { x: -1, y: 24 }
  ))).toThrow(
    'createGazeAtTargetData-given.targetPos: Invalid PositiveNumericPos.'
  )

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    { x: 12, y: -2 }
  ))).toThrow(
    'createGazeAtTargetData-given.targetPos: Invalid PositiveNumericPos.'
  )

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    { x: 2, y: 2000 }
  ))).toThrow(
    'createGazeAtTargetData-given: targetPos is outside viewport.'
  )

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    { x: 4000, y: 2 }
  ))).toThrow(
    'createGazeAtTargetData-given: targetPos is outside viewport.'
  )

  // Illegal gazeEstimations
  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(42))
    .toThrow(
      'createGazeAtTargetData-given.gazeEstimations: ' +
      'GazeEstimations needs to be an array of at least two GazeEstimation ' +
      'objects.'
    )

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations([42]))
    .toThrow(
      'createGazeAtTargetData-given.gazeEstimations: ' +
      'GazeEstimations needs to be an array of at least two GazeEstimation ' +
      'objects.'
    )

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(
    [createPos({ x: 'apple', y: 32 })]
  )).toThrow(
    'createGazeAtTargetData-given.gazeEstimations: ' +
    'GazeEstimations needs to be an array of at least two GazeEstimation ' +
    'objects.'
  )

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(
    [createPos({ x: 30, y: 40 })]
  )).toThrow(
    'createGazeAtTargetData-given.gazeEstimations: ' +
    'GazeEstimations needs to be an array of at least two GazeEstimation ' +
    'objects.'
  )

  // Illegal viewport
  expect(() => createGazeAtTargetDataWithIllegalViewport(42)).toThrow(
    'createGazeAtTargetData-given.viewport: ' +
    'Invalid PositiveNumericPos.'
  )
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    { x: 'hello', y: 20 })
  )).toThrow(
    'createGazeAtTargetData-given.viewport: ' +
    'Invalid PositiveNumericPos.'
  )
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    { x: 20, y: 'hello' })
  )).toThrow(
    'createGazeAtTargetData-given.viewport: ' +
    'Invalid PositiveNumericPos.'
  )

  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    { x: -1, y: 20 })
  )).toThrow(
    'createGazeAtTargetData-given.viewport: ' +
    'Invalid PositiveNumericPos.'
  )
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    { x: 20, y: -4 })
  )).toThrow(
    'createGazeAtTargetData-given.viewport: ' +
    'Invalid PositiveNumericPos.'
  )
})

test('Creating a GazeAtTargetData obj should work for legal inputs', () => {
  expect(checkGazeAtTargetData(createGazeAtTargetData({
    targetPos: getLegalTargetPos(),
    gazeEstimations: getLegalGazeEstimations(),
    viewport: getLegalViewport()
  }))).toBe(undefined)
})
