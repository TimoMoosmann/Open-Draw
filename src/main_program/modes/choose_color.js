import { createDwellBtnWithColorDot, createNextBtn, createPrevBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeEquallySizedDwellBtnsToParallelMenu } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'
import { colors } from 'Settings'

function startChooseColorMode () {
  // draw Lines ?
  /*
  const colors = []
  for (const colorCode of colors) {
  }
  */
}

function getChooseColorMenuPage ({
  appContainer,
  btnSize,
  distToNeighborBtn,
  onColorChoosenAction = color => {}
}) {
  const chooseColorDwellBtns = []
  for (let i = 1; i < colors.length; i++) {
    console.log(colors[i])
    chooseColorDwellBtns.push(createDwellBtnWithColorDot({
      action: () => onColorChoosenAction(colors[i]),
      colorDot: colors[i],
      domId: 'colorBtn' + i,
      icon: false,
      size: btnSize
    }))
  }

  const dwellBtnContainer = getDwellBtnContainer()
  appContainer.appendChild(dwellBtnContainer)

  const createCorrectSizedBtn = (createFunction, args) => createFunction({
    size: btnSize,
    ...args
  })
  const getNextBtnFromAction = action => createCorrectSizedBtn(
    createNextBtn, { action }
  )
  const getPrevBtnFromAction = action => createCorrectSizedBtn(
    createPrevBtn, { action }
  )

  drawParallelMenu({
    distToNeighborBtn,
    dwellBtnContainer,
    equallySizedDwellBtns: chooseColorDwellBtns,
    getNextBtnFromAction,
    getPrevBtnFromAction
  })
}

function drawParallelMenu ({
  distToNeighborBtn,
  dwellBtnContainer,
  endIdx = false,
  equallySizedDwellBtns,
  getNextBtnFromAction,
  getPrevBtnFromAction,
  startIdx = 0
}) {
  const drawParallelMenuFixed = ({ endIdx, startIdx }) => drawParallelMenu({
    distToNeighborBtn,
    dwellBtnContainer,
    endIdx,
    equallySizedDwellBtns,
    getNextBtnFromAction,
    getPrevBtnFromAction,
    startIdx
  })
  dwellBtnContainer.innerHTML = ''

  const getNextBtnAction = startIdx => () => drawParallelMenuFixed({
    startIdx, endIdx: false
  })
  const getPrevBtnAction = endIdx => () => drawParallelMenuFixed({
    endIdx, startIdx: false
  })

  const arrangedDwellBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor: distToNeighborBtn,
    endIdx,
    equallySizedDwellBtns,
    getNextBtn: startIdx => getNextBtnFromAction(getNextBtnAction(startIdx)),
    getPrevBtn: endIdx => getPrevBtnFromAction(getPrevBtnAction(endIdx)),
    startIdx
  })

  for (const arrangedBtn of arrangedDwellBtns) {
    dwellBtnContainer.appendChild(getDwellBtnDomEl(arrangedBtn))
  }
}

export {
  getChooseColorMenuPage,
  startChooseColorMode
}
