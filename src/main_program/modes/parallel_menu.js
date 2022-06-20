import { createNextBtn, createPrevBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeEquallySizedDwellBtnsToParallelMenu } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getSmallDistToNeighborTarget } from 'Src/main_program/util.js'

function getParallelMenuMode ({
  app,
  btnSize,
  distToNeighbor,
  endIdx = false,
  equallySizedDwellBtns,
  showLines = true,
  startIdx = 0
}) {
  if (!distToNeighbor) distToNeighbor = getSmallDistToNeighborTarget(btnSize)
  const getParallelMenuModeFixed = (startIdx, endIdx) => getParallelMenuMode({
    app,
    btnSize,
    distToNeighbor,
    endIdx,
    equallySizedDwellBtns,
    showLines,
    startIdx
  })
  const getNextBtn = startIdx => createNextBtn({
    action: () => activateMode(app, getParallelMenuModeFixed(startIdx, false)),
    size: btnSize
  })
  const getPrevBtn = endIdx => createPrevBtn({
    action: () => activateMode(app, getParallelMenuModeFixed(false, endIdx)),
    size: btnSize
  })

  const arrangedBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor,
    endIdx,
    equallySizedDwellBtns,
    getNextBtn,
    getPrevBtn,
    startIdx
  })
  return getDwellBtnMode(arrangedBtns, showLines)
}

export {
  getParallelMenuMode
}
