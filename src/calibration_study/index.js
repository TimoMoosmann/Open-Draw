import {getClickCalibrationInstructionsPage,
  getClickCalibrationIntroductionPage, getGazeCalibrationInstructionsPage,
  getGazeCalibrationIntroductionPage, getGreetingPage, getParticipantDataPage,
  getThankYouPage, getValidationInstructionsPage
} from './view.js';
import {createDetailedInformationGazeAtTargetData} from '../data_types.js';
import {getDrawGazeTargetCallback} from '../calibration/main.js';
import {getPatternCoordsInPct} from '../calibration/patterns.js';
import {getGazeTargetsContainer} from '../calibration/view.js';
import {setupWebgazer} from '../setup_webgazer/main.js';
import {popRandomItem} from '../util/main.js';
import {clickCalibration, gazeCalibration, validation} from '../webgazer_extensions/calibration.js';
import {showWebgazerVideoWhenFaceIsNotDetected} from '../webgazer_extensions/setup.js';

const setup = () => {
  let serverAddress;
  if (process.env.NODE_ENV === 'production') {
    serverAddress = 'https://open-draw-project.org/study';
  } else {
    serverAddress = 'http://localhost:3000'
  }
  return serverAddress;
};

const showPage = page => document.body.appendChild(page);

const doActionOnSubmitClicked = ({action, page}) => {
  page.querySelector("button[type=submit]").addEventListener('click', action);
};

const showPageUntilSubmit = async page => new Promise( resolve => {
  showPage(page);
  doActionOnSubmitClicked({
    page,
    action: () => {
      page.remove();
      resolve();
    }
  });
});

const showParticipantDataPageTillProtocolIsCreated = ({
  page, serverAddress
}) => {
  const participantDataForm = page.querySelector('form');
  return new Promise( resolve => {
    showPage(page);
    doActionOnSubmitClicked({
      page,
      action: (evt) => {
        evt.preventDefault(),
        createProtocol({
        onSuccess: protocolFileName => {
          page.remove();
          resolve(protocolFileName);
        },
        participantDataForm: page.querySelector('form'),
        serverAddress
        })
      }
    });
  });
};

const main = async() => {
  const serverAddress = setup();
  const webgazerLocal = webgazer;
  //await showPageUntilSubmit(getGreetingPage());
  const participantDataPage = getParticipantDataPage();
  const protocolFileName = await showParticipantDataPageTillProtocolIsCreated({
    page: participantDataPage,
    serverAddress
  });
  await setupWebgazer({
    webgazer: webgazerLocal,
    bigTitle: false,
    showPredictionPoints: true,
    title: 'Jetzt, richten sie noch ihre Kamera ein.'
  });
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal);

  let currentTaskNum = 1;
  //const targetsNums = [5, 9, 13];
  const targetsNums = [5, 9];
  //const calibrationTypes = ['clickCalibration', 'gazeCalibration'];
  const calibrationTypes = ['gazeCalibration'];
  const numTasks = targetsNums.length * calibrationTypes.length;
  const calibrationContainer = getGazeTargetsContainer(document.body);
  const numValidationTargets = 4;
  let calibrationType;
  while (calibrationType = popRandomItem(calibrationTypes)) {
    let calibrationProcedure;
    let calibrationTypeIntroduction;
    let getCalibrationTaskInstructionsPage;
    switch (calibrationType) {
      case 'clickCalibration':
        calibrationProcedure = async ({
          webgazer, gazeTargetsCoords, drawGazeTarget
        }) => {
          webgazer.addMouseEventListeners();
          await clickCalibration({
            webgazer,
            gazeTargetsCoords,
            drawGazeTarget
          });
          webgazer.removeMouseEventListeners();
        };
        calibrationTypeIntroduction = getClickCalibrationIntroductionPage();
        getCalibrationTaskInstructionsPage =
          getClickCalibrationInstructionsPage;
        break;
      case 'gazeCalibration':
        calibrationProcedure = gazeCalibration;
        calibrationTypeIntroduction = getGazeCalibrationIntroductionPage();
        getCalibrationTaskInstructionsPage = getGazeCalibrationInstructionsPage;
        webgazer.removeMouseEventListeners();
        break;
      default:
        throw new Error(`No Calibration type: ${calibrationType} available.`);
    }
    await showPageUntilSubmit(calibrationTypeIntroduction);
    currentTaskNum = await tasksForTypeConduction({
      calibrationProcedure,
      calibrationType,
      getCalibrationTaskInstructionsPage,
      currentTaskNum,
      drawGazeTarget: getDrawGazeTargetCallback(calibrationContainer),
      numTasks,
      numValidationTargets,
      protocolFileName,
      serverAddress,
      targetsNums: [...targetsNums],
      webgazer: webgazerLocal
    });
  }
  calibrationContainer.remove();
  document.body.appendChild(getThankYouPage());
};

