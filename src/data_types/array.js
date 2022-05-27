function checkArray (arr, argName) {
  if (!Array.isArray(arr)) {
    throw new TypeError(argName + ': Invalid Array given.')
  }
}

function checkNonEmptyArray (array, argName) {
  checkArray(array, argName)
  if (array.length === 0) {
    throw new TypeError(argName + ': Invalid NonEmptyArray given.')
  }
}

function checkNumbersArray (numbers, argName) {
  checkNonEmptyArray(numbers)
  for (const num of numbers) {
    if (isNaN(num)) {
      throw new TypeError(argName + ': Invalid NumbersArray given.')
    }
  }
}

function checkIdxInBounds (idx, array, argName) {
  if (idx >= array.length) {
    throw new TypeError(argName + ': Index out of bounds.')
  }
}

export {
  checkArray,
  checkIdxInBounds,
  checkNumbersArray,
  checkNonEmptyArray
}
