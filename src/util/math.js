const round = ({num, digitsAfterComma}) => {
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

const standardDeviation = (numbers) => {
  if (Array.isArray(numbers) && numbers.length > 0) {
    const numbersMean = mean(numbers);
    const numsMinusMeanSquared = numbers.map((num) => (num - numbersMean) ** 2);
    return Math.sqrt(mean(numsMinusMeanSquared));
  }
  throw "Input needs to be an array of numbers, which is not empty";
}

export {mean, meanOffset, round, standardDeviation};

