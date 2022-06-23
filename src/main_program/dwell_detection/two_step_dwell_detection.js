import {
  checkPositiveNumericPos, getMaxXAndY, getMinXAndY, isPosLowerThanOrEqual,
  subPositions
} from 'Src/data_types/pos.js'
import { checkUnsignedInteger } from 'Src/data_types/numbers.js'
import { getCenterPoint } from 'Src/main_program/dwell_detection/util.js'
import { checkTimedGazePoint, createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { addGazeListener } from 'Src/webgazer_extensions/helper.js'

function runTwoStepDwellDetection ({
  dispersionThreshold,
  firstStepDurationThreshold,
  secondStepDurationThreshold,
  onFirstStep,
  onSecondStep,
  webgazer
}) {
  const dwellDetector = getTwoStepDwellDetector({
    dispersionThreshold,
    firstStepDurationThreshold,
    secondStepDurationThreshold
  })

  addGazeListener(webgazer, 'dwell_at_btn', (gazePoint, time) => {
    const { dwellPoint, step } = dwellDetector.step(
      createTimedGazePoint({ pos: gazePoint, time })
    )
    if (step) {
      if (step === 1) onFirstStep(dwellPoint)
      else if (step === 2) onSecondStep(dwellPoint)
    }
  })
}

function getTwoStepDwellDetector ({
  dispersionThreshold,
  firstStepDurationThreshold,
  secondStepDurationThreshold
}) {
  return new TwoStepDwellDetector({
    dispersionThreshold,
    firstStepDurationThreshold,
    secondStepDurationThreshold
  })
}

class TwoStepDwellDetector {
  constructor ({
    dispersionThreshold,
    firstStepDurationThreshold,
    secondStepDurationThreshold
  }) {
    checkPositiveNumericPos(dispersionThreshold, 'dispersionThreshold')
    checkUnsignedInteger(
      firstStepDurationThreshold, 'firstStepDurationThreshold'
    )
    checkUnsignedInteger(
      secondStepDurationThreshold, 'secondStepDurationThreshold'
    )
    this.dispersionThreshold = dispersionThreshold
    this.firstStepDurationThreshold = firstStepDurationThreshold
    this.secondStepDurationThreshold = secondStepDurationThreshold
    this.timedGazePoints = []
    this.firstStepPassed = false
  }

  // Based on IDT algorithm
  step (timedGazePoint) {
    checkTimedGazePoint(timedGazePoint, 'timedGazePoint')
    this.timedGazePoints.push(timedGazePoint)

    if (this.timedGazePoints.length > 1 && gazePointsFitInDispersionThreshold(
      this.timedGazePoints.map(it => it.pos),
      this.dispersionThreshold
    )) {
      const duration = (
        this.timedGazePoints[this.timedGazePoints.length - 1].time -
        this.timedGazePoints[0].time
      )
      if (duration >= this.secondStepDurationThreshold) {
        const dwellPoint = getCenterPoint(
          this.timedGazePoints.map(it => it.pos)
        )
        this.timedGazePoints = []
        this.firstStepPassed = false
        return {
          dwellPoint,
          step: 2
        }
      } else if (duration >= this.firstStepDurationThreshold) {
        if (!this.firstStepPassed) {
          this.firstStepPassed = true
          return {
            dwellPoint: getCenterPoint(
              this.timedGazePoints.map(it => it.pos)
            ),
            step: 1
          }
        }
      }
    } else {
      if (this.firstStepPassed) {
        this.timedGazePoints = []
        this.firstStepPassed = false
        return {
          dwellPoint: false,
          step: 2
        }
      } else {
        while (
          this.timedGazePoints.length > 1 &&
          !gazePointsFitInDispersionThreshold(
            this.timedGazePoints.map(it => it.pos),
            this.dispersionThreshold
          )
        ) {
          this.timedGazePoints.shift()
        }
      }
    }
    return false
  }
}

function gazePointsFitInDispersionThreshold (gazePoints, dispersionThreshold) {
  if (gazePoints.length < 2) {
    throw new TypeError('Need at least to gazePoints to calculate dispersion')
  }
  let minPoint = gazePoints[0]
  let maxPoint = gazePoints[0]
  for (let i = 1; i < gazePoints.length; i++) {
    minPoint = getMinXAndY(minPoint, gazePoints[i])
    maxPoint = getMaxXAndY(maxPoint, gazePoints[i])
  }
  return isPosLowerThanOrEqual(
    subPositions(maxPoint, minPoint),
    dispersionThreshold
  )
}

export {
  getTwoStepDwellDetector,
  runTwoStepDwellDetection
}
