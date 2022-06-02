import { createPos } from 'Src/data_types/pos.js'

export const eyeModeOn = true

// 'click' or 'gaze'
export const calibrationType = 'click'
export const numCalibrationTargets = 5

export const minDistToEdgeInPct = createPos({ x: 7, y: 10 })
export const standardDwellBtnActivationTime = 1000
export const minFixationDuration = 200
export const maxFixationDuration =
  2 * standardDwellBtnActivationTime + minFixationDuration

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
