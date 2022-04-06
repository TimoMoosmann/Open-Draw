import {runClickCalibration, runGazeCalibration} from './calibration/main.js';
import {createPos} from './data_types.js';
import {runMainProgram} from './main_program/main.js';
import {setupWebgazer} from './setup_webgazer/main.js';
import {setWebgazerVideo, showWebgazerVideoWhenFaceIsNotDetected} from './webgazer_extensions/setup.js';

const main = async () => {
  const webgazerLocal = webgazer;
  await setupWebgazer({
    webgazer: webgazerLocal,
    mouseModeOn: true,
    root: document.body,
    showPredictionPoints: true
  });
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal);
  await runGazeCalibration({numTargets: 5, webgazer: webgazerLocal});

  // Sized Thresholds in html px
  const maxFixationDispersion = createPos({x: 100, y: 100});
  const minTargetRadii = createPos({x: 150, y: 100});

  // Min possible target size: 1/6 of screen width and height
  // Recommended target size 1/9 of screen width and heigth
  // Perfect target size: 1/12
  //
  // if accuracy not reaches the requirements for min possible:
  //  -> Ask for reacalibration
  // 
  
  // Timed Thresholds
  const fixationDurationThreshold = 200;
  const dwellDurationThreshold = 1000;
  const webgazerBufferDuration = 500;
  const maxFixationDuration =
    2 * dwellDurationThreshold + webgazerBufferDuration;

  runMainProgram({
    dwellDurationThreshold,
    fixationDispersionThreshold: maxFixationDispersion,
    fixationDurationThreshold,
    maxFixationDuration,
    minTargetRadii,
    webgazer: webgazerLocal
  });
};

main();

