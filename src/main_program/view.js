import {createElementFromHTML} from '../util/browser.js';

import {html} from 'common-tags';

import '../../assets/css/style.css';
import '../../assets/css/main_program.css';
import '../../assets/css/main_menu.css';

const getMainMenuPage = () => createElementFromHTML(html`
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
`);

export {getMainMenuPage};

