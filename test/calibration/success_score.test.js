/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { calcCalibrationScore, createCalibrationScoreEvalOut, getCalibrationScoreEvaluation } from 'Src/calibration/success_score.js'

const testBorderAcc = createPos({ x: 0.06, y: 0.12 })
const testPerfectAcc = createPos({ x: 0.03, y: 0.06 })
const testBorderPrec = createPos({ x: 0.06, y: 0.1 })

test('calcCalibrationScore works well', () => {
  const accXYIsPerfect = createPos({ x: 0.03, y: 0.06 })
  expect(calcCalibrationScore({
    acc: accXYIsPerfect,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({ x: 100, y: 100 }))

  const accXYBetterThanPerfect = createPos({ x: 0.02, y: 0.05 })
  expect(calcCalibrationScore({
    acc: accXYBetterThanPerfect,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({ x: 100, y: 100 }))

  const accXYBad = createPos({ x: 0.1, y: 0.19 })
  expect(calcCalibrationScore({
    acc: accXYBad,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({ x: 0, y: 0 }))

  const accXYOk = createPos({ x: 0.06, y: 0.12 })
  expect(calcCalibrationScore({
    acc: accXYOk,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({ x: 50, y: 50 }))
})

function createCalibrationScoreInp ({
  xAcc, yAcc, xPrec, yPrec, trys
}) {
  return {
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc,
    borderPrec: testBorderPrec,
    lang: 'en',
    relAcc: createPos({ x: xAcc, y: yAcc }),
    relPrec: createPos({ x: xPrec, y: yPrec }),
    trys
  }
}

test('Insufficent Precision', () => {
  const trys = { trys: 0 }
  const lowYPrecisionHighAccuracy = createCalibrationScoreInp({
    xAcc: 0.01, yAcc: 0.02, xPrec: 0.01, yPrec: 0.2, trys
  })
  const firstTryNotAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 100, y: 100 }),
    accScoreColor: createPos({ x: 'green', y: 'green' }),
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your accuracy is good.<br>' +
      'Your precision is too low to use the program properly.<br>' +
      'Please calibrate again.',
    proceedBtnActive: false
  })
  expect(getCalibrationScoreEvaluation(lowYPrecisionHighAccuracy))
    .toEqual(firstTryNotAbleToProceed)
  expect(trys.trys).toBe(1)

  const lowXPrecisionHighAccuracy = createCalibrationScoreInp({
    xAcc: 0.042, yAcc: 0.084, xPrec: 0.1, yPrec: 0.02, trys
  })
  const secondTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 80, y: 80 }),
    accScoreColor: createPos({ x: 'green', y: 'green' }),
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your accuracy is good.<br>' +
      'Your precision is too low to use the program properly.<br>' +
      'Please calibrate again, or proceed with limited quality.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(lowXPrecisionHighAccuracy))
    .toEqual(secondTryAbleToProceed)
  expect(trys.trys).toBe(2)
})

test('Relative Accuracy is lower than 50% in X or Y', () => {
  const trys = { trys: 0 }
  const lowXAccHighPrec = createCalibrationScoreInp({
    xAcc: 0.0606, yAcc: 0.02, xPrec: 0.01, yPrec: 0.02, trys
  })
  const firstTryNotAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 49, y: 100 }),
    accScoreColor: createPos({ x: 'red', y: 'green' }),
    precStatus: 'good',
    precStatusColor: 'green',
    message:
      'Your accuracy is too low to use the program properly.<br>' +
      'Please calibrate again.',
    proceedBtnActive: false
  })
  expect(getCalibrationScoreEvaluation(lowXAccHighPrec))
    .toEqual(firstTryNotAbleToProceed)
  expect(trys.trys).toBe(1)

  const lowYAccHighPrec = createCalibrationScoreInp({
    xAcc: 0.02, yAcc: 0.1212, xPrec: 0.01, yPrec: 0.02, trys
  })
  const secondTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 100, y: 49 }),
    accScoreColor: createPos({ x: 'green', y: 'red' }),
    precStatus: 'good',
    precStatusColor: 'green',
    message:
      'Your accuracy is too low to use the program properly.<br>' +
      'Please calibrate again, or proceed with limited quality.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(lowYAccHighPrec))
    .toEqual(secondTryAbleToProceed)
  expect(trys.trys).toBe(2)
})

test('Accuracy and Precision too low', () => {
  const trys = { trys: 0 }
  const lowXAccHighPrec = createCalibrationScoreInp({
    xAcc: 0.0606, yAcc: 0.1212, xPrec: 0.1, yPrec: 0.02, trys
  })
  const firstTryNotAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 49, y: 49 }),
    accScoreColor: createPos({ x: 'red', y: 'red' }),
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your accuracy is too low to use the program properly.<br>' +
      'Your precision is too low to use the program properly.<br>' +
      'Please calibrate again.',
    proceedBtnActive: false
  })
  expect(getCalibrationScoreEvaluation(lowXAccHighPrec))
    .toEqual(firstTryNotAbleToProceed)
  expect(trys.trys).toBe(1)

  const lowYAccHighPrec = createCalibrationScoreInp({
    xAcc: 0.02, yAcc: 0.1212, xPrec: 0.01, yPrec: 0.2, trys
  })
  const secondTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 100, y: 49 }),
    accScoreColor: createPos({ x: 'green', y: 'red' }),
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your accuracy is too low to use the program properly.<br>' +
      'Your precision is too low to use the program properly.<br>' +
      'Please calibrate again, or proceed with limited quality.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(lowYAccHighPrec))
    .toEqual(secondTryAbleToProceed)
  expect(trys.trys).toBe(2)
})

test('Precision and Accuracy are just enough', () => {
  const trys = { trys: 0 }
  const medAccMedPrec = createCalibrationScoreInp({
    xAcc: 0.06, yAcc: 0.12, xPrec: 0.06, yPrec: 0.1, trys
  })
  const firstTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 50, y: 50 }),
    accScoreColor: createPos({ x: 'orange', y: 'orange' }),
    precStatus: 'good',
    precStatusColor: 'green',
    message: 'Your accuracy is just enough to use the program.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(medAccMedPrec))
    .toEqual(firstTryAbleToProceed)
  expect(trys.trys).toBe(1)
})

test('Accuracy is 65% and precision okay', () => {
  const trys = { trys: 0 }
  const goodAccMedPrec = createCalibrationScoreInp({
    xAcc: 0.051, yAcc: 0.102, xPrec: 0.06, yPrec: 0.1, trys
  })
  const firstTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 65, y: 65 }),
    accScoreColor: createPos({ x: 'yellow', y: 'yellow' }),
    precStatus: 'good',
    precStatusColor: 'green',
    message: 'Your accuracy is good enough to use the program.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(goodAccMedPrec))
    .toEqual(firstTryAbleToProceed)
  expect(trys.trys).toBe(1)
})

test('Accuracy is 80% and precision okay', () => {
  const trys = { trys: 0 }
  const veryGoodAccMedPrec = createCalibrationScoreInp({
    xAcc: 0.042, yAcc: 0.084, xPrec: 0.06, yPrec: 0.1, trys
  })
  const firstTryAbleToProceed = createCalibrationScoreEvalOut({
    accScore: createPos({ x: 80, y: 80 }),
    accScoreColor: createPos({ x: 'green', y: 'green' }),
    precStatus: 'good',
    precStatusColor: 'green',
    message: 'Your accuracy is good.',
    proceedBtnActive: true
  })
  expect(getCalibrationScoreEvaluation(veryGoodAccMedPrec))
    .toEqual(firstTryAbleToProceed)
  expect(trys.trys).toBe(1)
})
