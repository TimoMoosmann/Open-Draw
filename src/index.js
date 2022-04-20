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
  await runClickCalibration({numTargets: 9, webgazer: webgazerLocal});

  // Sized Thresholds in html px
  const maxFixationDispersion = createPos({x: 150, y: 100});
  const minTargetRadii = createPos({x: 150, y: 100});
  
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

