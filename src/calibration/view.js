import {createPos} from '../data_types.js';
import {createElementFromHTML} from '../util/browser.js';

import {html} from 'common-tags';

import '../../assets/css/calibration.css';
import '../../assets/css/style.css';

const getGazeTarget = ({
  targetsContainer = document.createElement('div'),
  targetPos = createPos({x: 50, y: 50}),
  radius=15
} = {}) => {
  return createElementFromHTML(html`
    <button style="width:${2 * radius}px;
                   height:${2 * radius}px;
                   left:${targetPos.x}%;
                   top:${targetPos.y}%;"
            class="gazeTarget"
    >
      <div class="innerGazeTarget">
    </button>
  `, targetsContainer);
};

const getGazeTargetsContainer = ({
  root = document.body,
  id = 'calibrationContainer'
} = {}) => {
  return createElementFromHTML(html`
    <div id=${id} class=${'gazeTargetsContainer'}>
    </div>
  `, root);
};

export {getGazeTarget, getGazeTargetsContainer};

