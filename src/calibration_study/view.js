import { createElementFromHTML } from 'Src/util/browser.js'

import { html, oneLine, oneLineTrim } from 'common-tags'

import 'Assets/css/calibration_study.css'
import 'Assets/css/style.css'

function getGreetingPage () {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer">
      <h3>Herzlich Willkommen zu meiner Webcam Eyetracking Kalibrierungsstudie.</h3>
      <p>
        Im Rahmen meiner Bachelorarbeit versuche ich Erkentnisse über die
        Genaugikeit von Webcam Eye-Tracking zu gewinnen.
        Das Ziel ist es malen mit den Augen in einem Web Browser zu ermöglichen.
        <br>
        In sechs kleinen Durchgängen, absolvieren sie nacheinander,
        verschiedene Kalibrierungsprozesse. Am Ende von jedem Kalibrierungsprozess
        folgt eine kurze Validierung.<br>
        Die Aufgaben werden gleich noch genauer erklärt.
      </p>
      <p>
        <br>
        Vielen Dank für ihre Teilnahme,<br>
        Timo Moosmann
      </p>
      <div id="submitHolder">
        <button type="submit">Los geht's</button>
      </div>
    </div>
  `)
}

function getParticipantDataPage () {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer" class="contentCenteredVertically">
      <h2>Bitte füllen sie das Formular aus.</h2>
      <form>
        <div id="inputs">
          <div class="inputHolder">
            <label for="name">Vorname:</label>
            <input id="name"></input>
          </div>
          <div class="inputHolder">
            <label for="age">Alter:</label>
            <input id="age"></input>
          </div>
          <div class="inputHolder">
            <label for="eyeColor">Augenfarbe:</label>
            <input id="eyeColor"></input>
          </div>
        </div>
        <div>
          <p id="invalidInput" class="error" hidden><em>
            Entschuldigung, eine der Eingaben ist ungültig.</em></p>
          <p id="serverError" class="error" hidden><em>
            Entschuldigung, auf unserem Server ist etwas schief gelaufen.
            </em></p>
        </div>
        <div id="submitHolder">
          <button type="submit">Weiter</button>
        </div>
      </form>
    </div>
  `)
}

function getThankYouPage () {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer" class="
      centeredContent contentCenteredVertically
    ">
      <h2>Das wars! Vielen Dank für ihre Teilnahme.</h2>
    </div>
  `)
}

function getTypeIntroductionPage ({ taskName, introductionLines }) {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer" class="centeredContent">
      <h2>${taskName}</h2>
      <div class="text">
        ${introductionLines.map(line => `<p>${line}</p>`)}
      </div>
      <div id="submitHolder">
        <button type="submit">Weiter</button>
      </div>
    </div>
  `)
}

function getClickCalibrationIntroductionPage () {
  return getTypeIntroductionPage({
    taskName: 'Klickkalibrierung',
    introductionLines: [
      oneLine`Bei der Klickkalibrierung müssen sie nacheinander auf die
       erscheinenden Ziele klicken.
      `,
      'Am Ende folgt eine kurze Validierung.'
    ]
  })
}

function getGazeCalibrationIntroductionPage () {
  return getTypeIntroductionPage({
    taskName: 'Blickkalibrierung',
    introductionLines: [
      oneLine`Bei der Blickkalibrierung müssen sie nacheinander auf die
       erscheinenden Ziele starren.
      `,
      'Am Ende folgt eine kurze Validierung.'
    ]
  })
}

function getTaskInstructionsPage ({ title, instructions }) {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer">
      <h2>${title}</h2>
      <div class="text">
        <ul>
          ${instructions.map(instruction => `<li>${instruction}</li>`)}
        </ul>
      </div>
      <div id="submitHolder">
        <button type="submit">Los geht's</button>
      </div>
    </div>
  `)
}

function getClickCalibrationInstructionsPage ({
  currentTaskNum, numTasks, numTargets
}) {
  return getTaskInstructionsPage({
    title: oneLineTrim`
      (${currentTaskNum}/${numTasks}) Klickkalibrierung mit ${numTargets} Zielen
      `,
    instructions: [
      'Klicken sie nacheinander auf die Ziele.',
      'Schauen sie dabei auf die Mitte der Ziele.',
      'Halten sie den Kopf möglichst gerade.'
    ]
  })
}

function getGazeCalibrationInstructionsPage ({
  currentTaskNum, numTasks, numTargets
}) {
  return getTaskInstructionsPage({
    title: oneLineTrim`
      (${currentTaskNum}/${numTasks}) Blickkalibrierung mit ${numTargets} Zielen
      `,
    instructions: [
      'Schauen sie auf die Mitte jedes Ziels.',
      'Halten sie den Kopf möglichst gerade.'
    ]
  })
}

function getValidationInstructionsPage (numTargets) {
  return getTaskInstructionsPage({
    title: `Validierung mit ${numTargets} Zielen`,
    instructions: [
      'Schauen sie auf die Mitte jedes Ziels.',
      'Halten sie den Kopf möglichst gerade.'
    ]
  })
}

export {
  getClickCalibrationInstructionsPage,
  getClickCalibrationIntroductionPage,
  getGazeCalibrationInstructionsPage,
  getGazeCalibrationIntroductionPage,
  getGreetingPage,
  getParticipantDataPage,
  getThankYouPage,
  getValidationInstructionsPage
}
