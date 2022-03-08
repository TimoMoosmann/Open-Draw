import {drawLine, drawLines} from './main.js';
import {getDrawingPage} from './view.js';
import {createDrawStateGazeDotColors, createEllipse, createLine, createPos, createStrokeProperties, inEllipse} from '../data_types.js';
import {setWebgazerGazeDotColor} from '../webgazer_extensions/setup.js';

const startDrawLineMode = ({
  drawStateGazeDotColors = createDrawStateGazeDotColors({
    drawing: 'red', looking: 'green'
  }),
  dwellDurationThreshold,
  lines,
  newLineProperties = createStrokeProperties({color: 'gray', lineWidth: 4}),
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  safetyEllipseProperties = createStrokeProperties({
    color: 'black', lineWidth: 2
  }),
  startPointRadii = createPos({x: 20, y:20}),
  startPointColor = 'orange',
  webgazer
}) => {
  const drawLinePage = getDrawingPage(document.body);
  const canvas = document.getElementById('drawingCanvas');
  const canvasCtx = canvas.getContext('2d');
  let drawState = {
    name: 'looking',
    safetyEllipse: null,
    startPoint: null,
    endPoint: null,
  };
  const drawDrawStateFixedArguments = () => {
    drawDrawState({
      canvas,
      canvasCtx,
      drawState, 
      lines,
      newLineProperties,
      safetyEllipseProperties,
      startPointColor,
      startPointRadii
    });
  };

  runFixationDetectionFixedThresholds(fixation => {
    setWebgazerGazeDotColor(drawStateGazeDotColors[drawState.name]);
    switch (drawState.name) {
      case 'looking':
        onFixationDuringLookingState({
          canvasCtx,
          drawDrawStateFixedArguments,
          drawState,
          dwellDurationThreshold,
          fixation
        });
        break;
      case 'drawing':
        onFixationDuringDrawingState({
          canvasCtx,
          drawDrawStateFixedArguments,
          drawLinePage,
          drawState,
          dwellDurationThreshold,
          lines,
          fixation,
          minTargetRadii,
          newLineProperties,
          webgazer
        });
        break;
      default:
        throw new Error(drawState.name + ' is not a valid draw state name.'
          + 'drawState.name needs to be either "looking", or "drawing".'
        );
    }
  });

  // Show gaze dot
  // Go back to the main menu.
};

const onFixationDuringLookingState = ({
  canvasCtx,
  drawDrawStateFixedArguments,
  drawState,
  drawStateGazeDotColors,
  dwellDurationThreshold,
  fixation,
}) => {
  if (fixation.duration >= dwellDurationThreshold) {
    drawState.name = 'drawing';
    if (drawState.startPoint && drawState.safetyEllipse) {
      if (
        fixation.duration >= dwellDurationThreshold &&
        !inEllipse({ellipse: drawState.safetyEllipse, pos: fixation.center})
      ) {
        drawState.endPoint = fixation.center;
        drawDrawStateFixedArguments();
      }
    } else {
      drawState.startPoint = fixation.center;
      drawDrawStateFixedArguments();
    }
  }
};

const onFixationDuringDrawingState = ({
  canvasCtx,
  drawDrawStateFixedArguments,
  drawLinePage,
  drawState,
  dwellDurationThreshold,
  fixation,
  lines,
  minTargetRadii,
  newLineProperties,
  webgazer
}) => {
  if (fixation.duration >= 2 * dwellDurationThreshold) {
    if (drawState.endPoint) {
      lines.push(createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        properties: newLineProperties
      }));
      alert("done with drawing");
      // returning back to main mainu
      // drawLinePage.remove();
      // remove webgazer gazeListener
    } else {
      drawState.safetyEllipse = createEllipse({
        center: drawState.startPoint, radii: minTargetRadii
      });
      drawDrawStateFixedArguments();
      drawState.name = 'looking';
    }
  } else if (fixation.duration < dwellDurationThreshold) {
    drawState.name = 'looking';
    if (drawState.endPoint) {
      drawState.endPoint = null;
    }
  }
};

const drawDrawState = ({
  canvas,
  canvasCtx,
  drawState, 
  lines,
  newLineProperties,
  safetyEllipseProperties,
  startPointColor,
  startPointRadii
}) => {
  drawLines({canvas, canvasCtx, lines});
  if (drawState.startPoint) {
    fillEllipse({
      canvasCtx,
      color: startPointColor,
      ellipse: createEllipse({
        center: drawState.startPoint,
        radii: startPointRadii
      })
    }); 
  }
  if (drawState.safetyEllipse) {
    strokeEllipse({
      canvasCtx,
      properties: safetyEllipseProperties,
      ellipse: drawState.safetyEllipse
    });
  }
  if (drawState.endPoint) {
    drawLine({
      canvasCtx,
      line: createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        properties: newLineProperties
      })
    });
  }
};

const beginEllipse = ({canvasCtx, ellipse}) => {
  canvasCtx.beginPath();
  canvasCtx.ellipse(
    ellipse.center.x, ellipse.center.y, ellipse.radii.x, ellipse.radii.y,
    0, 0, 2 * Math.PI
  );
};

const fillEllipse = ({canvasCtx, color, ellipse})  => {
  canvasCtx.fillStyle = color;
  beginEllipse({canvasCtx, ellipse});
  canvasCtx.fill();
};

const strokeEllipse = ({canvasCtx, color, ellipse, properties}) => {
  canvasCtx.strokeStyle = properties.color;
  canvasCtx.lineWidth = properties.lineWidth;
  beginEllipse({canvasCtx, ellipse});
  canvasCtx.stroke();
};

const drawLineLightColor = ({canvasCtx, line}) => {
  canvasCtx.globalAlpha = 0.5;
  drawLine({canvasCtx, line});
  canvasCtx.globalAlpha = 1;
};

export {startDrawLineMode};

