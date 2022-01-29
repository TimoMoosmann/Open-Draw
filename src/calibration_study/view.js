import {createElementFromHTML} from '../util/browser.js';

import {html, oneLine, oneLineTrim} from 'common-tags';

import '../../assets/css/calibration_study.css';
import '../../assets/css/style.css';

const getGreetingPage = () => {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer">
      <h3>Herzlich Willkommen zu meiner Webcam Eyetracking Kalibrierungsstudie.</h3>
      <p>
        Diese Studie findet im Rahmen meiner Bachelorarbeit statt. Das Ziel ist es malen mit den Augen, mithilfe einer
        Webcam zu ermöglichen.<br>
        Insgesamt besteht die Studie aus sechs kleinen "Durchgängen".<br>
        In den ersten drei Durchgängen müssen sie auf Ziele klicken.
        In den letzten drei Durchgängen starren sie einfach auf die Mitte der Ziele.<br>
        Die Aufgeben werden nochmal genauer beschrieben.<br>
        Das Teilnehmen an der Studie sollte maximal 10 Minuten dauren.
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
  `);
};

const getParticipantDataPage = () => {
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
            Entschuldigung, bei der Anwendung ist etwas schief gelaufen.
            </em></p>
        </div>
        <div id="submitHolder">
          <button type="submit">Weiter</button>
        </div>
      </form>
    </div>
  `);
};

const getThankYouPage = () => {
  return createElementFromHTML(html`
    <div id="calibrationStudyTextContainer" class="
      centeredContent contentCenteredVertically
    ">
      <h2>Das wars! Vielen Dank für deine Teilnahme.</h2>
    </div>
  `);
};

const getTypeIntroductionPage = ({taskName, introductionLines}) => {
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
  `);
}

const getClickCalibrationIntroductionPage = () => {
  return getTypeIntroductionPage({
    taskName: 'Klickkalibrierung',
    introductionLines: [
      oneLine`Bei der Klickkalibrierung müssen sie nacheinander auf die
       erscheinenden Ziele klicken.
      `,
      `Am Ende folgt noch eine Validierung.`
    ]
  });
};

const getGazeCalibrationIntroductionPage = () => {
  return getTypeIntroductionPage({
    taskName: 'Blickkalibrierung',
    introductionLines: [
      oneLine`Bei der Blickkalibrierung müssen sie nacheinander auf die
       erscheinenden Ziele starren.
      `,
      `Am Ende folgt noch eine Validierung.`
    ]
  });
};


const getTaskInstructionsPage = ({title, instructions}) => {
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
  `);
}

const getClickCalibrationInstructionsPage = ({
  currentTaskNum, numTasks, numTargets
}) => {
  return getTaskInstructionsPage({
    title: oneLineTrim`
      (${currentTaskNum}/${numTasks}) Klickkalibrierung mit ${numTargets} Zielen
      `,
    instructions: [
      `Klicken sie nacheinander auf die Ziele`,
      `Schauen sie dabei auf die Mitte der Ziele`,
      `Halten sie den Kopf möglichst gerade.`,
    ]
  });
};

const getGazeCalibrationInstructionsPage = ({
  currentTaskNum, numTasks, numTargets
}) => {
  return getTaskInstructionsPage({
    title: oneLineTrim`
      (${currentTaskNum}/${numTasks}) Blickkalibrierung mit ${numTargets} Zielen
      `,
    instructions: [
      `Schauen sie auf die Mitte jedes Ziels.`,
      `Halten sie dabei den Kopf möglichst gerade.`,
    ]
  });
}

const getValidationInstructionsPage = numTargets => {
  return getTaskInstructionsPage({
    title: `Validierung mit ${numTargets} Zielen`,
    instructions: [
      `Schauen sie auf die Mitte jedes Ziels.`,
      `Halten sie dabei den Kopf möglichst gerade.`,
    ]
  });
}

export {getClickCalibrationInstructionsPage,
  getClickCalibrationIntroductionPage, getGazeCalibrationInstructionsPage,
  getGazeCalibrationIntroductionPage, getGreetingPage, getParticipantDataPage,
  getThankYouPage, getValidationInstructionsPage
};

