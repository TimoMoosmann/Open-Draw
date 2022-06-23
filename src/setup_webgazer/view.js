import { createPos } from 'Src/data_types/pos.js'
import { createElementFromHTML } from 'Src/util/browser.js'

import { html } from 'common-tags'

import '../../assets/css/style.css'
import '../../assets/css/setup.css'

function getSetupInstructionsPage ({
  bigTitle = true,
  language = 'german',
  title = 'Welcome to Open Draw',
  videoSize = createPos({ x: 320, y: 240 })
} = {}) {
  const titleHTML = bigTitle ? `<h1>${title}</h1>` : `<h2>${title}</h2>`
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
  `)
}

function getSetupInstructions (language = 'german') {
  switch (language) {
    case 'english':
      return [
        'Please <b>give camera permissions</b> to our application.',
        '<b>Wait</b> until you see the camera view (can take up to 60s).',
        '<b>Center your head in the camera view</b> until it turns green.',
        'When you are ready to start, <b>click on the screen</b>.'
      ]
    case 'german':
      return [
        'Bitte <b>erlauben sie die Kameranutzung</b> für diese Anwendung',
        '<b>Warten sie</b> bis das Kamerabild erscheint' +
          ' (kann bis zu 60s dauern)',
        '<b>Zentrieren sie ihren Kopf im Kamerabild</b>, ' +
          'bis der Rahmen grün wird',
        'Wenn sie bereit sind, <b>klicken sie irgendwo auf den Bilschirm</b>'
      ]
    default:
      throw new Error(`Language: ${language} is not available.`)
  }
}

function getGazePoint () {
  return createElementFromHTML(html`
    <div id="gazePoint"></div>
  `)
}

export {
  getGazePoint,
  getSetupInstructionsPage
}
