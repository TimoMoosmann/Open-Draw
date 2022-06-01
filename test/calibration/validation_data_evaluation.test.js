/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { getWorstRelAccAndPrec } from 'Src/calibration/validation_data_evaluation.js'

/*
 * Take the validation data and give back only the lowest x and y values for,
 * both relative accuracy and relative precision.
 */

test('Invalid validation data should throw an error', () => {
  expect(() => getWorstRelAccAndPrec(42)).toThrow(
    'validationData: ' +
    'ValidationData object needs to be an array of at least one element.'
  )
  expect(() => getWorstRelAccAndPrec([])).toThrow(
    'validationData: ' +
    'ValidationData object needs to be an array of at least one element.'
  )
  expect(() => getWorstRelAccAndPrec([42])).toThrow(
    'validationData[0].targetPos: Invalid PositiveNumericPos.'
  )
  expect(() => getWorstRelAccAndPrec([{
    targetPos: createPos({ x: 32, y: 32 }),
    gazeEstimations: [],
    viewport: createPos({ x: 100, y: 200 })
  }])).toThrow(
    'validationData[0].gazeEstimations: ' +
    'GazeEstimations needs to be an array of at least two GazeEstimation ' +
    'objects.'
  )
})

test(
  'Valid Example of gazeEstimations, targetPos, and viewport, should' +
  ' lead to a correct result.',
  () => {
    const { worstRelAcc, worstRelPrec } = getWorstRelAccAndPrec([{
      targetPos: createPos({ x: 10, y: 20 }),
      gazeEstimations: [createPos({ x: 1, y: 2 }), createPos({ x: 2, y: 4 })],
      viewport: createPos({ x: 100, y: 100 })
    }, {
      targetPos: createPos({ x: 30, y: 20 }),
      gazeEstimations: [createPos({ x: 2, y: 5 }), createPos({ x: 1, y: 2 })],
      viewport: createPos({ x: 100, y: 100 })
    }])

    // Highest Accs devided by viewport.
    const worstRelAccExpect = createPos({
      x: 28.5 / 100,
      y: 17 / 100
    })
    // Higest Standard deviations devided by viewport.
    const worstRelPrecExpect = createPos({
      x: 0.70710678118655 / 100,
      y: 2.1213203435596 / 100
    })

    expect(worstRelAcc.x).toBeCloseTo(worstRelAccExpect.x, 5)
    expect(worstRelAcc.y).toBeCloseTo(worstRelAccExpect.y, 5)
    expect(worstRelPrec.x).toBeCloseTo(worstRelPrecExpect.x, 5)
    expect(worstRelPrec.y).toBeCloseTo(worstRelPrecExpect.y, 5)
  }
)
