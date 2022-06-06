import { scalePosByVal } from 'Src/data_types/pos.js'
import { createNextBtn, createPrevBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeEquallySizedDwellBtnsToParallelMenu } from 'Src/main_program/dwell_btn_patterns.js'
import { removeDwellBtnsAndGazeListener, showAndActivateDwellBtns } from 'Src/main_program/util.js'

function drawAndActivateParallelMenu ({
  app,
  btnSize = false,
  distToNeighbor = false,
  endIdx = false,
  equallySizedDwellBtns,
  startIdx = 0
}) {
  if (!distToNeighbor) distToNeighbor = scalePosByVal(btnSize, 0.5)
  if (!btnSize) btnSize = app.minGazeTargetSize

  const drawAndActivateParallelMenuWithFixedParams = ({ endIdx, startIdx }) => {
    drawAndActivateParallelMenu({
      app, btnSize, endIdx, equallySizedDwellBtns, startIdx
    })
  }

  const getNextBtn = startIdx => createNextBtn({
    action: () => {
      removeDwellBtnsAndGazeListener(app)
      drawAndActivateParallelMenuWithFixedParams({ startIdx, endIdx: false })
    },
    size: btnSize
  })
  const getPrevBtn = endIdx => createPrevBtn({
    action: () => {
      removeDwellBtnsAndGazeListener(app)
      drawAndActivateParallelMenuWithFixedParams({ endIdx, startIdx: false })
    },
    size: btnSize
  })

  const arrangedDwellBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor,
    endIdx,
    equallySizedDwellBtns,
    getNextBtn,
    getPrevBtn,
    startIdx
  })

  showAndActivateDwellBtns(arrangedDwellBtns, app)
}

export {
  drawAndActivateParallelMenu
}
