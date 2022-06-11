import { createCurrentDwellBtnProgress } from 'Src/main_program/data_types/current_dwell_btn_progress.js'
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { runWebgazerFixationDetection } from 'Src/main_program/dwell_detection/dwell_at_screenpoint_detection.js'
import { getDwellBtnBackgroundColor, maxFixationDuration, minFixationDuration } from 'Settings'

class GazeAtDwellBtnListner {
  dispersionThreshold
  durationThreshold
  maxFixationDuration
  registeredBtns = []

  constructor (app) {
    this.dwellBtnContainer = app.rootDomEl
    this.dispersionThreshold = app.maxFixationDispersion
    this.durationThreshold = minFixationDuration
    this.maxFixationDuration = maxFixationDuration
    this.webgazer = app.webgazer
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
          if (currentDwellBtnProgress.dwellBtn) {
            // Make DwellBtn darker when the user focuses on it.
            const dwellBtnDomEl = this.dwellBtnContainer.querySelector(
              '#' + currentDwellBtnProgress.dwellBtn.domId
            )
            // 1.0 when not focused, 0.5 when focused till activation.
            shadeBtn(dwellBtnDomEl, currentDwellBtnProgress.progressInPct)
          }
        }
      })
    })
  }

  stop () {
    this.webgazer.clearGazeListener()
  }

  reset () {
    this.registeredBtns = []
  }

  register (dwellBtns) {
    this.registeredBtns = dwellBtns
    this.start()
  }

  unregister () {
    this.stop()
    this.registeredBtns = []
  }
}

function shadeBtn (btnDomId, activationProgress) {
  const btnDomEl = document.getElementById(btnDomId)
  if (btnDomEl) {
    const bgColor = getDwellBtnBackgroundColor(activationProgress / 2 + 0.1)
    // 1.0 when not focused, 0.5 when focused till activation.
    btnDomEl.style.backgroundColor = bgColor
  }
}

function getGazeAtDwellBtnListener (app) {
  return new GazeAtDwellBtnListner(app)
}

function evaluateEyeFixationsAtDwellBtns ({
  currentBtnProgress,
  dwellBtns,
  fixation,
  displayCurrentBtnProgress
}) {
  for (const dwellBtn of dwellBtns) {
    if (fixation && inEllipse(fixation.center, dwellBtn.ellipse)) {
      currentBtnProgress.dwellBtn = dwellBtn
      if (fixation.duration >= dwellBtn.activationTime) {
        if (currentBtnProgress.progressInPct < 100) {
          currentBtnProgress.progressInPct = 100
          dwellBtn.action()
        }
      } else {
        currentBtnProgress.progressInPct = Math.round(
          (fixation.duration / dwellBtn.activationTime) * 100
        )
      }
      displayCurrentBtnProgress(currentBtnProgress)
      return
    }
  }
  if (currentBtnProgress.dwellBtn !== false) {
    currentBtnProgress.progressInPct = 0
    displayCurrentBtnProgress(currentBtnProgress)
    currentBtnProgress.dwellBtn = false
  }
}

export {
  evaluateEyeFixationsAtDwellBtns,
  getGazeAtDwellBtnListener,
  shadeBtn
}
