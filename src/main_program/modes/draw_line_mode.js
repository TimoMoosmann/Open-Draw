import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { drawLine, drawLines } from 'Src/main_program/main.js'
import { createPos } from 'Src/data_types/pos.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { addCanvasToRootAndDrawLines } from 'Src/main_program/util.js'
import { setWebgazerGazeDotColor } from 'Src/webgazer_extensions/setup/main.js'

import {
  drawModeDwellDuration, drawStateGazeDotColors, lookModeDwellDuration
} from 'Settings'

function startDrawLineMode ({
  app,
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

  const canvas = addCanvasToRootAndDrawLines(app)

  const drawState = {
    mode: 'looking',
    safetyEllipse: false,
    startPoint: false,
    endPoint: false
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
    // draw drawState
  })

  // Show gaze dot
  // Go back to the main menu.
}

function onFixationDuringLookingState (drawState, fixation) {
  if (fixation.duration >= lookModeDwellDuration) {
    drawState.mode = 'drawing'
    if (drawState.safetyEllipse) {
      if (
        // The second point of a line needs to be outside of the safetyEllipse
        // because only then it is clear that the user is actually looking
        // at another point on the screen.
        !inEllipse(fixation.center, drawState.safetyEllipse)
      ) {
        drawState.endPoint = fixation.center
      }
    } else {
      drawState.startPoint = fixation.center
    }
  }
}

function onFixationDuringDrawingState ({
  app,
  drawLinePage,
  drawState,
  dwellDurationThreshold,
  fixation,
  lines,
  minTargetRadii,
  newLineProperties,
  webgazer
}) {
  if (fixation.duration >= lookModeDwellDuration + drawModeDwellDuration) {
    if (drawState.endPoint) {
      app.state.lines.push(createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        strokeProperties: createStrokeProperties({
          color: app.state.color,
          lineWidth: app.state.lineWidth
        })
      }))
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
  // clearCanvas
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
