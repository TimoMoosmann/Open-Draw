import {mean, round, standardDeviation} from '../../src/helper/math.js';

test('mean of 4, 2, 1, 3 to equal 2.5', () => {
  expect(mean([4, 2, 1, 3])).toBe(2.5);
});

test('mean of a single value is the value itself', () => {
  expect(mean([3])).toBe(3);
});

test('mean of an empty array should throw an error', () => {
  expect(() => mean([])).toThrow(/empty/);
});

test('mean of an input which is not an array should throw an error', () => {
  expect(() => mean(3)).toThrow(/array/i);
});

test('expect mean of an array of numbers to be correct', () => {
  expect(round(mean(
    [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4]), 3))
    .toBe(7)
});

test('expect standard deviation of an array of numbers to be correct', () => {
  expect(round(standardDeviation(
    [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4]), 3))
    .toBe(2.983)
});

test('standard deviation of a single value is 0', () => {
  expect(standardDeviation([3])).toBe(0);
});

test('standard deviation of an empty array is illegal', () => {
  expect(() => standardDeviation([])).toThrow(/empty/);
});

test('standard deviation of an input which is not an array is illegal', () => {
  expect(() => standardDeviation(3)).toThrow(/array/i);
});

