import { createNextBtn, createPrevBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeBtnsTwoHighOneLow } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { activateMode } from 'Src/main_program/modes/main.js'

function getArrangeManyMode (app, btns, startIdx = 0, endIdx = false) {
  if (startIdx && endIdx) {
    throw new TypeError(
      'Funtion can take either startIdx, or endIdx as argument, but not both.'
    )
  }
  let hasPrevBtn = (startIdx !== false) ? (startIdx > 0) : (endIdx > 1)
  let hasNextBtn = (startIdx !== false)
    ? (btns.length - startIdx > 2)
    : (endIdx <= btns.length - 1)
  if (btns.length <= 3) {
    hasPrevBtn = false
    hasNextBtn = false
  }
  const numBtnsDisplayable = 3 - hasPrevBtn - hasNextBtn
  const displayBtns = []

  if (startIdx !== false) endIdx = startIdx + numBtnsDisplayable - 1
  if (endIdx !== false) startIdx = endIdx - numBtnsDisplayable + 1
  if (endIdx > btns.length - 1) endIdx = btns.length - 1
  if (startIdx < 0) startIdx = 0

  if (hasPrevBtn) {
    displayBtns.push(createPrevBtn({
      action: () => activateMode(app, getArrangeManyMode(
        app, btns, false, startIdx - 1
      )),
      size: btns[0].size
    }))
  }

  for (let i = startIdx; i <= endIdx; i++) {
    displayBtns.push(btns[i])
  }

  if (hasNextBtn) {
    displayBtns.push(createNextBtn({
      action: () => activateMode(app, getArrangeManyMode(
        app, btns, endIdx + 1, false
      )),
      size: btns[0].size
    }))
  }
  return getDwellBtnMode(arrangeBtnsTwoHighOneLow(displayBtns))
}

export {
  getArrangeManyMode
}
