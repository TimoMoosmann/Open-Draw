import {checkValidationData, createEvaluatedGazeAtTargetData} from '../data_types.js';

const getWorstRelAccAndPrec = validationData => {
  checkValidationData(validationData);
  let worstRelAcc, worstRelPrec;
  for (const gazeAtTargetData of validationData) {
    const {relAcc, relPrec} =
      createEvaluatedGazeAtTargetData(gazeAtTargetData);
    if (worstRelAcc === undefined) {
      worstRelAcc = relAcc;
      worstRelPrec = relPrec;
    } else {
      if (relAcc.x > worstRelAcc.x) worstRelAcc.x = relAcc.x;
      if (relAcc.y > worstRelAcc.y) worstRelAcc.y = relAcc.y;
      if (relPrec.x > worstRelPrec.x) worstRelPrec.x = relPrec.x;
      if (relPrec.y > worstRelPrec.y) worstRelPrec.y = relPrec.y;
    }
  }
  return {worstRelAcc, worstRelPrec};
};

export {
  getWorstRelAccAndPrec
};
