import {checkGazeAtTargetData, createGazeAtTargetData, createPos} from '../src/data_types.js';
/*
 * Test if illegal inputs lead to errors when creating new data_types.
 */

const getLegalTargetPos = () => createPos({x: 200, y: 100});

const getLegalGazeEstimations = () => [
  createPos({x: 20, y: 20}),
  createPos({x: 20, y: 20}),
  createPos({x: 20, y: 20})
];

const getLegalViewport = () => createPos({x: 1200, y: 600});

const createGazeAtTargetDataWithIllegalTargetPos = illegalTargetPos => {
  return createGazeAtTargetData({
    targetPos: illegalTargetPos,
    gazeEstimations: getLegalGazeEstimations(),
    viewport: getLegalViewport()
  });
};

const createGazeAtTargetDataWithIllegalGazeEstimations =
  illegalGazeEstimations => {
    return createGazeAtTargetData({
      targetPos: getLegalTargetPos(),
      gazeEstimations: illegalGazeEstimations,
      viewport: getLegalViewport()
    });
  };

const createGazeAtTargetDataWithIllegalViewport = illegalViewport => {
  return createGazeAtTargetData({
    targetPos: getLegalTargetPos(),
    gazeEstimations: getLegalGazeEstimations(),
    viewport: illegalViewport
  });
};

test('Creating a GazeAtTargetData obj should fail on illegal inputs', () => {

  // Illegal targetPos
  expect(() => createGazeAtTargetDataWithIllegalTargetPos(24)).toThrow(
    'Invalid pos.'
  );

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    {x: -1, y: 24}
  ))).toThrow('Invalid positiveNumericPos.');

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    {x: 12, y: -2}
  ))).toThrow('Invalid positiveNumericPos.');

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    {x: 2, y: 2000}
  ))).toThrow('targetPos is outside the viewport.');

  expect(() => createGazeAtTargetDataWithIllegalTargetPos(createPos(
    {x: 4000, y: 2}
  ))).toThrow('targetPos is outside the viewport.');

  // Illegal gazeEstimations
  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(42))
    .toThrow('Invalid gazeEstimations.');

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations([42]))
    .toThrow('Invalid pos.');

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(
    [createPos({x: 'apple', y: 32})]
  )).toThrow('Invalid numericPos.');

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(
    [createPos({x: 32, y: 'apple'})]
  )).toThrow('Invalid numericPos.');

  expect(() => createGazeAtTargetDataWithIllegalGazeEstimations(
    [createPos({x: 30, y: 40})]
  )).toThrow('gazeEstimations needs at least two estimations to be valid.');

  // Illegal viewport
  expect(() => createGazeAtTargetDataWithIllegalViewport(42)).toThrow(
    'Invalid pos.'
  );
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    {x: 'hello', y: 20})
  )).toThrow('Invalid numericPos.');
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    {x: 20, y: 'hello'})
  )).toThrow('Invalid numericPos.');

  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    {x: -1, y: 20})
  )).toThrow('Invalid positiveNumericPos.');
  expect(() => createGazeAtTargetDataWithIllegalViewport(createPos(
    {x: 20, y: -4})
  )).toThrow('Invalid positiveNumericPos.');
});

test('Creating a GazeAtTargetData obj should work for legal inputs', () => {
  expect(checkGazeAtTargetData(createGazeAtTargetData({
    targetPos: getLegalTargetPos(),
    gazeEstimations: getLegalGazeEstimations(),
    viewport: getLegalViewport()
  }))).toBe(undefined);
});

