import {
  checkGazeAtTargetData
} from 'Src/webgazer_extensions/calibration/data_types/gaze_at_target_data.js'

function checkValidationData (validationData, argName) {
  if (!Array.isArray(validationData) || validationData.length < 1) {
    throw new TypeError(
      argName +
      ': ValidationData object needs to be an array of at least one element.'
    )
  }
  for (let i = 0; i < validationData.length; i++) {
    checkGazeAtTargetData(validationData[i], `${argName}[${i}]`)
  }
}

export {
  checkValidationData
}
