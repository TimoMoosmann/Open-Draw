import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { getViewport } from 'Src/util/browser.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'

function drawDwellBtnsPage () {
  const container = getDwellBtnContainer()

  const dwellBtnUpperLeft = createDwellBtn({
    center: createPos({ x: 150, y: 150 }),
    domId: 'dwelBtn1',
    size: createPos({ x: 100, y: 100 }),
    timeTillActivation: 1000,
    action: () => window.alert('moin')
  })

  const dwellBtnUpperLeftLeft = createDwellBtn({
    center: createPos({ x: 0, y: 0 }),
    domId: 'dwelBtn2',
    size: createPos({ x: 100, y: 100 }),
    timeTillActivation: 1000,
    action: () => window.alert('moin')
  })
  const upperLeftBtnEl = getDwellBtnDomEl(dwellBtnUpperLeft)
  const upperLeftLeftBtnEl = getDwellBtnDomEl(dwellBtnUpperLeftLeft)

  const dwellBtnCenter = createDwellBtn({
    center: scalePosByVal(getViewport(), 1 / 2),
    domId: 'dwelBtn3',
    size: createPos({ x: 150, y: 100 }),
    timeTillActivation: 1000,
    title: 'Dalai Lama',
    action: () => window.alert('moin')
  })
  const centerBtnEl = getDwellBtnDomEl(dwellBtnCenter)

  container.appendChild(upperLeftBtnEl)
  container.appendChild(upperLeftLeftBtnEl)
  container.appendChild(centerBtnEl)
  document.body.appendChild(container)
}

const dwellBtnsTest = createTestPage({
  name: 'Dwell Btns',
  drawPage: drawDwellBtnsPage
})

export {
  dwellBtnsTest
}
