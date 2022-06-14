import { scalePosByVal } from 'Src/data_types/pos.js'
import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { drawLine, redraw } from 'Src/main_program/draw.js'
import { startMainMenuClosedMode } from 'Src/main_program/main.js'
// import { unzoomPos } from 'Src/main_program/zoom.js'
import { runTwoStepDwellDetection } from 'Src/main_program/dwell_detection/two_step_dwell_detection.js'
import { setWebgazerGazeDotColor } from 'Src/webgazer_extensions/setup/main.js'

import {
  drawStateDwellDuration, lookStateDwellDuration,
  markPointHalfSize, markPointStrokeProperties,
  safetyEllipseLineDash, safetyEllipseStrokeProperties,
  standardGazeDotColor
} from 'Settings'

function startDrawLineMode (app) {
  if (!app.eyeModeOn) {
    window.alert('Only available when eyeMode is on.')
    startMainMenuClosedMode(app)
  }
  redraw(app)

  const drawState = {
    mode: 'looking',
    safetyEllipse: false,
    startPoint: false,
    endPoint: false,
    done: false
  }

  runTwoStepDwellDetection({
    dispersionThreshold: app.dispersionThreshold,
    firstStepDurationThreshold: lookStateDwellDuration,
    secondStepDurationThreshold:
      lookStateDwellDuration + drawStateDwellDuration,
    onFirstStep: dwellPoint => onDwellDuringLookState({
      app, drawState, dwellPoint
    }),
    onSecondStep: dwellPoint => onDwellDuringDrawState({
      app, drawState, dwellPoint
    }),
    webgazer: app.webgazer
  })
}

function onDwellDuringLookState ({ app, drawState, dwellPoint }) {
  console.log('look state')
  if (drawState.safetyEllipse) {
    if (
      // The second point of a line needs to be outside of the safetyEllipse
      // because only then it is clear that the user is actually looking
      // at another point on the screen.
      !inEllipse(dwellPoint, drawState.safetyEllipse)
    ) {
      drawState.endPoint = dwellPoint
    }
  } else {
    drawState.startPoint = dwellPoint
  }
  drawDrawState({ app, drawState })
}

function onDwellDuringDrawState ({
  app, drawState, dwellPoint
}) {
  if (dwellPoint) {
    if (drawState.endPoint) {
      app.state.lines.push(createLine({
        startPoint: scalePosByVal(
          drawState.startPoint, 1 / app.state.zoom.level.factor
        ),
        endPoint: scalePosByVal(drawState.endPoint, 1 / app.state.zoom.level.factor),
        strokeProperties: app.state.newLineProperties
      }))
      endDrawLineMode(app)
      return
    } else {
      drawState.safetyEllipse = createEllipse({
        center: drawState.startPoint,
        radii: scalePosByVal(app.minGazeTargetSize, 1 / 2)
      })
    }
  } else {
    if (drawState.endPoint) {
      drawState.endPoint = false
    } else if (!drawState.safetyEllipse) {
      drawState.startPoint = false
    }
  }
  drawDrawState({ app, drawState })
}

function endDrawLineMode (app) {
  app.drawingCanvas.clear()
  app.webgazer.clearGazeListener()
  setWebgazerGazeDotColor(standardGazeDotColor)
  startMainMenuClosedMode(app)
}

const drawDrawState = ({
  app,
  drawState
}) => {
  redraw(app)
  const ctx = app.drawingCanvas.canvasDomEl.getContext('2d')
  const drawMarkPoint = center => drawCross({
    ctx,
    center,
    halfSize: markPointHalfSize,
    strokeProperties: markPointStrokeProperties
  })

  if (drawState.startPoint) drawMarkPoint(drawState.startPoint)

  if (drawState.safetyEllipse) {
    strokeEllipse({
      ctx,
      ellipse: drawState.safetyEllipse,
      lineDash: safetyEllipseLineDash,
      strokeProperties: safetyEllipseStrokeProperties
    })
  }

  if (drawState.endPoint) {
    // preview Line
    drawMarkPoint(drawState.endPoint)
    const newLinePreviewProperties = app.state.newLineProperties
    newLinePreviewProperties.lineWidth =
      scalePosByVal(
        newLinePreviewProperties.lineWidth, app.state.zoom.level.factor
      )
    drawLine(createLine({
      startPoint: drawState.startPoint,
      endPoint: drawState.endPoint,
      strokeProperties: newLinePreviewProperties
    }), ctx)
  }
}

function drawCross ({
  ctx, center, halfSize, strokeProperties
}) {
  ctx.strokeStyle = strokeProperties.color
  ctx.lineWidth = strokeProperties.lineWidth
  ctx.beginPath()
  ctx.moveTo(
    center.x - halfSize.x,
    center.y - halfSize.y
  )
  ctx.lineTo(
    center.x + halfSize.x,
    center.y + halfSize.y
  )
  ctx.moveTo(
    center.x + halfSize.x,
    center.y - halfSize.y
  )
  ctx.lineTo(
    center.x - halfSize.x,
    center.y + halfSize.y
  )
  ctx.stroke()
}

function strokeEllipse ({ ctx, ellipse, lineDash, strokeProperties }) {
  ctx.strokeStyle = strokeProperties.color
  ctx.lineWidth = strokeProperties.lineWidth
  ctx.setLineDash(lineDash)
  ctx.beginPath()
  ctx.ellipse(
    ellipse.center.x, ellipse.center.y, ellipse.radii.x, ellipse.radii.y,
    0, 0, 2 * Math.PI
  )
  ctx.stroke()
  ctx.setLineDash([])
}

export { startDrawLineMode }
