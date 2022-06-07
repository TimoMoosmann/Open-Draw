import { createPos } from 'Src/data_types/pos.js'
import { createZoomLevels } from 'Src/main_program/data_types/zoom_levels.js'

function createZoom ({
  offsetFactorShiftAmount = 0.25,
  zoomFactors = [1.0, 1.5, 2.0, 3.0]
} = {}) {
  return {
    level: createZoomLevels(zoomFactors.map(zoomFactor => zoomFactor / 2)),
    canvasOffsetFactor: createPos({ x: 0, y: 0 }),
    offsetFactorShiftAmount
  }
}

export {
  createZoom
}
