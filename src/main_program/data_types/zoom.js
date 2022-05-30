import { createPos } from 'Src/data_types/pos.js'
import { createZoomLevels } from 'Src/main_program/data_types/zoom_levels.js'

function createZoom ({ offsetFactorShiftAmount, zoomFactors }) {
  return {
    level: createZoomLevels(zoomFactors.map(zoomFactor => zoomFactor / 2)),
    canvasOffsetFactor: createPos({ x: 0, y: 0 }),
    offsetFactorShiftAmount
  }
}

export {
  createZoom
}
