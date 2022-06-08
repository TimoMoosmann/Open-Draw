import { createPos } from 'Src/data_types/pos.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'

export const eyeModeOn = true

// 'click' or 'gaze'
export const calibrationType = 'click'
export const numCalibrationTargets = 5

export const minDistToEdgeInPct = createPos({ x: 7, y: 10 })
export const standardDwellBtnActivationTime = 1000
export const minFixationDuration = 200
export const maxFixationDuration =
  // TODO chnge back to 2x
  5 * standardDwellBtnActivationTime + minFixationDuration

// During line drawing there are two modes, "looking" and "drawing",
// each indicated by the color of a gazeDot.
export const drawStateGazeDotColors = {
  drawing: 'orange',
  looking: 'green'
}
export const markPointHalfSize = createPos({ x: 20, y: 20 })
export const markPointStrokeProperties = createStrokeProperties({
  color: 'black',
  lineWidth: 2
})
// 5px line, 3px space
export const safetyEllipseLineDash = [5, 3]
export const safetyEllipseStrokeProperties = createStrokeProperties({
  color: 'black',
  lineWidth: 2
})

export const lookModeDwellDuration = 2000
// Normaly keep them equal.
export const drawModeDwellDuration = lookModeDwellDuration

export const colors = [
  '#0036FA', // Blue
  '#FA000C', // Red
  '#FFFC38', // Yellow
  '#0CFA00', // Green
  '#A800BA', // Purple,
  '#FF6905', // Orange
  '#000000', // Black
  '#909090' // Grey
]
export const defaultColor = colors[0]
