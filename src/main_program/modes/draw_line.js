import { scalePosByVal } from 'Src/data_types/pos.js'
import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { drawLine, redraw } from 'Src/main_program/draw.js'
import { startMainMenuClosedMode } from 'Src/main_program/main.js'
import { unzoomPos } from 'Src/main_program/zoom.js'
import { runWebgazerFixationDetection } from 'Src/webgazer_extensions/fixation_detection/main.js'
import { setWebgazerGazeDotColor } from 'Src/webgazer_extensions/setup/main.js'

import {
  drawModeDwellDuration, drawStateGazeDotColors, lookModeDwellDuration,
  markPointHalfSize, markPointStrokeProperties,
  minFixationDuration, maxFixationDuration,
  safetyEllipseLineDash, safetyEllipseStrokeProperties,
  standardGazeDotColor
} from 'Settings'

function startDrawLineMode (app) {
  if (!app.eyeModeOn) {
    window.alert('Only available when eyeMode is on.')
    startMainMenuClosedMode(app)
  }
  const drawState = {
    mode: 'looking',
    safetyEllipse: false,
    startPoint: false,
    endPoint: false,
    done: false
  }

  runWebgazerFixationDetection({
    dispersionThreshold: app.maxFixationDispersion,
    durationThreshold: minFixationDuration,
    maxFixationDuration,
    webgazer: app.webgazer,
    onFixation: fixation => {
      setWebgazerGazeDotColor(drawStateGazeDotColors[drawState.mode])
      switch (drawState.mode) {
        case 'looking':
          onFixationDuringLookingMode({ drawState, fixation })
          break
        case 'drawing':
          onFixationDuringDrawingMode({ app, drawState, fixation })
          break
        default:
          throw new Error(drawState.mode + ' is not a valid draw state name.' +
            'drawState.name needs to be either "looking", or "drawing".'
          )
      }
      drawDrawState({ app, drawState })

      if (drawState.done) {
        app.drawingCanvas.clear()
        app.webgazer.clearGazeListener()
        setWebgazerGazeDotColor(standardGazeDotColor)
        startMainMenuClosedMode(app)
      }
    }
  })
}

function onFixationDuringLookingMode ({ drawState, fixation }) {
  if (fixation.duration >= lookModeDwellDuration) {
    if (drawState.safetyEllipse) {
      if (
        // The second point of a line needs to be outside of the safetyEllipse
        // because only then it is clear that the user is actually looking
        // at another point on the screen.
        !inEllipse(fixation.center, drawState.safetyEllipse)
      ) {
        console.log(fixation)
        console.log(drawState.safetyEllipse)
        drawState.endPoint = fixation.center
        drawState.mode = 'drawing'
      }
    } else {
      drawState.startPoint = fixation.center
      drawState.mode = 'drawing'
    }
  }
}

function onFixationDuringDrawingMode ({
  app, drawState, fixation
}) {
  if (
    fixation.duration >= lookModeDwellDuration + drawModeDwellDuration &&
    !drawState.done
  ) {
    if (drawState.endPoint) {
      app.state.lines.push(createLine({
        startPoint: unzoomPos(drawState.startPoint, app.state.zoom),
        endPoint: unzoomPos(drawState.endPoint, app.state.zoom),
        strokeProperties: app.state.newLineProperties
      }))
    }
    if (drawState.endPoint) {
      app.state.lines.push(createLine({
        startPoint: scalePosByVal(
          drawState.startPoint, 1 / app.state.zoom.level.factor
        ),
        endPoint: scalePosByVal(drawState.endPoint, 1 / app.state.zoom.level.factor),
        strokeProperties: app.state.newLineProperties
      }))
      drawState.done = true
    } else {
      drawState.safetyEllipse = createEllipse({
        center: drawState.startPoint,
        radii: scalePosByVal(app.minGazeTargetSize, 1 / 2)
      })
      drawState.mode = 'looking'
    }
  } else if (fixation.duration < lookModeDwellDuration) {
    drawState.mode = 'looking'
    if (drawState.endPoint) {
      drawState.endPoint = false
    } else {
      drawState.startPoint = false
    }
  }
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
