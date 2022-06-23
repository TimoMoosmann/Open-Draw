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

function getCalibrationInstructionPage (calibrationType) {
  let title = ''
  let instruction = 'ᐳ '
  switch (calibrationType) {
    case 'gaze':
      title = 'Kalibrierung'
      instruction += 'Halte dein Kopf gerade und schaue auf die Ziele.'
      break
    case 'validation':
      title = 'Überprüfung'
      instruction += 'Halte dein Kopf gerade und schaue auf die Ziele.'
      break
    case 'click':
      title = 'Kalibrierung'
      instruction += 'Halte dein Kopf gerade und klicke auf die Ziele.'
      break
    default:
      throw new TypeError(calibrationType + ' is no valid calibrationType.')
  }
  return createElementFromHTML(html`
    <div id="calibrationInstructionContainer">
      <h2>${title}</h2>
      <h2>${instruction}</h2>
    </div>
  `)
}

function getCalibrationScorePage ({
  calibrationScore,
  lang,
  onContinue,
  onRecalibrate
}) {
  const continueBtnState =
    calibrationScore.proceedBtnActive ? 'enabled' : 'disabled'

  const calibrationScorePage = createElementFromHTML(html`
    <div id="calibrationScoreContainer">
      <h2>
        ${(lang === 'de') ? 'Kalibrierungsauswertung' : 'Calibration Score'}
      </h2>
      <div id="calibrationScoreInnerTextContainer">
          <p>${(lang === 'de') ? 'Genauigkeit' : 'Accuracy'}: x:
            <span id="accScoreX">${calibrationScore.accScore.x}</span>%, y:
            <span id="accScoreY">${calibrationScore.accScore.y}</span>%</p>
          <p>${(lang === 'de') ? 'Stabilität' : 'Stability'}:
            <span id="precStatus">${calibrationScore.precStatus}</span></p>
          <p id="message">${calibrationScore.message}</p>
      </div>
      <div id="calibrationScoreButtonsContainer">
          <button id="continueBtn" ${continueBtnState}>
            ${(lang === 'de') ? 'Fortfahren' : 'Continue'}
          </button>
          <button id="recalibrateBtn">
            ${(lang === 'de') ? 'Rekalibrieren' : 'Recalibrate'}
          </button>
      </div>
    </div>
  `)

  calibrationScorePage.querySelector('#accScoreX').style.color =
    calibrationScore.accScoreColor.x
  calibrationScorePage.querySelector('#accScoreY').style.color =
    calibrationScore.accScoreColor.y
  calibrationScorePage.querySelector('#precStatus').style.color =
    calibrationScore.precStatusColor

  calibrationScorePage.querySelector('#continueBtn').addEventListener(
    'click', onContinue
  )
  calibrationScorePage.querySelector('#recalibrateBtn').addEventListener(
    'click', onRecalibrate
  )

  return calibrationScorePage
}

export {
  getCalibrationInstructionPage,
  getCalibrationScorePage,
  getGazeTarget,
  getGazeTargetsContainer
}
