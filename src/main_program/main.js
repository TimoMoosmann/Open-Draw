import {startDrawLineMode} from './draw_line_mode.js';
import {getDwellBtnContainer, getDwellBtnDomEl, getMainMenuPage} from './view.js';
import {createDwellBtn, createEllipse, inEllipse, createLine, createPos} from '../data_types.js';
import {createElementFromHTML, drawDotOnScreen, getElementCenter, getElementRadii, vh, vw} from '../util/browser.js';
import {runWebgazerFixationDetection} from '../webgazer_extensions/fixation_detection.js';
import {setWebgazerGazeDotColor} from '../webgazer_extensions/setup.js';

import {html} from 'common-tags';

/*
const getDwellBtns = () => [
  createDwellBtn({
    centerPosRel: createPos({x: 25, y: 25}),
    domId: 'testBtnUpperLeft',
    label: 'Upper Left',
    size: createPos({x: 200, y: 150}),
    timeTillActivation: 1000,
    action: () => alert('pushed upper left button'),
    viewport: createPos({x: vw(), y: vh()})
  }),
  createDwellBtn({
    centerPosRel: createPos({x: 75, y: 75}),
    domId: 'testBtnlowerRight',
    label: 'Lower Right',
    size: createPos({x: 300, y: 250}),
    timeTillActivation: 1500,
    action: () => alert('pushed lower right button'),
    viewport: createPos({x: vw(), y: vh()})
  })
];
*/

const runMainProgram = ({
  dwellDurationThreshold,
  fixationDispersionThreshold,
  fixationDurationThreshold,
  maxFixationDuration,
  minTargetRadii,
  webgazer
}) => {

  /*
  const container = getDwellBtnContainer();
  document.body.appendChild(container);
  for (const dwellBtn of getDwellBtns()) {
    container.appendChild(getDwellBtnDomEl(dwellBtn));
  }
  */

  const lines = [];
  const runFixationDetectionFixedThresholds = onFixation => {
    return runWebgazerFixationDetection({
      dispersionThreshold: fixationDispersionThreshold,
      durationThreshold: fixationDurationThreshold,
      maxFixationDuration,
      onFixation,
      webgazer
    });
  };

  const actionOnDwellFixedThreshold = ({btnList, fixation}) => actionOnDwell({
    btnList, fixation, dwellDurationThreshold
  });

  mainMenuPage({
    actionOnDwellFixedThreshold,
    dwellDurationThreshold,
    lines,
    minTargetRadii,
    runFixationDetectionFixedThresholds
  });

  /*
  startDrawLineMode({
    dwellDurationThreshold,
    lines,
    minTargetRadii,
    runFixationDetectionFixedThresholds,
    webgazer
  });
  */
};

const drawLines = ({canvas, canvasCtx, lines}) => {
  clearCanvas({canvas, canvasCtx});
  for (const line of lines) {
    drawLine(canvasCtx, line);
  }
};

/*
const createZoomedLine = ({line, viewport, zoom}) => {
  drawLine(canvasCtx, createLine({
   startPoint: createPos{
     x: line.startPoint.x * zoom.level.factor - zoom.canvasOffsetFactor * 
}

const createUnzoomedLine = ({line, viewport, zoom}) => {
};

const drawLinesZoomed = ({lines, zoom}) => {
  clearCanvas({canvas, canvsCtx});
  for (const line of lines) {
    drawLine(canvasCtx, createLine({
      startPoint: createPos{
        x: 
};
*/

