import { scalePosByVal } from 'Src/data_types/pos.js'
import { createDwellBtnWithColorDot, createNextBtn, createPrevBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeEquallySizedDwellBtnsToParallelMenu } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'
import { colors } from 'Settings'

function startChooseColorMode (app) {
  const onColorChoosenAction = color => {
    if (app.eyeModeOn) {
      app.gazeAtDwellBtnListener.stop()
      app.gazeAtDwellBtnListener.reset()
    }
    window.alert(color)
  }

  const btnSize = app.minTargetSize
  const colorDwellBtns = []
  for (let i = 1; i < colors.length; i++) {
    colorDwellBtns.push(createDwellBtnWithColorDot({
      action: () => onColorChoosenAction(colors[i]),
      colorDot: colors[i],
      domId: 'colorBtn' + i,
      icon: false,
      size: btnSize
    }))
  }

  const dwellBtnContainer = getDwellBtnContainer()
  app.rootDomEl.appendChild(dwellBtnContainer)

  app.gazeAtDwellBtnListener.reset()
  app.gazeAtDwellBtnListener.start()

  drawAndActivateParallelMenu({
    app,
    btnSize,
    dwellBtnContainer,
    equallySizedDwellBtns: colorDwellBtns
  })
}

function drawAndActivateParallelMenu ({
  app,
  btnSize,
  distToNeighborBtn = false,
  dwellBtnContainer,
  endIdx = false,
  equallySizedDwellBtns,
  startIdx = 0
}) {
  if (!distToNeighborBtn) {
    distToNeighborBtn = scalePosByVal(btnSize, 0.5)
  }
  dwellBtnContainer.innerHTML = ''

  const drawAndActivateParallelMenuWithFixedParams = ({ endIdx, startIdx }) => {
    return drawAndActivateParallelMenu({
      app, btnSize, dwellBtnContainer, endIdx, equallySizedDwellBtns, startIdx
    })
  }

  const getNextBtn = startIdx => createNextBtn({
    action: () => drawAndActivateParallelMenuWithFixedParams({
      startIdx, endIdx: false
    }),
    size: btnSize
  })
  const getPrevBtn = endIdx => createPrevBtn({
    action: () => drawAndActivateParallelMenuWithFixedParams({
      endIdx, startIdx: false
    }),
    size: btnSize
  })

  const arrangedDwellBtns = arrangeEquallySizedDwellBtnsToParallelMenu({
    distToNeighbor: distToNeighborBtn,
    endIdx,
    equallySizedDwellBtns,
    getNextBtn,
    getPrevBtn,
    startIdx
  })

  for (const arrangedBtn of arrangedDwellBtns) {
    dwellBtnContainer.appendChild(getDwellBtnDomEl(arrangedBtn))
  }

  if (app.eyeModeOn) {
    app.gazeAtDwellBtnListener.register(arrangedDwellBtns)
  }
}

export {
  startChooseColorMode
}
