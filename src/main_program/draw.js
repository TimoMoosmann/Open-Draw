import { scalePosByPos, scalePosByVal, subPositions } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'

function redraw (app) {
  app.drawingCanvas.drawLines(app.state.lines, app.state.zoom)
}

function drawLinesOnCanvas (lines, canvas, zoom = false) {
  clearCanvas(canvas)
  const canvasCtx = canvas.getContext('2d')
  for (let line of lines) {
    if (zoom) {
      line = getZoomedLine(line, zoom)
    }
    drawLine(line, canvasCtx)
  }
}

function clearCanvas (canvas) {
  const canvasCtx = canvas.getContext('2d')
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawLine (line, canvasCtx) {
  canvasCtx.strokeStyle = line.strokeProperties.color
  canvasCtx.lineWidth = line.strokeProperties.lineWidth
  canvasCtx.beginPath()
  canvasCtx.moveTo(line.startPoint.x, line.startPoint.y)
  canvasCtx.lineTo(line.endPoint.x, line.endPoint.y)
  canvasCtx.stroke()
}

function zoomPos (pos, zoom) {
  return subPositions(
    scalePosByVal(pos, zoom.level.factor),
    scalePosByPos(zoom.canvasOffsetFactor, getViewport())
  )
}

function getZoomedLine (line, zoom) {
  const newStrokeProperties = createStrokeProperties(line.strokeProperties)
  newStrokeProperties.lineWidth =
    line.strokeProperties.lineWidth * zoom.level.factor
  return createLine({
    startPoint: zoomPos(line.startPoint, zoom),
    endPoint: zoomPos(line.endPoint, zoom),
    strokeProperties: newStrokeProperties
  })
}

export {
  clearCanvas,
  drawLinesOnCanvas,
  redraw
}
