// Unsigned Integer
function checkUnsignedInteger (val, argName) {
  if (!Number.isInteger(val) || val < 0) {
    throw new TypeError(argName + ': Needs to be an unsigned Integer.')
  }
}

export {
  checkUnsignedInteger
}
