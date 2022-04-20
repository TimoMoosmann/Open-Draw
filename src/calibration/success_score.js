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

const getCalibrationScoreEvaluation = () => {};

export {calcCalibrationScore};
