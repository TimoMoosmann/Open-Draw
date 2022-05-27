import { createPos } from 'Src/data_types/pos.js'
import { createElementFromHTML } from 'Src/util/browser.js'

import { html } from 'common-tags'

import '../../assets/css/calibration.css'
import '../../assets/css/calibration_score.css'
import '../../assets/css/style.css'

function getGazeTarget ({
  targetsContainer,
  targetPos = createPos({ x: 50, y: 50 }),
  radius = 15
} = {}) {
  return createElementFromHTML(html`
    <button style="width:${2 * radius}px;
                   height:${2 * radius}px;
                   left:${targetPos.x}%;
                   top:${targetPos.y}%;"
            class="gazeTarget"
    >
      <div class="gazeTargetCrossHor"></div>
      <div class="gazeTargetCrossVert"></div>
      <div class="gazeTargetInnerDot"></div>
    </button>
  `, targetsContainer)
}

function getGazeTargetsContainer (id = '') {
  return createElementFromHTML(html`
    <div id="${id}" class="gazeTargetsContainer">
    </div>
  `)
}

function getCalibrationScorePage (calibrationScore) {
  const continueBtnState =
    calibrationScore.proceedBtnActive ? 'enabled' : 'disabled'

  const calibrationScorePage = createElementFromHTML(html`
    <div id="calibrationScoreContainer">
      <h2>Calibration Score</h2>
      <div id="calibrationScoreInnerTextContainer">
          <p>Accuracy: x:
            <span id="accScoreX">${calibrationScore.accScore.x}</span>%, y:
            <span id="accScoreY">${calibrationScore.accScore.y}</span>%</p>
          <p>Disribution:
            <span id="precStatus">${calibrationScore.precStatus}</span></p>
          <p id="message">${calibrationScore.message}</p>
      </div>
      <div id="calibrationScoreButtonsContainer">
          <button ${continueBtnState}>
            Continue
          </button>
          <button>Recalibrate</button>
      </div>
    </div>
  `)

  calibrationScorePage.querySelector('#accScoreX').style.color =
    calibrationScore.accScoreColor.x
  calibrationScorePage.querySelector('#accScoreY').style.color =
    calibrationScore.accScoreColor.y
  calibrationScorePage.querySelector('#precStatus').style.color =
    calibrationScore.precStatusColor

  return calibrationScorePage
}

export { getCalibrationScorePage, getGazeTarget, getGazeTargetsContainer }
