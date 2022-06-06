/* global MutationObserver, webgazer */
import { createFaceDetector } from 'Src/webgazer_extensions/setup/data_types/face_detector.js'
import { createPos } from 'Src/data_types/pos.js'
import { vw } from 'Src/util/browser.js'

function initWebgazer ({
  webgazer,
  gazeListener = (gazeData, elapsedTime) => {},
  onFaceDetectionStatusChanged = faceDetected => {},
  onVideoAvailable = videoContainer => {},
  clearData = true,
  mouseModeOn = false,
  showVideo = true,
  showPredictionPoints = false,
  startFaceDetector = true,
  videoPosition = createPos({ x: 0, y: 0 }),
  videoSize = createPos({ x: 320, y: 240 })
} = {}) {
  startElementCreationObserver({
    elementId: 'webgazerVideoContainer',
    onCreated: videoContainer => {
      onVideoAvailable(videoContainer)
      setWebgazerVideo({
        pos: videoPosition,
        size: videoSize,
        videoContainer
      })
    }
  })
  startElementCreationObserver({
    elementId: 'webgazerFaceFeedbackBox',
    onCreated: faceFeedbackBox => {
      webgazer.faceDetector = createFaceDetector({
        faceFeedbackBox,
        onDetectionStatusChanged: onFaceDetectionStatusChanged
      })
      if (startFaceDetector) webgazer.faceDetector.start()
      if (!mouseModeOn) webgazer.removeMouseEventListeners()
      if (clearData) webgazer.clearData()
    }
  })
  webgazer.setGazeListener(gazeListener)
  webgazer.showVideo(showVideo)
  webgazer.showPredictionPoints(showPredictionPoints)
  webgazer.begin()
}

function startElementCreationObserver ({
  elementId = 'id',
  onCreated = (element) => {}
}) {
  const observer = new MutationObserver(() => {
    const element = document.getElementById(elementId)
    if (element) {
      onCreated(element)
      observer.disconnect()
    }
  })
  observer.observe(document.body, { subtree: true, childList: true })
}

function setWebgazerVideo ({
  pos = createPos({ x: 0, y: 0 }),
  size = createPos({ x: 320, y: 240 }),
  webgazerVideoContainer = document.getElementById('webgazerVideoContainer')
} = {}) {
  webgazerVideoContainer.style.left = `${pos.x}px`
  webgazerVideoContainer.style.top = `${pos.y}px`
  webgazer.setVideoViewerSize(size.x, size.y)
}

function attachWebgazerVideo ({
  videoContainer = document.getElementById('webgazerVideoContainer'),
  parentNode = document.createElement('div')
}) {
  videoContainer.style.position = 'absolute'
  parentNode.appendChild(videoContainer)
}

function detachWebgazerVideo (webgazerVideoContainer) {
  webgazerVideoContainer.position = 'fixed'
  document.body.appendChild(webgazerVideoContainer)
}

function showWebgazerVideoWhenFaceIsNotDetected (webgazer) {
  const videoContainer = document.getElementById('webgazerVideoContainer')
  const videoWidth = parseInt(window.getComputedStyle(videoContainer)
    .getPropertyValue('width')
  )
  setWebgazerVideo({
    videoContainer,
    pos: createPos({
      x: vw() - videoWidth,
      y: 0
    })
  })
  webgazer.faceDetector.onDetectionStatusChanged = faceDetected => {
    webgazer.showVideo(!faceDetected)
  }
  webgazer.faceDetector.start()
}

function setWebgazerGazeDotColor (color) {
  const gazeDot = document.getElementById('webgazerGazeDot')
  if (gazeDot) {
    gazeDot.style.backgroundColor = color
  } else {
    throw new Error(
      'Webgazer GazeDot is not available, which probably this means that ' +
      'Webgazer is not available.'
    )
  }
}

export {
  attachWebgazerVideo, detachWebgazerVideo, initWebgazer,
  setWebgazerGazeDotColor, setWebgazerVideo,
  showWebgazerVideoWhenFaceIsNotDetected
}
