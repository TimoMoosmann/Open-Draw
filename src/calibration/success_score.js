import {createPos} from '../data_types.js';

const calcCalibrationScore = ({acc, borderAcc, perfectAcc}) => {
  if (acc.x < perfectAcc.x) acc.x = perfectAcc.x;
  if (acc.y < perfectAcc.y) acc.y = perfectAcc.y;

  const onePctX = (borderAcc.x - perfectAcc.x) / 50;
  const onePctY = (borderAcc.y - perfectAcc.y) / 50;

  const pctFromPerfect = createPos({
    x: Math.round((acc.x - perfectAcc.x) / onePctX),
    y: Math.round((acc.y - perfectAcc.y) / onePctY),
  });
  return createPos({
    x: (pctFromPerfect.x > 100) ? 0 : 100 - pctFromPerfect.x,
    y: (pctFromPerfect.y > 100) ? 0 : 100 - pctFromPerfect.y,
  });
};

const evaluateCalibrationScore = ({
  borderAcc,
  perfectAcc,
  borderPrec,
  relAcc,
  relPrec,
  trys
}) => {
  const calibrationScore = calcCalibrationScore({
    acc: relAcc, borderAcc, perfectAcc
  });
  const minForGreen = 80;
  const minForYellow = 65;
  const minForOrange = 50;

  let accScoreColor = 'red';
  if (calibrationScore.x >= minForGreen && calibrationScore.y >= minForGreen) {
    accScoreColor = 'green';
  } else if (
    calibrationScore.x >= minForYellow && calibrationScore.y >= minForYellow
  ) {
    accScoreColor = 'yellow';
  } else if (
    calibrationScore.x >= minForOrange && calibrationScore.y >= minForOrange
  ) {
    accScoreColor = 'orange';
  }

  let precStatus = 'bad';
  let precStatusColor = 'red';
  if (relPrec.x <= borderPrec.x && relPrec.y <= borderPrec.y) {
    precStatus = 'good';
    precStatusColor = 'green';
  };
  let proceedBtnActive = true;
  let message = '';
  switch(accScoreColor) {
    case 'red':
      message += 'Your accuracy is too low to use the program properly.';
      break;
    case 'orange':
      message +=
        'Your accuracy is just enough to use the program.';
      break;
    case 'yellow':
      message += 'Your accuracy is good enough to use the program.';
      break;
    case 'green':
      message += 'Your accuracy is good.';
      break;
  }

  if (precStatusColor === 'red') {
    message = addToStringWithNewLine(
      message, 'Your precision is too low to use the program properly.'
    );
  }

  if (accScoreColor === 'red' || precStatusColor === 'red') {
    if (trys.trys > 0) {
      message = addToStringWithNewLine(
        message, 'Please calibrate again, or proceed with limited quality.'
      );
    } else {
      proceedBtnActive = false;
      message = addToStringWithNewLine(message, 'Please calibrate again.');
    }
  } else if (accScoreColor === 'orange' || accScoreColor === 'yellow') {
    message = addToStringWithNewLine(
      message, 'If you want an better experience, try to calibrate again.'
    );
  }

  trys.trys++;
  return createCalcScoreEvalOut({
    accScore: calibrationScore,
    accScoreColor,
    precStatus,
    precStatusColor,
    message,
    proceedBtnActive
  });
};

const addToStringWithNewLine = (str, appendStr) => {
  return (str.length > 0) ? str + '\n' + appendStr : appendStr;
}

const createCalcScoreEvalOut = ({
  accScore,
  accScoreColor,
  precStatus,
  precStatusColor,
  message,
  proceedBtnActive
}) => ({
  accScore,
  accScoreColor,
  precStatus,
  precStatusColor,
  message,
  proceedBtnActive
});

export {calcCalibrationScore, createCalcScoreEvalOut, evaluateCalibrationScore};
