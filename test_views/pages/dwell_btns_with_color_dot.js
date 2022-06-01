import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtnWithColorDot } from 'Src/main_program/data_types/dwell_btn.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'

function drawDwellBtnsWithColorDotPage () {
  const colorDotBtn1 = createDwellBtnWithColorDot({
    action: () => window.alert('Hello'),
    center: createPos({ x: 300, y: 200 }),
    colorDot: 'green',
    domId: 'colorBtn1',
    icon: false,
    size: createPos({ x: 200, y: 200 })
  })

  const container = getDwellBtnContainer()
  container.appendChild(getDwellBtnDomEl(colorDotBtn1))

  document.body.appendChild(container)
}

const dwellBtnsWithColorDotTest = createTestPage({
  name: 'Color Dots',
  drawPage: drawDwellBtnsWithColorDotPage
})

export {
  dwellBtnsWithColorDotTest
}
