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

  runMainProgram({
    dwellDurationThreshold: 1500,
    fixationDispersionThreshold: createPos({x: 100, y: 100}),
    fixationDurationThreshold: 200,
    webgazer: webgazerLocal
  });
};

main();

