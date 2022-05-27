import { createStandardDwellBtn } from 'TestViews/data_types/standard_dwell_btn.js'
import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'
import { arrangeOneBtnToLowerRight } from 'Src/main_program/dwell_btn_patterns.js'

function drawDwellBtnToLowerRight () {
  const domId = 'btn'
  const dwellBtn = createStandardDwellBtn({
    action: () => alert(domId),
    domId,
    title: domId
  })

  const arrangedDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn,
    minDistToEdge: createPos({ x: 100, y: 100 }),
    viewport: getViewport()
  })

  const container = getDwellBtnContainer()
  container.appendChild(getDwellBtnDomEl(arrangedDwellBtn))
  document.body.appendChild(container)
}

const dwellBtnArrangedLowerRightTest = createTestPage({
  name: 'Dwell Btn arranged lower right',
  drawPage: drawDwellBtnToLowerRight
})

export {
  dwellBtnArrangedLowerRightTest
}