const tasksForTypeConduction = async ({
  calibrationProcedure,
  calibrationType,
  getCalibrationTaskInstructionsPage,
  currentTaskNum,
  drawGazeTarget,
  numTasks,
  numValidationTargets,
  protocolFileName,
  serverAddress,
  targetsNums,
  webgazer
}) => {
  while (targetsNums.length > 0) {
    const numCalibrationTargets = popRandomItem(targetsNums);
    const calibrationTargets = getPatternCoordsInPct({
      numTargets: numCalibrationTargets, type: 'calibration'
    });
    const validationTargets = getPatternCoordsInPct({
      numTargets: numValidationTargets, type: 'validation'
    });
    await showPageUntilSubmit(getCalibrationTaskInstructionsPage({
      currentTaskNum, numTasks, numTargets: numCalibrationTargets
    }));
    webgazer.clearData();
    await calibrationProcedure({
      webgazer,
      gazeTargetsCoords: calibrationTargets,
      drawGazeTarget
    });
    await showPageUntilSubmit(getValidationInstructionsPage(
      numValidationTargets
    ));
    const validationData = await validation({
      webgazer,
      gazeTargetsCoords: validationTargets,
      drawGazeTarget
    })
    // send validation data to server
    appendResultsToProtocol({
      calibrationType,
      numCalibrationTargets,
      protocolFileName,
      serverAddress,
      validationData
    });
    currentTaskNum += 1;
  }
  return currentTaskNum;
};

const createProtocol = ({
  onSuccess,
  participantDataForm,
  serverAddress
}) => {
  const invalidInputEl = document.getElementById('invalidInput');
  const serverErrorEl = document.getElementById('serverError');
  invalidInputEl.hidden = true;
  serverErrorEl.hidden = true;
  const createProtocolReq = new XMLHttpRequest();
  createProtocolReq.onreadystatechange = () => {
    if (createProtocolReq.readyState === 4) {
      switch (createProtocolReq.status) {
        case (200):
          const protocolFileName = JSON.parse(createProtocolReq.responseText).
            protocolFileName;
          onSuccess(protocolFileName);
          break;
        case (400):
          invalidInputEl.hidden = false;
          break;
        case (500):
          serverErrorEl.hidden = false;
          break;
      }
    }
  }
  createProtocolReq.open('POST', serverAddress + '/create-study-protocol');
  createProtocolReq.setRequestHeader(
    'Content-type', 'application/x-www-form-urlencoded');
  createProtocolReq.send(encodeFormAsURI(participantDataForm));
};

const appendResultsToProtocol = ({
  calibrationType,
  numCalibrationTargets,
  protocolFileName,
  serverAddress,
  validationData
}) => {
  const resultsReq = new XMLHttpRequest();
  resultsReq.open("POST", `${serverAddress}/append-validation-data-to-protocol`);
  resultsReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  resultsReq.send(JSON.stringify({
    calibrationType,
    numCalibrationTargets,
    protocolFileName,
    validationDataDetailedInformation: validationData.map(gazeAtTargetData => {
      return createDetailedInformationGazeAtTargetData(gazeAtTargetData);
    })
  }));
  console.log(JSON.stringify({
    calibrationType,
    numCalibrationTargets,
    validationDataDetailedInformation: validationData.map(gazeAtTargetData => {
      return createDetailedInformationGazeAtTargetData(gazeAtTargetData);
    })
  }));

};

const encodeFormAsURI = form => {
  const encodedDataPairs = [];
  form.querySelectorAll('input').forEach((input) => {
    encodedDataPairs.push(encodeURIComponent(input.id) + '='
      + encodeURIComponent(input.value));
  });
  return encodedDataPairs.join('&').replace(/%20/g, '+');
}

main();

