import {createPos} from '../data_types.js';
import {createElementFromHTML} from '../util/browser.js';

import {html} from 'common-tags';

import '../../assets/css/calibration.css';
import '../../assets/css/style.css';

const getGazeTarget = ({
  targetsContainer,
  targetPos = createPos({x: 50, y: 50}),
  radius=15
} = {}) => createElementFromHTML(html`
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
`, targetsContainer);

const getGazeTargetsContainer = (id="") => createElementFromHTML(html`
  <div id="${id}" class="gazeTargetsContainer">
  </div>
`);

export {getGazeTarget, getGazeTargetsContainer};

