import { inEllipse } from 'Src/main_program/data_types/ellipse.js'

function evaluateEyeFixationsAtDwellBtns ({
  dwellBtns,
  fixation,
  currentBtn,
  onGazeAtBtn
}) {
  for (const dwellBtn of dwellBtns) {
    if (fixation && inEllipse({
      ellipse: dwellBtn.ellipse,
      pos: fixation.center
    })) {
      currentBtn.btnId = dwellBtn.domId
      if (fixation.duration >= dwellBtn.timeTillActivation) {
        if (currentBtn.progressInPct < 100) {
          currentBtn.progressInPct = 100
          dwellBtn.action()
        }
      } else {
        currentBtn.progressInPct = Math.round(
          (fixation.duration / dwellBtn.timeTillActivation) * 100
        )
      }
      onGazeAtBtn(currentBtn)
    } else {
      if (currentBtn.btnId !== false) {
        currentBtn.progressInPct = 0
        onGazeAtBtn(currentBtn)
        currentBtn.btnId = false
      }
    }
  }
}

export {
  evaluateEyeFixationsAtDwellBtns
}
