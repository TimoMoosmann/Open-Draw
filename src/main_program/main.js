import { startDrawLineMode } from './draw_line_mode.js'
import { arrangeOneBtnToLowerRight } from './dwell_btn_patterns.js'
import {
  getDrawingCanvasInContainer, getDwellBtnContainer, getDwellBtnDomEl,
  getMainMenuPage, getMainProgramContainer
} from './view.js'
import {
  createDwellBtn, createEllipse, createLine, createStrokeProperties,
  inEllipse, createPos
} from '../data_types.js'
import {
  createElementFromHTML, drawDotOnScreen, getElementCenter, getElementRadii, vh, vw
} from '../util/browser.js'
import {
  runWebgazerFixationDetection
} from '../webgazer_extensions/fixation_detection.js'
import { setWebgazerGazeDotColor } from '../webgazer_extensions/setup.js'

import openMenuIcon from '../../assets/img/open_menu.png'

/*
const getMainMenuDwellBtns () => {
  return [
    getStartDrawModeDwellBtn(), getStartZoomModeDwellBtn(),
    getStartColorChooserDwellBtn(),
};
*/

const startMainProgram = ({
  minTargetSize
}) => {
  const mainProgramContainer = getMainProgramContainer()
  
  const testLines = [
    createLine({
      startPoint: createPos({ x: 0, y: 0 }),
      endPoint: createPos({ x: 200, y: 200 }),
      strokeProperties: createStrokeProperties({
        color: 'blue',
        lineWidth: 2
      })
    })
  ]

  document.body.appendChild(mainProgramContainer)

  startMainMenuClosedScreen({
    lines: testLines,
    minTargetSize,
    root: mainProgramContainer
  })
}

const startMainMenuClosedScreen = ({
  lines,
  minTargetSize,
  root,
  standardTimeTillActivation = 1000
}) => {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => alert('open Main menu now.'),
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: minTargetSize,
    timeTillActivation: standardTimeTillActivation,
    title: 'Open Menu'
  });

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn,
    minDistToEdge: getMinDistToEdge(),
    viewport: createPos({x: vw(), y: vh()})
  });

  const dwellBtnContainer = getDwellBtnContainer()
  dwellBtnContainer.appendChild(getDwellBtnDomEl(
    arrangedOpenMainMenuDwellBtn
  ))

  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  
  root.appendChild(dwellBtnContainer)
  root.appendChild(drawingCanvasContainer)
  drawingCanvas.drawLines(lines)
}

const getMinDistToEdge = () => createPos({
  x: vw() * (1 / 10),
  y: vh() * (1 / 10)
})

const runMainProgram = ({
  dwellDurationThreshold,
  fixationDispersionThreshold,
  fixationDurationThreshold,
  maxFixationDuration,
  minTargetRadii,
  webgazer
}) => {

  const container = getDwellBtnContainer();
  document.body.appendChild(container);
  for (const dwellBtn of getDwellBtns()) {
    container.appendChild(getDwellBtnDomEl(dwellBtn));
  }

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

const drawLines = ({drawingCanvas, lines}) => {
  const ctx = drawingCanvas.getContext('2d');
  clearCanvas(drawingCanvas);
  for (const line of lines) {
    drawLine({ ctx, line });
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

const clearCanvas = canvas => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawLine = ({ctx, line}) => {
  ctx.strokeStyle = line.strokeProperties.color;
  ctx.lineWidth = line.strokeProperties.lineWidth;
  ctx.beginPath();
  ctx.moveTo(line.startPoint.x, line.startPoint.y);
  ctx.lineTo(line.endPoint.x, line.endPoint.y);
  ctx.stroke();
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

export {drawLine, drawLines, gazeAtDwellBtns, startMainProgram};
