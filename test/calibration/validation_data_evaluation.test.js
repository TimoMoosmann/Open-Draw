import {createPos} from '../../src/data_types.js';
import {getWorstRelAccAndPrec} from '../../src/calibration/validation_data_evaluation.js';
import {round} from '../../src/util/math.js';

/*
 * Take the validation data and give back only the lowest x and y values for,
 * both relative accuracy and relative precision.
 */

test('Invalid validation data should throw an error', () => {
  expect(() => getWorstRelAccAndPrec(42)).toThrow(
    'ValidationData object needs to be an array.'
  );
  expect(() => getWorstRelAccAndPrec([])).toThrow(
    'ValidationData object needs at least one element in it.'
  );
  expect(() => getWorstRelAccAndPrec([42])).toThrow(
    'Invalid GazeEstimations object given.'
  );
  expect(() => getWorstRelAccAndPrec([{
    targetPos: createPos({x: 32, y: 32}),
    gazeEstimations: [],
    viewport: createPos({x: 100, y: 200})
  }])).toThrow(
    'gazeEstimations needs at least two estimations to be valid.'
  );
});

test(
  'Valid Example of gazeEstimations, targetPos, and viewport, should' +
  ' lead to a correct result.',
  () => {
    const {worstRelAcc, worstRelPrec} = getWorstRelAccAndPrec([{
      targetPos: createPos({x: 10, y: 20}),
      gazeEstimations: [createPos({x: 1, y: 2}), createPos({x: 2, y: 4})],
      viewport: createPos({x: 100, y: 100})
    }, {
      targetPos: createPos({x: 30, y: 20}),
      gazeEstimations: [createPos({x: 2, y: 5}), createPos({x: 1, y: 2})],
      viewport: createPos({x: 100, y: 100})
    }]);

    // Highest Accs devided by viewport.
    const worstRelAccExpect = createPos({
      x: 28.5 / 100,
      y: 17 / 100
    });
    // Higest Standard deviations devided by viewport.
    const worstRelPrecExpect = createPos({
      x: round(0.70710678118655 / 100, 3),
      y: round(2.1213203435596 / 100, 3)
    });

    expect(worstRelAcc.x).toBeCloseTo(worstRelAccExpect.x, 5);
    expect(worstRelAcc.y).toBeCloseTo(worstRelAccExpect.y, 5);
    expect(worstRelPrec.x).toBeCloseTo(worstRelPrecExpect.x, 5);
    expect(worstRelPrec.y).toBeCloseTo(worstRelPrecExpect.y, 5);
  }
);

/*
 * Now test different scenarios:
 *
 * - several gazeAtTargetDatas with different x and y values.
 * - Illegal x and y s, what could they look like? -> 1, -2,
 * - Illegal validation datas: No array, empty array, array with wrong types
 *   in it
 *
 *   2 targets: x: 10, y: 20; x: 30, y: 20 *
 *
 *   - each 2 gaze estiamtions
 *    -> x: 1, 2; y: 2, 4 -> standard devx: 0.70710678118655, y: 1.4142135623731; accx: 9 + 8 = 17 /2 = 8,5; accy: 18 + 16 = 34 /2 = 17
 *    -> x: 2, 5,  y: 1,2 -> standard devx: 2.1213203435596, y: 0.70710678118655; accx: 28 + 25 = 53 /2 = 26,5; accy: 19 + 18 = 37 /2 = 18,5
 *    
 *    1. target: xAcc1: 0 + 10 = 5
 *               yAcc1: 10 + 0 = 5
 *               xPrec1: mean: 15, devs: 5, 5
 *    *               y: 40, 30, 20, 10 = 100 / 4 = 25
 *
 */

