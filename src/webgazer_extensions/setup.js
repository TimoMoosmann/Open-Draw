import {createPos} from '../data_types.js';
import {vh, vw} from '../util/browser.js';

const initWebgazer = ({
  webgazer,
  gazeListener = (gazeData, elapsedTime) => {},
  onFaceDetectionStatusChanged = faceDetected => {},
  onVideoAvailable = videoContainer => {},
  clearData = true,
  mouseModeOn = false,
  showVideo = true,
  showPredictionPoints = false,
  startFaceDetector = true,
  videoPosition = createPos({x: 0, y: 0}),
  videoSize = createPos({x: 320, y: 240})
} = {}) => {
  startElementCreationObserver({
    elementId: 'webgazerVideoContainer', 
    onCreated: videoContainer => {
      onVideoAvailable(videoContainer);
      setWebgazerVideo({
        pos: videoPosition,
        size: videoSize,
        videoContainer
      })
    }
  });
  startElementCreationObserver({
    elementId: 'webgazerFaceFeedbackBox', 
    onCreated: faceFeedbackBox => {
      webgazer.faceDetector = createFaceDetector({
        faceFeedbackBox,
        onDetectionStatusChanged: onFaceDetectionStatusChanged
      });
      if (startFaceDetector) webgazer.faceDetector.start();
      console.log(mouseModeOn);
      if (!mouseModeOn) webgazer.removeMouseEventListeners();
      if (clearData) webgazer.clearData();
    }
  });
  webgazer.setGazeListener(gazeListener);
  webgazer.showVideo(showVideo);
  webgazer.showPredictionPoints(showPredictionPoints);
  webgazer.begin();
}

const startElementCreationObserver = ({
  elementId = 'id',
  onCreated = (element) => {}
}) => {
  const observer = new MutationObserver(() => {
    let element;
    if (element = document.getElementById(elementId)) {
      onCreated(element);
      observer.disconnect();
    }
  });
  observer.observe(document.body, {subtree: true, childList: true});
}

const createFaceDetector = ({
  faceFeedbackBox = document.getElementById('webgazerFaceFeedbackBox'),
  onDetectionStatusChanged = isFaceDetected => {}
} = {}) => ({
  faceFeedbackBox,
  onDetectionStatusChanged,

  start() {
    let prevFaceDetected = this.isFaceDetected();
    this.observer = new MutationObserver((mutationsList) => {
      const faceDetected = this.isFaceDetected();
      if (prevFaceDetected !== faceDetected) {
        this.onDetectionStatusChanged(faceDetected);
        prevFaceDetected = faceDetected;
      }
    });
    this.observer.observe(this.faceFeedbackBox, {attributeFilter: ["style"]});
    // Initial call for not missing an event
    this.onDetectionStatusChanged(this.isFaceDetected());
  },

  stop() {
    this.observer.disconnect()
  },

  isFaceDetected() {
    return this.faceFeedbackBox.style.borderColor === 'green';
  }
});

const setWebgazerVideo =  ({
  pos = createPos({x: 0, y: 0}),
  size = createPos({x: 320, y: 240}),
  webgazerVideoContainer = document.getElementById('webgazerVideoContainer')
} = {}) => {
  webgazerVideoContainer.style.left = `${pos.x}px`;
  webgazerVideoContainer.style.top = `${pos.y}px`;
  webgazer.setVideoViewerSize(size.x, size.y);
}

const attachWebgazerVideo = ({
  videoContainer = document.getElementById('webgazerVideoContainer'),
  parentNode = document.createElement('div')
}) => {
  videoContainer.style.position = 'absolute';
  parentNode.appendChild(videoContainer);
}

const detachWebgazerVideo = webgazerVideoContainer => {
  webgazerVideoContainer.position = 'fixed';
  document.body.appendChild(webgazerVideoContainer);
};

const showWebgazerVideoWhenFaceIsNotDetected = webgazer => {
  const videoContainer = document.getElementById('webgazerVideoContainer');
  const videoWidth = parseInt(window.getComputedStyle(videoContainer)
    .getPropertyValue('width')
  );
  setWebgazerVideo({
    videoContainer,
    pos: createPos({
      x: vw() - videoWidth,
      y: 0
    }),
  });
  webgazer.faceDetector.onDetectionStatusChanged = faceDetected => {
    webgazer.showVideo(!faceDetected)
  };
  webgazer.faceDetector.start();
};

export {
  attachWebgazerVideo, detachWebgazerVideo, initWebgazer, setWebgazerVideo,
  showWebgazerVideoWhenFaceIsNotDetected
};

