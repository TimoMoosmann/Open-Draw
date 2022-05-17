const checkSetErrMsg = ({arg, checkFunction, errMsg}) => {
  const getErrMsg = () => errMsg;
  checkForTypeErr({arg, checkFunction, getErrMsg});
};

const checkAddArgNameToErrMsg = ({arg, argName, checkFunction}) => {
  const getErrMsg = err => argName + ': ' + err.message;
  checkForTypeErr({arg, checkFunction, getErrMsg});
};

const checkForTypeErr = ({
  arg,
  checkFunction,
  getErrMsg,
}) => {
  try {
    checkFunction(arg);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new TypeError(getErrMsg(err));
    } else {
      throw err;
    }
  }
};

export { checkAddArgNameToErrMsg, checkSetErrMsg };

