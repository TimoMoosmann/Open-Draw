import {createPos} from '../data_types.js';
import {createElementFromHTML, vh, vw} from '../util/browser.js';

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

const fitCanvasToContainer = canvas => {
  canvas.style.width ='100%';
  canvas.style.height='100%';
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

const getDrawingCanvas = parentEl => {
  const canvasContainer = createElementFromHTML(html`
    <div id="canvasContainer">
      <canvas id="drawingCanvas">
      </canvas>
    </div>
  `, parentEl);
  const canvas = document.getElementById('drawingCanvas');
  fitCanvasToContainer(canvas);
  return canvasContainer;
};

const getDrawingPage = parentEl => {
  return getDrawingCanvas(parentEl);
};

export {getDrawingPage, getMainMenuPage};
