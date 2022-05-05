import {checkNumbersArray} from '../data_types.js';

const round = (num, digitsAfterComma) => {
  const shiftFactor = 10 ** digitsAfterComma;
  const roundedNum = Math.round(num * shiftFactor) / shiftFactor;
  return Number(roundedNum.toFixed(digitsAfterComma));
}

const mean = (numbers) => {
  if (Array.isArray(numbers) && numbers.length > 0) {
  return numbers.reduce((acc, curr) => acc + curr) / numbers.length;
  }
  throw "Input needs to be an array of numbers, which is not empty";
}

const meanOffset = (targetNum, numbers) => {
  return mean(numbers.map((num) => Math.abs(num - targetNum)));
}

const calcPopulationStandardDeviation = population => {
  checkNumbersArray(population);
  const populationMean = mean(population);
  const numsMinusMeanSquared = population.map(
    num => (num - populationMean) ** 2
  );
  return Math.sqrt(mean(numsMinusMeanSquared));
}

const calcSampleStandardDeviation = sample => {
  checkNumbersArray(sample);
  if (sample.length === 1) return 0;
  const sampleMean = mean(sample);
  const numsMinusMeanSquared = sample.map(
    num => (num - sampleMean) ** 2
  );
  return Math.sqrt((1 / (sample.length - 1)) * numsMinusMeanSquared.reduce(
    (acc, curr) => acc + curr
  ));
};

export {
  mean, meanOffset, round, calcPopulationStandardDeviation,
  calcSampleStandardDeviation
};

