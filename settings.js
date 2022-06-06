import { createPos } from 'Src/data_types/pos.js'

export const eyeModeOn = false

// 'click' or 'gaze'
export const calibrationType = 'click'
export const numCalibrationTargets = 5

export const minDistToEdgeInPct = createPos({ x: 7, y: 10 })
export const standardDwellBtnActivationTime = 1000
export const minFixationDuration = 200
export const maxFixationDuration =
  2 * standardDwellBtnActivationTime + minFixationDuration

// During line drawing there are two modes, "looking" and "drawing",
// each indicated by the color of a gazeDot.
export const drawStateGazeDotColors = {
  drawing: 'orange',
  looking: 'green'
}

export const lookModeDwellDuration = 700
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
