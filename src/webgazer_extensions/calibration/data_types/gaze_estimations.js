import { checkNumericPos } from 'Src/data_types/pos.js'

function checkGazeEstimations (gazeEstimations, argName) {
  if (!Array.isArray(gazeEstimations) || gazeEstimations.length < 2) {
    throw new TypeError(
      argName + ': Needs to be an array of at least two GazeEstimations.'
    )
  }

  for (let i = 0; i < gazeEstimations.length; i++) {
    checkNumericPos(gazeEstimations[i], `${argName}[${i}]`)
  }
}

export {
  checkGazeEstimations
}
