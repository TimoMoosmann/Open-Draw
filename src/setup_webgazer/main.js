import {getSetupInstructionsPage} from './view.js';
import {createPos} from '../data_types.js';
import {attachWebgazerVideo, detachWebgazerVideo, initWebgazer} from '../webgazer_extensions/setup.js';

const setupWebgazer = ({
  webgazer,
  bigTitle = true,
  language = 'german',
  mouseModeOn = false,
  root = document.body,
  showPredictionPoints = false,
  title = 'Open Draw'
} = {}) => {
  return new Promise(resolve => { 
    console.log('hello from the setup webgazer function');
    const videoSize = createPos({x: 320, y: 240});
    const page = getSetupInstructionsPage({
      bigTitle,
      language,
      title,
      videoSize
    });
    root.appendChild(page);
    webgazer.clearData();
    initWebgazer({
      webgazer,
      mouseModeOn,
      onFaceDetectionStatusChanged: faceDetected => {
        document.body.onclick = faceDetected ? () => {
          document.body.appendChild(
            document.getElementById('webgazerVideoContainer')
          );
          page.remove();
          resolve();
        } : () => {};
      },
      onVideoAvailable: videoContainer => {
        attachWebgazerVideo({
          videoContainer,
          parentNode: document.getElementById('videoFrame')
        });
      },
      showPredictionPoints: true,
      videoSize,
    });
  });
};

export {setupWebgazer}

