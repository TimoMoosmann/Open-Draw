/* global expect, test */
import {
  mean, round, calcPopulationStandardDeviation, calcSampleStandardDeviation
} from 'Src/util/math.js'

test('mean of 4, 2, 1, 3 to equal 2.5', () => {
  expect(mean([4, 2, 1, 3])).toBe(2.5)
})

test('mean of a single value is the value itself', () => {
  expect(mean([3])).toBe(3)
})

test('mean of an empty array should throw an error', () => {
  expect(() => mean([])).toThrow(/empty/)
})

test('mean of an input which is not an array should throw an error', () => {
  expect(() => mean(3)).toThrow(/array/i)
})

test('expect mean of an array of numbers to be correct', () => {
  expect(mean(
    [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4]
  )).toBe(7)
})

// Population Standard Deviation
test('expect population standard deviation of an array of numbers to be correct', () => {
  expect(round(calcPopulationStandardDeviation(
    [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4]), 3
  )).toBe(2.983)
})
test('population standard deviation of a single value is 0', () => {
  expect(calcPopulationStandardDeviation([3])).toBe(0)
})
test('population standard deviation of an empty array is illegal', () => {
  expect(() => calcPopulationStandardDeviation([])).toThrow(
    'Invalid NonEmptyArray given.'
  )
})
test('population standard deviation of an input which is not an array is illegal', () => {
  expect(() => calcPopulationStandardDeviation(3)).toThrow(
    'Invalid Array given.'
  )
})

// Sample Standard Deviation
test('Sample standard deviation of an array of numbers should be correct',
  () => {
    expect(calcSampleStandardDeviation(
      [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 5, 4, 10, 9, 6, 9, 4])
    ).toBeCloseTo(3.060787652326, 5)
  }
)
test('Sample standard deviation of a single value is 0', () => {
  expect(calcSampleStandardDeviation([3])).toBe(0)
})
test('sample standard deviation of an input which is not an array is illegal',
  () => {
    expect(() => calcSampleStandardDeviation(3)).toThrow(
      'Invalid Array given.'
    )
  }
)
test('Sample standard deviation of an empty array is illegal', () => {
  expect(() => calcSampleStandardDeviation([])).toThrow(
    'Invalid NonEmptyArray given.'
  )
})
test('Sample standard deviation of a non-numeric Array is illegal', () => {
  expect(() => calcSampleStandardDeviation(['miau'])).toThrow(
    'Invalid NumbersArray given.'
  )
})
