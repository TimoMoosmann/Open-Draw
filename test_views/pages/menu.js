import { createStandardDwellBtn } from 'TestViews/data_types/standard_dwell_btn.js'
import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'
import { arrangeEquallySizedDwellBtnsToParallelMenu } from 'Src/main_program/dwell_btn_patterns.js'

function drawMenu ({
  distToNeighbor = createPos({ x: 100, y: 50 }),
  endIdx = false,
  equallySizedDwellBtns,
  minDistToEdge = createPos({ x: 100, y: 50 }),
  startIdx = 0
}) {
  const container = getDwellBtnContainer()

  const getNextBtn = newStartIdx => createStandardDwellBtn({
    domId: 'nextBtn',
    action: () => {
      container.remove()
      drawMenu({
        equallySizedDwellBtns,
        startIdx: newStartIdx
      })
    }
  })

  const getPrevBtn = newEndIdx => createStandardDwellBtn({
    domId: 'prevBtn',
    action: () => {
      container.remove()
      drawMenu({
        equallySizedDwellBtns,
        endIdx: newEndIdx
      })
    }
  })

  const arrangedDwellBtns =
    arrangeEquallySizedDwellBtnsToParallelMenu({
      distToNeighbor,
      endIdx,
      equallySizedDwellBtns,
      minDistToEdge,
      getNextBtn,
      getPrevBtn,
      startIdx,
      viewport: getViewport()
    })

  for (const arrangedDwellBtn of arrangedDwellBtns) {
    const arrangedDwellBtnDomEl = getDwellBtnDomEl(arrangedDwellBtn)
    container.appendChild(arrangedDwellBtnDomEl)
  }
  document.body.appendChild(container)
}

function drawDwellBtnsMenu () {
  const numTestDwellBtns = 15

  const testDwellBtns = []
  for (let i = 0; i < numTestDwellBtns; i++) {
    const domId = 'btn' + i
    testDwellBtns.push(createStandardDwellBtn({
      action: () => window.alert(domId),
      domId
    }))
  }

  drawMenu({
    equallySizedDwellBtns: testDwellBtns
  })
}

const dwellBtnsMenuTest = createTestPage({
  name: 'Dwell Btns Menu',
  drawPage: drawDwellBtnsMenu
})

export {
  dwellBtnsMenuTest
}
