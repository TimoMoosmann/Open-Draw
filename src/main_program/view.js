import {createElementFromHTML} from '../util/browser.js';

import {html} from 'common-tags';

import '../assets/css/style.css';
import '../assets/css/main.css';
import '../assets/css/main_menu.css';

const getMainMenuPage = () => createElementFromHTML(html`
  <!doctype html>
  <html>
  <head>
    <meta charset="utf8">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/main_program.css">
    <link rel="stylesheet" href="../css/main_menu.css">
    <title>Open Draw</title>
  </head>
  <body>
    <div id="mainMenuContainer">
      <button id="drawBtn" class="dwellBtn">
        <h2>Draw</h2>
      </button>
      <button id="moveBtn" class="dwellBtn">
        <h2>Move & Zoom</h2>
      </button>
      <button id="editBtn" class="dwellBtn">
        <h2>Edit</h2>
      </button>
      <button id="colorBtn" class="dwellBtn">
        <h2>Color</h2>
      </button>
    </div>
  </body>
  </html>
`);

export {getMainMenuPage};

