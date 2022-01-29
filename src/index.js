import {nineTargetsCalibrationFiveTargetsValidation} from './calibration/main.js';
import {createPos} from './data_types.js';
import {setupWebgazer} from './setup_webgazer/main.js';
import {setWebgazerVideo, showWebgazerVideoWhenFaceIsNotDetected} from './webgazer_extensions/setup.js';

function setupWebgazerTestApplication() {
  //webgazerTestView();
  webgazer.showPredictionPoints(true);

  const ctx = createCanvasWholeScreen();

  let potentialFixationPoints = [];

  const durationThreshold = 200;
  const dispersionThreshold = 200;
  const maxDwellDuration = 2000;


  const onFixationDetectDwell = (fixationCenter, fixationDuration) => {
    testDwellMode(ctx, fixationCenter, fixationDuration);
    if (fixationDuration >= 1000) {
      console.log('dwell at: ' + fixationCenter);
    }
  };

  webgazer.setGazeListener(function(data, elapsedTime) {

    const currentPoint = {x: data.x, y: data.y, elapsedTime: elapsedTime};
    idtFixationDetection(currentPoint, potentialFixationPoints, maxDwellDuration,
      dispersionThreshold, durationThreshold, onFixationDetectDwell);
  }).resume();

  webgazer.showPredictionPoints(true);
}

function webgazerTestViewToCalibrationProcess() {
  webgazerTestView(document.body)
  let button = document.createElement('button');
  button.innerText = "weiter";
  button.addEventListener('click', () => {
      calibrationRun(setupWebgazerTestApplication);
  });
  document.body.appendChild(button);
}

var endWebgBtn = () => {
var btn = document.createElement('button');
btn.addEventListener('click', () => {
  webgazer.end();
});
btn.innerText = 'End Webgazer'
document.body.appendChild(btn);
}

const main = async () => {
  const webgazerLocal = webgazer;
  await setupWebgazer({
    webgazer: webgazerLocal,
    root: document.body
  });
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal);
  //await nineTargetsCalibrationFiveTargetsValidation(webgazerLocal);
  //console.log('calibrationDone');
}

main();

