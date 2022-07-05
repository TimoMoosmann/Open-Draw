/*
 * Dwell at Btn listener listens to a fixation detector, while
 * dwell at Btn detection only collects screenpoints that hit a button.
 */
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { checkDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { runWebgazerFixationDetection } from 'Src/main_program/dwell_detection/dwell_at_screenpoint_detection.js'
import { shadeBtnLinear } from 'Src/main_program/view.js'
import { clearScreenPointListeners } from 'Src/util/main.js'

class GazeAtDwellBtnListner {
  dispersionThreshold
  durationThreshold
  maxFixationDuration
  registeredBtns = []

  constructor (app) {
    this.app = app
    this.dwellBtnContainer = app.rootDomEl
    this.dispersionThreshold = app.dispersionThreshold
    this.getDwellBtnBackgroundColor = app.settings.getDwellBtnBackgroundColor
  }

  start () {
    const currentBtnProgress = createDwellBtnProgress()
    let maxFixationDuration = -1
    for (const dwellBtn of this.registeredBtns) {
      if (dwellBtn.activationTime > maxFixationDuration) {
        maxFixationDuration = dwellBtn.activationTime
      }
    }
    // Buffer for webgazer
    maxFixationDuration += 200

    runWebgazerFixationDetection({
      app: this.app,
      dispersionThreshold: this.dispersionThreshold,
      maxFixationDuration,
      onFixation: fixation => evaluateEyeFixationsAtDwellBtns({
        currentBtnProgress,
        dwellBtns: this.registeredBtns,
        fixation,
        displayCurrentBtnProgress: currentBtnProgress => {
          const { dwellBtn, progress } = currentBtnProgress
          if (dwellBtn) {
            shadeBtnLinear(
              dwellBtn.domId, progress, this.getDwellBtnBackgroundColor
            )
          }
        }
      })
    })
  }

  stop () {
    clearScreenPointListeners(this.app.webgazer, this.app.mouseListeners)
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
        if (currentBtnProgress.progress < 1) {
          currentBtnProgress.progress = 1
          dwellBtn.action()
        }
      } else {
        currentBtnProgress.progress =
          fixation.duration / dwellBtn.activationTime
      }
      displayCurrentBtnProgress(currentBtnProgress)
      return
    }
  }
  if (currentBtnProgress.dwellBtn !== false) {
    currentBtnProgress.progress = 0
    displayCurrentBtnProgress(currentBtnProgress)
    currentBtnProgress.dwellBtn = false
  }
}

function createDwellBtnProgress ({ dwellBtn = false, progress = 0 } = {}) {
  if (dwellBtn !== false) checkDwellBtn(dwellBtn, 'dwellBtn')
  if (!(typeof progress === 'number') || progress < 0) {
    throw new TypeError('Illegal progress given')
  }
  return { dwellBtn, progress }
}

export {
  createDwellBtnProgress,
  evaluateEyeFixationsAtDwellBtns,
  getGazeAtDwellBtnListener
}
