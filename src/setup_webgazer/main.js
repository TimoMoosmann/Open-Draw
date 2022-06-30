import { getSetupInstructionsPage } from 'Src/setup_webgazer/view.js'
import { createPos } from 'Src/data_types/pos.js'
import {
  attachWebgazerVideo, initWebgazer, showWebgazerVideoWhenFaceIsNotDetected
} from 'Src/webgazer_extensions/setup/main.js'

const setupWebgazer = ({
  webgazer,
  bigTitle = true,
  lang = 'de',
  mouseModeOn = false,
  root,
  showVideoWhenFaceIsNotDetected = true,
  title = 'Open Draw'
} = {}) => {
  return new Promise(resolve => {
    const videoSize = createPos({ x: 320, y: 240 })
    const page = getSetupInstructionsPage({
      bigTitle,
      lang,
      title,
      videoSize
    })
    root.appendChild(page)
    webgazer.clearData()
    initWebgazer({
      webgazer,
      mouseModeOn,
      onFaceDetectionStatusChanged: faceDetected => {
        document.body.onclick = faceDetected
          ? () => {
              document.body.appendChild(
                document.getElementById('webgazerVideoContainer')
              )
              page.remove()

              if (showVideoWhenFaceIsNotDetected) {
                showWebgazerVideoWhenFaceIsNotDetected(webgazer)
              }
              resolve(webgazer)
            }
          : () => {}
      },
      onVideoAvailable: videoContainer => {
        attachWebgazerVideo({
          videoContainer,
          parentNode: document.getElementById('videoFrame')
        })
      },
      videoSize
    })
  })
}

export { setupWebgazer }
