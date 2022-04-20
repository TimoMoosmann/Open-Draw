import {createPos} from '../../src/data_types.js';
import {calcCalibrationScore} from '../../src/calibration/success_score.js';

/*
 *
 * Success score for the calibration
 *
 * Give a score from 0% to 100% to the calculated accuracy aftter ones
 * calibration.
 *
 * 50% means: acc.x = 0.06; acc.y = 0,12
 *
 * For the precision one can either fail, or succed
 * Sucession means that the precision is in x direction >= 0.07, and
 *  in y-direction >= 0.08
 *
 * Depending on the score a sentence is displed on a screen that indiacates
 * how good the calibration was. And a color indicates that too.
 *
 * If ones score is higher or equals 50% one can proceed immeditely,
 * but can also retry the calibration.
 * If one scores less than 50% one have to repeat the calibration one time
 * before being able to prceed.
 *
 * Scenarios:
 * X or Y is under 50% or Precision is insufficient
 *   -> score or precision in red
 *   -> The next time one can proceed, but with warning message if criterias
 *      are not fullfilled;
 *   -> Can proceed without warning message, when criterias are fullfilled.
 * 
 * X or Y is 50% or more and Precision is sufficient
 *   -> Precision in green, show: Precision: good
 *   -> 50% - 59%: orange, message: Accuracy is sufficient.
 *   -> 60% to 75%: yellow, message: Good accuracy.
 *   -> 75% to 100%: green, message: Very good accuracy.
 */

const relAccuracyXUnder50 = createPos({x: 0.05, y: 0.13});
const relAccuracyYUnder50 = createPos({x: 0.05, y: 0.13});
const relAccuracyXYUnder50 = createPos({x: 0.05, y: 0.13});
const relAccuracyXY50 = createPos({x: 0.06, y: 0.12});

const testBorderAcc = createPos({x: 0.06, y: 0.12});
const testPerfectAcc = createPos({x: 0.03, y: 0.06});
const testBorderPrec = createPos({x: 0.06, y: 0.1});

test('calcCalibrationScore works well', () => {
  const accXYIsPerfect = createPos({x: 0.03, y: 0.06});
  expect(calcCalibrationScore({
    acc: accXYIsPerfect,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({x: 100, y: 100}));

  const accXYBetterThanPerfect = createPos({x: 0.02, y: 0.05});
  expect(calcCalibrationScore({
    acc: accXYBetterThanPerfect,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({x: 100, y: 100}));

  const accXYBad = createPos({x: 0.1, y: 0.19});
  expect(calcCalibrationScore({
    acc: accXYBad,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({x: 0, y: 0}));

  const accXYOk = createPos({x: 0.06, y: 0.12});
  expect(calcCalibrationScore({
    acc: accXYOk,
    borderAcc: testBorderAcc,
    perfectAcc: testPerfectAcc
  })).toEqual(createPos({x: 50, y: 50}));
});

const inp = {
  relAcc: createPos({x: 0.1, y: 0.2}),
  relPrec: createPos({x: 0.1, y: 0.2}),
  borderPrec: createPos({x: 0.05, y: 0.1}),
  borderAcc: createPos({x: 0.05, y: 0.1}),
  trys: 0
};

const out = {
  accuracy: 38,
  accColor: 'red',
  precision: 'okay',
  precColor: 'green',
  message: 'Acc is fine',
  proceedBtnActivated: false,
};

const createCalcScoreInp = ({
  xAcc, yAcc, xPrec, yPrec, trys
}) => ({
  borderAcc: testBorderAcc,
  perfectAcc: testPerfectAcc,
  borderPrec: testBorderPrec,
  relAcc: createPos({x: xAcc, y: yAcc}),
  relPrec: createPos({x: xPrec, y: yPrec}),
  trys
});

const createCalcScoreEvalOut = ({
  inpScore,
  accColor,
  precStatus,
  precStatusColor,
  message,
  proceedBtnActivated
}) => ({
  accScore: calcCalibrationScore({
    acc: inpScore.relAcc,
    borderAcc: inpScore.borderAcc,
    borderPrec: inpScore.borderPrec
  }),
  accColor,
  precStatus
  precStatusColor,
  message,
  proceedBtnActivated
});


test('Insufficent Precision', () => {
  const trys = {trys: 0};
  const lowYPrecisionHighAccuracy = createCalcScoreInpt({
    xAcc: 0.01, yAcc: 0.02, xPrec: 0.01, yPrec: 0.2, trys
  });
  const firstTryNotAbleToProceed = createCalcScoreEvalOut = ({
    inpScore: lowYPrecisionHighAccuracy,
    accColor: 'green',
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your precision is too low to use the program properly, ' +
      'please calibrate again.',
    proceedBtnActivated: false
  });
  expect(evaluateCalibrationScore(lowYPrecisionHighAccuracy))
    .toEqual(firstTryNotAbleToProceed);
  expect(trys.trys).toBe(1);

  const lowXPrecisionHighAccuracy = createCalcScoreInpt({
    xAcc: 0.01, yAcc: 0.02, xPrec: 0.1, yPrec: 0.02, trys
  });
  const secondTryAbleToProceed = createCalcScoreEvalOut = ({
    inpScore: lowXPrecisionHighAccuracy,
    accColor: 'green',
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your precision is too low to use the program properly, ' +
      'please calibrate again, or proceed.',
    proceedBtnActivated: true
  });
  expect(evaluateCalibrationScore(lowXPrecisionHighAccuracy))
    .toEqual(secondTryAbleToProceed);
  expect(trys.trys).toBe(2);
});

test('Relative Accuracy is lower than 50% in X or Y')
  const trys = {trys: 0};
  const lowXAccHighYAccAndPrec = createCalcScoreInpt({
    xAcc: 0.07, yAcc: 0.02, xPrec: 0.01, yPrec: 0.02, trys
  });
  const firstTryNotAbleToProceed = createCalcScoreEvalOut = ({
    inpScore: lowPrecisionHighAccuracy,
    accColor: 'green',
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your precision is too low to use the program properly, ' +
      'please calibrate again.',
    proceedBtnActivated: false
  });
  expect(evaluateCalibrationScore(lowPrecisionHighAccuracy))
    .toEqual(firstRes);
  expect(trys.trys).toBe(1);

  const secondRes = createCalcScoreEvalOut = ({
    inpScore: lowPrecisionHighAccuracy,
    accColor: 'green',
    precStatus: 'bad',
    precStatusColor: 'red',
    message:
      'Your precision is too low to use the program properly, ' +
      'please calibrate again, or proceed.',
    proceedBtnActivated: true
  });
  expect(evaluateCalibrationScore(lowPrecisionHighAccuracy))
    .toEqual(firstTry);
  expect(trys.trys).toBe(2);
});