const clearCanvas = ({canvas, canvasCtx}) => {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawLine = ({canvasCtx, line}) => {
  canvasCtx.strokeStyle = line.properties.color;
  canvasCtx.lineWidth = line.properties.lineWidth;
  canvasCtx.beginPath();
  canvasCtx.moveTo(line.startPoint.x, line.startPoint.y);
  canvasCtx.lineTo(line.endPoint.x, line.endPoint.y);
  canvasCtx.stroke();
};

const mainMenuPage = ({
  actionOnDwellFixedThreshold,
  dwellDurationThreshold,
  lines,
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  webgazer
}) => {
  const mainMenuPage = getMainMenuPage();
  document.body.append(mainMenuPage);
  const dwellBtnList = Array.from(mainMenuPage.querySelectorAll('button')).map(
    btn => {
      // TODO: Reset from btn.id to btn.name
      const btnAction = getDwellBtnAction({
        dwellBtnId: btn.id,
        dwellDurationThreshold,
        lines,
        mainMenuPage,
        minTargetRadii,
        runFixationDetectionFixedThresholds,
        webgazer
      });
      btn.addEventListener('click', btnAction);
      const btnEllipse = createEllipse({
        center: getElementCenter(btn),
        radii: getElementRadii(btn)
      });
      return {action: btnAction, ellipse: btnEllipse};
    }
  );
  runFixationDetectionFixedThresholds(fixation => actionOnDwellFixedThreshold({
    btnList: dwellBtnList, fixation
  }));
}

const actionOnDwell = ({btnList, fixation, dwellDurationThreshold}) => {
  if (fixation.duration >= dwellDurationThreshold) {
    for (let btn of btnList) {
      if (inEllipse({ellipse: btn.ellipse, pos: fixation.center})) {
        btn.action();
        break;
      }
    }
  }
};

//const createDwellBtn = ({action, ellipse}) => ({action, ellipse});

// Dwell Button Specs
// Width, Height
// (Position)
// Action
// activationTime
// (Symbol / Icon)

const getDwellBtnAction = ({
  dwellBtnId,
  dwellDurationThreshold,
  lines,
  mainMenuPage,
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  webgazer
}) => {
  switch (dwellBtnId) {
    case 'drawBtn':
      return () => {
        mainMenuPage.remove();
        startDrawLineMode({
          dwellDurationThreshold,
          lines,
          minTargetRadii,
          runFixationDetectionFixedThresholds,
          webgazer
        });
      };
    case 'moveBtn':
      return () => alert('Move Button');
    case 'editBtn':
      return () => alert('Edit Button');
    case 'colorBtn':
      return () => alert('Color Button');
    default:
      throw new Error('No Action defined for button with ID: ' + dwellBtnId);
  }
}

const gazeAtDwellBtns = ({
  dwellBtns,
  fixation,
  currentBtn,
  onGazeAtBtn
}) => {
  for (const dwellBtn of dwellBtns) {
    if(fixation && inEllipse({
      ellipse: dwellBtn.ellipse,
      pos: fixation.center
    })) {
      currentBtn.btnId = dwellBtn.domId;
      if (fixation.duration >= dwellBtn.timeTillActivation) {
        if (currentBtn.progressInPct < 100) {
          currentBtn.progressInPct = 100;
          dwellBtn.action();
        }
      } else {
        currentBtn.progressInPct = Math.round(
          (fixation.duration / dwellBtn.timeTillActivation) * 100
        );
      }
      onGazeAtBtn(currentBtn);
    } else {
      if (currentBtn.btnId !== false) {
        currentBtn.progressInPct = 0;
        onGazeAtBtn(currentBtn);
        currentBtn.btnId = false;
      }
    }
  }
};

/*
 * Maybe implement later, see tests
 *
const boundingRectsOverlap(boundingRects) {
  while (boundingRects.length > 1) {
    const boundingRect = boundingRects.pop;
    if boundingRectsOverlapSingle(boundingRect, boundingRects) {
      return true;
    }
  }
  return false;
}

const boundingRectsOverlapSingle = (boundingRect, boundingRects) => {
  for (let compareBounding of boundingRects) {
    return boundingRect.x &&
}

const verifyDwellBtns = dwellBtns => {
  dwellBtns.map
};
*/

export {drawLine, drawLines, gazeAtDwellBtns, runMainProgram};
