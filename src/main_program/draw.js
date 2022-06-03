function drawLines (lines, canvas) {
  clearCanvas(canvas)
  const canvasCtx = canvas.getContext('2d')
  for (const line of lines) {
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

/*
const createZoomedLine = ({line, viewport, zoom}) => {
  drawLine(canvasCtx, createLine({
   startPoint: createPos{
     x: line.startPoint.x * zoom.level.factor - zoom.canvasOffsetFactor *
}

const createUnzoomedLine = ({line, viewport, zoom}) => {
}

const drawLinesZoomed = ({lines, zoom}) => {
  clearCanvas({canvas, canvsCtx})
  for (const line of lines) {
    drawLine(canvasCtx, createLine({
      startPoint: createPos{
        x:
}
*/

export { drawLines }
