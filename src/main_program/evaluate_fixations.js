import { createCurrentDwellBtnProgress } from 'Src/main_program/data_types/current_dwell_btn_progress.js'
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { runWebgazerFixationDetection } from 'Src/webgazer_extensions/fixation_detection/main.js'
import { maxFixationDuration, minFixationDuration } from 'Settings'

class GazeAtDwellBtnListner {
  dispersionThreshold
  durationThreshold
  maxFixationDuration
  registeredBtns = []

  constructor (app) {
    this.dispersionThreshold = app.constants.dispersionThreshold
    this.durationThreshold = minFixationDuration
    this.maxFixationDuration = maxFixationDuration
    this.webgazer = app.constants.webgazer
  }

  start () {
    const currentBtnProgress = createCurrentDwellBtnProgress({
      currentDwellBtn: false,
      progressInPct: 0
    })

    runWebgazerFixationDetection({
      dispersionThreshold: this.dispersionThreshold,
      durationThreshold: this.durationThreshold,
      maxFixationDuration: this.maxFixationDuration,
      webgazer: this.webgazer,
      onFixation: fixation => evaluateEyeFixationsAtDwellBtns({
        currentBtnProgress,
        dwellBtns: this.registeredBtns,
        fixation,
        displayCurrentBtnProgress: currentDwellBtnProgress => {
          // Make DwellBtn darker when the user focuses on it.
          const dwellBtnDomEl = this.appContainer.querySelector(
            currentDwellBtnProgress.currentDwellBtn.domId
          )
          // 1.0 when not focused, 0.5 when focused till activation.
          const btnBrightness =
            (100 - currentDwellBtnProgress.progressInPct) + 100 /
            200
          dwellBtnDomEl.style.filter = `brightness(${btnBrightness})`
        }
      })
    })
  }

  stop () {
    this.webgazer.clearGazeListener()
  }

  register (dwellBtns) {
    this.registeredBtns = dwellBtns
  }

  reset () {
    this.registeredBtns = []
  }
}

function getGazeAtDwellBtnListener (app) {
  return new GazeAtDwellBtnListner(app)
}

function evaluateEyeFixationsAtDwellBtns ({
  currentBtnProgress,
  dwellBtns,
  fixation,
  onGazeAtBtn
}) {
  for (const dwellBtn of dwellBtns) {
    if (fixation && inEllipse({
      ellipse: dwellBtn.ellipse,
      pos: fixation.center
    })) {
      currentBtnProgress.currentDwellBtn = dwellBtn
      if (fixation.duration >= dwellBtn.timeTillActivation) {
        if (currentBtnProgress.progressInPct < 100) {
          currentBtnProgress.progressInPct = 100
          dwellBtn.action()
        }
      } else {
        currentBtnProgress.progressInPct = Math.round(
          (fixation.duration / dwellBtn.timeTillActivation) * 100
        )
      }
      onGazeAtBtn(currentBtnProgress)
    } else {
      if (currentBtnProgress.currentDwellBtn !== false) {
        currentBtnProgress.progressInPct = 0
        onGazeAtBtn(currentBtnProgress)
        currentBtnProgress.currentDwellBtn = false
      }
    }
  }
}

export {
  evaluateEyeFixationsAtDwellBtns,
  getGazeAtDwellBtnListener
}
