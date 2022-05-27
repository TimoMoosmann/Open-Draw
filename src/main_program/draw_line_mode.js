import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { drawLine, drawLines } from 'Src/main_program/main.js'
import { getDrawingCanvasInContainer } from 'Src/main_program/view.js'
import { createPos } from 'Src/data_types/pos.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { setWebgazerGazeDotColor } from 'Src/webgazer_extensions/setup/main.js'

function startDrawLineMode ({
  drawStateGazeDotColors = createDrawStateGazeDotColors({
    drawing: 'red', looking: 'green'
  }),
  dwellDurationThreshold,
  lines,
  newLineProperties = createStrokeProperties({ color: 'gray', lineWidth: 4 }),
  minTargetRadii,
  runFixationDetectionFixedThresholds,
  safetyEllipseProperties = createStrokeProperties({
    color: 'black', lineWidth: 2
  }),
  startPointRadii = createPos({ x: 20, y: 20 }),
  startPointColor = 'orange',
  webgazer
}) {

  // TODO fix drawing
  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  const canvas = document.getElementById('drawingCanvas')
  const canvasCtx = canvas.getContext('2d')
  const drawState = {
    name: 'looking',
    safetyEllipse: null,
    startPoint: null,
    endPoint: null
  }
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
    })
  }

  runFixationDetectionFixedThresholds(fixation => {
    setWebgazerGazeDotColor(drawStateGazeDotColors[drawState.name])
    switch (drawState.name) {
      case 'looking':
        onFixationDuringLookingState({
          canvasCtx,
          drawDrawStateFixedArguments,
          drawState,
          dwellDurationThreshold,
          fixation
        })
        break
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
        })
        break
      default:
        throw new Error(drawState.name + ' is not a valid draw state name.' +
          'drawState.name needs to be either "looking", or "drawing".'
        )
    }
  })

  // Show gaze dot
  // Go back to the main menu.
}

function onFixationDuringLookingState ({
  canvasCtx,
  drawDrawStateFixedArguments,
  drawState,
  drawStateGazeDotColors,
  dwellDurationThreshold,
  fixation
}) {
  if (fixation.duration >= dwellDurationThreshold) {
    drawState.name = 'drawing'
    if (drawState.startPoint && drawState.safetyEllipse) {
      if (
        fixation.duration >= dwellDurationThreshold &&
        !inEllipse({ ellipse: drawState.safetyEllipse, pos: fixation.center })
      ) {
        drawState.endPoint = fixation.center
        drawDrawStateFixedArguments()
      }
    } else {
      drawState.startPoint = fixation.center
      drawDrawStateFixedArguments()
    }
  }
}

function onFixationDuringDrawingState ({
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
}) {
  if (fixation.duration >= 2 * dwellDurationThreshold) {
    if (drawState.endPoint) {
      lines.push(createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        properties: newLineProperties
      }))
      alert('done with drawing')
      // returning back to main mainu
      // drawLinePage.remove()
      // remove webgazer gazeListener
    } else {
      drawState.safetyEllipse = createEllipse({
        center: drawState.startPoint, radii: minTargetRadii
      })
      drawDrawStateFixedArguments()
      drawState.name = 'looking'
    }
  } else if (fixation.duration < dwellDurationThreshold) {
    drawState.name = 'looking'
    if (drawState.endPoint) {
      drawState.endPoint = null
    }
  }
}

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
  drawLines({ canvas, canvasCtx, lines })
  if (drawState.startPoint) {
    fillEllipse({
      canvasCtx,
      color: startPointColor,
      ellipse: createEllipse({
        center: drawState.startPoint,
        radii: startPointRadii
      })
    })
  }
  if (drawState.safetyEllipse) {
    strokeEllipse({
      canvasCtx,
      properties: safetyEllipseProperties,
      ellipse: drawState.safetyEllipse
    })
  }
  if (drawState.endPoint) {
    drawLine({
      canvasCtx,
      line: createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        properties: newLineProperties
      })
    })
  }
}

function beginEllipse ({ canvasCtx, ellipse }) {
  canvasCtx.beginPath()
  canvasCtx.ellipse(
    ellipse.center.x, ellipse.center.y, ellipse.radii.x, ellipse.radii.y,
    0, 0, 2 * Math.PI
  )
}

function fillEllipse ({ canvasCtx, color, ellipse }) {
  canvasCtx.fillStyle = color
  beginEllipse({ canvasCtx, ellipse })
  canvasCtx.fill()
}

function strokeEllipse ({ canvasCtx, color, ellipse, properties }) {
  canvasCtx.strokeStyle = properties.color
  canvasCtx.lineWidth = properties.lineWidth
  beginEllipse({ canvasCtx, ellipse })
  canvasCtx.stroke()
}

/*
function drawLineLightColor ({ canvasCtx, line }) {
  canvasCtx.globalAlpha = 0.5
  drawLine({ canvasCtx, line })
  canvasCtx.globalAlpha = 1
}
*/

// Dot Colors
function createDrawStateGazeDotColors ({ drawing, looking }) {
  return {
    drawing, looking
  }
}

export { startDrawLineMode }
