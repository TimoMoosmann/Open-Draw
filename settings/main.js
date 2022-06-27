import { addPositions, createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'

export const mainSettings = {
  /*
   * Main Settings
   */
  // Turn eyeMode off to just look around without using eye tracking.
  eyeModeOn: false,
  lang: 'de',

  /*
   * Dwell Detection Settings
   */
  // 'screenpoint' for a fixation based algorithm (saves some space),
  // 'bucket' for a target based algorithm (more stable)
  dwellBtnDetectionAlgorithm: 'bucket',
  getMinTargetSize: {
    bucket: (acc, prec) => scalePosByVal(
      addPositions(acc, scalePosByVal(prec, 1.5)), 2
    ),
    screenpoint: acc => scalePosByVal(acc, 3)
  },
  getDispersionThreshold: prec => scalePosByVal(prec, 3),
  targetSizeIsFixed: true,
  // Minimum Relative Accuracy to use the program properly
  borderAccRel: createPos({ x: 0.07, y: 0.14 }),
  // Relative Accuracy to reach a calibrationScore of 100%
  perfectAccRel: createPos({ x: 0.03, y: 0.06 }),
  // Minimum recommended Relative Precision
  borderPrecRel: createPos({ x: 0.06, y: 0.1 }),
  /*
   * DwellBtn Settings
   */
  useSimpleBtnPatterns: true,
  getDwellBtnBackgroundColor: alpha => {
    return `rgba(112, 128, 144, ${alpha})`
  },
  minDistToEdgeRel: createPos({ x: 0.05, y: 0.05 })
}

/*
 * Calibration Settings
 */
// 'click' or 'gaze'
export const calibrationType = 'gaze'
// 5, 9, or 13
export const numCalibrationTargets = 9
export const gazeTargetRadius = 35
// Gaze Calibration
export const gazeCalibrationTimeTillRecord = 1200
export const gazeCalibrationRecordDuration = 1300
export const gazeCalibrationRecordIntervalDuration = 200
// Validation
export const validationCaptureDuration = 1000
export const validationTimeTillCapture = gazeCalibrationTimeTillRecord
/*
 * DwellBtn Settings
 */
export const standardDwellBtnActivationTime = 1000
export const getDwellBtnBackgroundColor = alpha => {
  return `rgba(112, 128, 144, ${alpha})`
}

/*
 * Draw Line Mode Settings
 */
export const lookStateDwellDuration = 1000
export const drawStateDwellDuration = 1000
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
// Only important when gazeDot is activated during drawLineMode
export const drawStateGazeDotColors = {
  drawing: 'orange',
  looking: 'green'
}

/*
 * Line Settings
 */
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
export const defaultLineWidth = 2
export const maxLineWidth = 10

/*
 * Webgazer Settings
 */
export const standardGazeDotColor = 'blue'
export const gazeDotRefreshesPerSecond = 20