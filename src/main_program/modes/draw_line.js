import { scalePosByVal } from 'Src/data_types/pos.js'
import { createEllipse, inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { drawLine, redraw } from 'Src/main_program/draw.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { runTwoStepDwellDetection } from 'Src/main_program/dwell_detection/two_step_dwell_detection.js'
import { unzoomPos } from 'Src/main_program/zoom.js'
import { clearScreenPointListeners } from 'Src/util/main.js'

import {
  drawStateDwellDuration, lookStateDwellDuration,
  markPointHalfSize, markPointStrokeProperties,
  safetyEllipseLineDash, safetyEllipseStrokeProperties
} from 'Settings'

function getDrawLineMode () {
  return new DrawLineMode()
}

class DrawLineMode {
  active = true

  start (app) {
    app.showBackgroundGrid(true)

    const drawState = {
      safetyEllipse: false,
      startPoint: false,
      endPoint: false
    }
    if (!this.active) return
    this.#draw(app, drawState)

    runTwoStepDwellDetection({
      app,
      dispersionThreshold: app.dispersionThreshold,
      firstStepDurationThreshold: lookStateDwellDuration,
      secondStepDurationThreshold:
        lookStateDwellDuration + drawStateDwellDuration,
      onFirstStep: dwellPoint => this.#onDwellDuringLookState({
        app, drawState, dwellPoint
      }),
      onSecondStep: dwellPoint => this.#onDwellDuringDrawState({
        app, drawState, dwellPoint
      })
    })
  }

  #onDwellDuringLookState ({ app, drawState, dwellPoint }) {
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
    if (!this.active) return
    this.#draw(app, drawState)
  }

  #onDwellDuringDrawState ({
    app, drawState, dwellPoint
  }) {
    if (dwellPoint) {
      if (drawState.endPoint) {
        app.state.lines.push(createLine({
          startPoint: unzoomPos(drawState.startPoint, app.state.zoom),
          endPoint: unzoomPos(drawState.endPoint, app.state.zoom),
          strokeProperties: createStrokeProperties({
            color: app.state.newLineProperties.color,
            lineWidth:
              app.state.newLineProperties.lineWidth
          })
        }))
        app.state.linesBuffer = JSON.parse(JSON.stringify(app.state.lines))
        app.state.linesBufferIdx = app.state.linesBuffer.length - 1
        activateMode(app, getMainMenuClosedMode(app))
        return
      } else {
        drawState.safetyEllipse = createEllipse({
          center: drawState.startPoint,
          radii: scalePosByVal(
            app.settings.getSafetyEllipseSize(app.accuracy),
            1 / 2
          )
        })
      }
    } else {
      if (drawState.endPoint) {
        drawState.endPoint = false
      } else if (!drawState.safetyEllipse) {
        drawState.startPoint = false
      }
    }
    if (!this.active) return
    this.#draw(app, drawState)
  }

  #draw (app, drawState) {
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
      const newLinePreviewProperties = createStrokeProperties(
        app.state.newLineProperties
      )
      newLinePreviewProperties.lineWidth =
          newLinePreviewProperties.lineWidth * app.state.zoom.level.factor
      drawLine(createLine({
        startPoint: drawState.startPoint,
        endPoint: drawState.endPoint,
        strokeProperties: newLinePreviewProperties
      }), ctx)
    }
  }

  stop (app) {
    app.showBackgroundGrid(false)
    clearScreenPointListeners(app.webgazer, app.mouseListeners)
    app.drawingCanvas.clear()
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

export { getDrawLineMode }
