import {createPos} from '../data_types.js';
import {createElementFromHTML} from '../util/browser.js';

import {html} from 'common-tags';

import '../../assets/css/style.css';
import '../../assets/css/setup.css';

const getSetupInstructionsPage = ({
  bigTitle = true,
  language = 'german',
  title = 'Welcome to Open Draw',
  videoSize = createPos({x: 320, y: 240})
} = {}) => {
let titleHTML = bigTitle ? `<h1>${title}</h1>` : `<h2>${title}</h2>`
  return createElementFromHTML(html`
    <div id="setupContainer">
      <div id="welcomeText" class="centeredContent">
        ${titleHTML}
      </div>
      <div id="videoFrameContainer" class="centeredContent">
        <div id="videoFrame" style="
          width: ${videoSize.x}px; height: ${videoSize.y}px;
        ">
        </div>
      </div>
      <div id="setupInstructions" class="centeredContent">
        <ol>
          ${getSetupInstructions(language).map(instruction =>
            `<li>${instruction}</li>`
          )}
        </ol>
      </div>
    </div>
  `);
}

const getSetupInstructions = (language = 'german') => {
  switch(language) {
    case 'english':
      return [
        'Please <b>give camera permissions</b> to our application.',
        '<b>Wait</b> until you see the camera view (can take up to 60s).',
        '<b>Center your head in the camera view</b> till it turns green.',
        'When you are ready to start, <b>click on the screen</b>.'
      ];
      break;
    case 'german':
      return [
        'Bitte <b>erlaube die Kameranutzung</b> für dies Anwendung',
        '<b>Warte</b> bis du das Kamerabild siehst (kann bis zu 60s dauern)',
        '<b>Zentriere dein Kopf im Kamerabild</b>, so dass there Rahmen grün wird',
        'Wenn du bereit bist, <b>Klicke irgendwo auf den Bilschirm</b>'
      ];
      break;
    default:
      throw new Error(`Language: ${language} is not available.`);
  }
}

export {getSetupInstructionsPage};

