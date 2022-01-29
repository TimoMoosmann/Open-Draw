import {GazeTargetData} from '../../src/calibration/validation_data.js';
import {Position, Positions} from '../../src/helper/positions.js';

const targetDataInvalid = 5;

const targetDataEmpty = new GazeTargetData(
  new Position(2, 3),
  new Positions()
);

const targetDataShort = new GazeTargetData(
  new Position(3, 4),
  new Positions([new Position(-1, 3), new Position(4, 2)])
);

test('Invalid target data should throw an error', () => {
  expect(() => new GazeTargetData(targetDataInvalid)).toThrow(TypeError);
});

test('Empty gaze estimations array should throw an error', () => {
  expect(() => targetDataEmpty.getAccuracy()).toThrow();
  expect(() => targetDataEmpty.getPrecision()).toThrow();
});

test('Accurcy of valid target data should be the rounded mean offset from' +
  'the target',
  () => {
    expect(targetDataShort.getAccuracy()).toEqual(new Position(3, 2));
  }
);

test('Precision of valid target data should be the rounded standard ' +
   'deviation from the estimation points', () => {
    expect(targetDataShort.getPrecision()).toEqual(new Position(3, 1));
  }
);

