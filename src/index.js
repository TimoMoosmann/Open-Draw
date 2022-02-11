import {fiveDotCalibration} from './calibration/main.js';
import {createPos} from './data_types.js';
import {setupWebgazer} from './setup_webgazer/main.js';
import {setWebgazerVideo, showWebgazerVideoWhenFaceIsNotDetected} from './webgazer_extensions/setup.js';

const main = async () => {
  const webgazerLocal = webgazer;
  await setupWebgazer({
    webgazer: webgazerLocal,
    root: document.body,
    showPredictionPoints: true
  });
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal);
  await nineTargetsCalibrationFiveTargetsValidation(webgazerLocal);
  webgazer.showPredictionPoints(true);

  const durationThreshold = 200;
  const dispersionThreshold = 200;
  runWebgazerDwellDetection({dispersionThreshol, durationThreshold});
}

main();

