import { addPositions, createPos, scalePosByPos, scalePosByVal, subPositions } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'

// To solve problems with floating arithmetic. Snapping to edges of the
// canvas when the viewing window is close enough, is activated
const snapTolerance = 0.01 // 1% of screen widht

function canMoveLeft (zoom) {
  return zoom.canvasOffsetFactor.x > 0
}

function canMoveRight (zoom) {
  return zoom.canvasOffsetFactor.x < zoom.level.maxCanvasOffsetFactor
}

function canMoveUp (zoom) {
  return zoom.canvasOffsetFactor.y > 0
}

function canMoveDown (zoom) {
  return zoom.canvasOffsetFactor.y < zoom.level.maxCanvasOffsetFactor
}

function moveLeft (zoom) {
  const xNoBoundaries =
    zoom.canvasOffsetFactor.x - zoom.offsetFactorShiftAmount
  zoom.canvasOffsetFactor.x = moveOrSnapZero(xNoBoundaries)
  return zoom
}

function moveRight (zoom) {
  const xNoBoundaries =
    zoom.canvasOffsetFactor.x + zoom.offsetFactorShiftAmount
  zoom.canvasOffsetFactor.x = moveOrSnapMax({
    maxVal: zoom.level.maxCanvasOffsetFactor, posVal: xNoBoundaries
  })
  return zoom
}

function moveUp (zoom) {
  const yNoBoundaries =
    zoom.canvasOffsetFactor.y - zoom.offsetFactorShiftAmount
  zoom.canvasOffsetFactor.y = moveOrSnapZero(yNoBoundaries)
  return zoom
}

function moveDown (zoom) {
  const yNoBoundaries =
    zoom.canvasOffsetFactor.y + zoom.offsetFactorShiftAmount
  zoom.canvasOffsetFactor.y = moveOrSnapMax({
    maxVal: zoom.level.maxCanvasOffsetFactor, posVal: yNoBoundaries
  })
  return zoom
}

function canZoomIn (zoom) {
  return zoom.level.next !== null
}

function canZoomOut (zoom) {
  return zoom.level.prev !== null
}

function zoomIn (zoom) {
  if (zoom.level.next) {
    const zoomFactor = zoom.level.factor
    const nxtLevelZoomFactor = zoom.level.next.factor
    const offsetFactorChange = zoomLevelTransitionOffsetChange({
      higherZoomFactor: nxtLevelZoomFactor,
      lowerZoomFactor: zoomFactor
    })
    zoom.canvasOffsetFactor.x += offsetFactorChange
    zoom.canvasOffsetFactor.y += offsetFactorChange
    zoom.level = zoom.level.next
  }
  return zoom
}

function zoomOut (zoom) {
  if (zoom.level.prev) {
    if (zoom.level.prev.factor === 1.0) {
      zoom.canvasOffsetFactor = createPos({ x: 0, y: 0 })
    } else {
      const zoomFactor = zoom.level.factor
      const prevLevelZoomFactor = zoom.level.prev.factor
      const offsetFactorChange = zoomLevelTransitionOffsetChange({
        higherZoomFactor: zoomFactor,
        lowerZoomFactor: prevLevelZoomFactor
      })
      const offsetFactorXNoBoundaries =
        zoom.canvasOffsetFactor.x - offsetFactorChange
      const offsetFactorYNoBoundaries =
        zoom.canvasOffsetFactor.y - offsetFactorChange
      zoom.canvasOffsetFactor.x = moveOrSnapZero(offsetFactorXNoBoundaries)
      zoom.canvasOffsetFactor.y = moveOrSnapZero(offsetFactorYNoBoundaries)
    }
    zoom.level = zoom.level.prev
  }
  return zoom
}

function moveOrSnapZero (posVal) {
  return posVal >= 0 + snapTolerance ? posVal : 0
}

function moveOrSnapMax ({ maxVal, posVal }) {
  return posVal <= maxVal - snapTolerance ? posVal : maxVal
}

function zoomLevelTransitionOffsetChange ({
  higherZoomFactor,
  lowerZoomFactor
}) {
  return (higherZoomFactor - lowerZoomFactor) / 2
}

function zoomPos (pos, zoom) {
  return subPositions(
    scalePosByVal(pos, zoom.level.factor),
    scalePosByPos(zoom.canvasOffsetFactor, getViewport())
  )
}

function unzoomPos (pos, zoom) {
  return addPositions(
    scalePosByVal(pos, 1 / zoom.level.factor),
    scalePosByPos(zoom.canvasOffsetFactor, getViewport())
  )
}

export {
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canMoveDown,
  canZoomIn,
  canZoomOut,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  unzoomPos,
  zoomIn,
  zoomOut,
  zoomPos
}
