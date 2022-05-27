import { createPos } from 'Src/data_types/pos.js'
/*
 * [calibration_questions] which is often mentioned below,
 * refers to the study:
 * "Towards accurate eye tracker calibration – methods and procedures"
 * from Harezlak et. al.
 */

const fourTargetsVal = [
  createPos({ x: 20, y: 20 }),
  createPos({ x: 20, y: 80 }),
  createPos({ x: 80, y: 20 }),
  createPos({ x: 80, y: 80 })
]

// Pattern 6 from [calibration_question]
const fiveTargetsI = [
  createPos({ x: 10, y: 50 }),
  createPos({ x: 50, y: 10 }),
  createPos({ x: 50, y: 50 }),
  createPos({ x: 50, y: 90 }),
  createPos({ x: 90, y: 50 })
]

// Pattern 3 from [calibration_question]
const nineTargetsI = [
  createPos({ x: 10, y: 10 }),
  createPos({ x: 10, y: 90 }),
  createPos({ x: 25, y: 25 }),
  createPos({ x: 25, y: 75 }),
  createPos({ x: 50, y: 50 }),
  createPos({ x: 75, y: 25 }),
  createPos({ x: 75, y: 75 }),
  createPos({ x: 90, y: 10 }),
  createPos({ x: 90, y: 90 })
]

// Pattern 1 from [calibration_question]
const thirteenTargetsI = [
  createPos({ x: 10, y: 10 }),
  createPos({ x: 10, y: 50 }),
  createPos({ x: 10, y: 90 }),
  createPos({ x: 25, y: 25 }),
  createPos({ x: 25, y: 75 }),
  createPos({ x: 50, y: 10 }),
  createPos({ x: 50, y: 50 }),
  createPos({ x: 50, y: 90 }),
  createPos({ x: 75, y: 25 }),
  createPos({ x: 75, y: 75 }),
  createPos({ x: 90, y: 10 }),
  createPos({ x: 90, y: 50 }),
  createPos({ x: 90, y: 90 })
]

const activeCalibrationPatterns = [
  fiveTargetsI,
  nineTargetsI,
  thirteenTargetsI
]

const activeValidationPatterns = [
  fourTargetsVal
]

function getPattern (numTargets, patterns) {
  if (Number.isInteger(numTargets) && numTargets > 0) {
    const availablePatterns = patterns.filter(pattern => {
      return pattern.length === numTargets
    })
    if (availablePatterns.length > 0) {
      return [...(availablePatterns[0])]
    } else {
      throw new Error('No pattern with ' + numTargets + ' targets available.')
    }
  }
  throw new Error(
    'Parameter numTargets needs to be defined as a positive integer'
  )
}

function getPatternCoordsInPct ({
  type = 'calibration',
  numTargets = 9
} = {}) {
  switch (type) {
    case 'calibration':
      return getPattern(numTargets, activeCalibrationPatterns)
    case 'validation':
      return getPattern(numTargets, activeValidationPatterns)
    default:
      throw new TypeError(
        'Illegal type given. Type needs to be "calibration" or "validation"'
      )
  }
}

export { getPatternCoordsInPct }
