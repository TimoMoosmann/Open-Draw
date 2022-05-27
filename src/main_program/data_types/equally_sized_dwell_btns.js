import { checkDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { isPosEqual } from 'Src/data_types/pos.js'

function checkEquallySizedDwellBtns (dwellBtns, argName) {
  if (!Array.isArray(dwellBtns) || dwellBtns.length < 1) {
    throw new TypeError(
      argName +
      ': Object of type EquallySizedDwellBtns is an Array ' +
      'with at least one element.'
    )
  }
  let prevDwellBtnRadii = false
  for (const dwellBtn of dwellBtns) {
    checkDwellBtn(dwellBtn, argName + ': DwellBtn')

    if (
      prevDwellBtnRadii !== false &&
      !isPosEqual(dwellBtn.ellipse.radii, prevDwellBtnRadii)
    ) {
      throw new TypeError(argName + ': DwellBtns are not sized equally.')
    }
    prevDwellBtnRadii = dwellBtn.ellipse.radii
  }
}

export {
  checkEquallySizedDwellBtns
}
