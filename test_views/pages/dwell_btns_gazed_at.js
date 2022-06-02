import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtnWithColorDot } from 'Src/main_program/data_types/dwell_btn.js'
import { shadeBtn } from 'Src/main_program/evaluate_fixations.js'
import { getDwellBtnContainer, getDwellBtnDomEl } from 'Src/main_program/view.js'

function drawDwellBtnsGazedAt () {
  const getGreenBtn = x => createDwellBtnWithColorDot({
    action: () => window.alert('Hello'),
    center: createPos({ x, y: 200 }),
    colorDot: 'green',
    domId: 'colorBtn' + x,
    icon: false,
    size: createPos({ x: 200, y: 200 })
  })
  const colorDotBtnNormal = getGreenBtn(100)
  const colorDotBtn30 = getGreenBtn(400)
  const colorDotBtn70 = getGreenBtn(700)
  const colorDotBtn100 = getGreenBtn(1000)

  const container = getDwellBtnContainer()
  container.appendChild(getDwellBtnDomEl(colorDotBtnNormal))
  container.appendChild(getDwellBtnDomEl(colorDotBtn30))
  container.appendChild(getDwellBtnDomEl(colorDotBtn70))
  container.appendChild(getDwellBtnDomEl(colorDotBtn100))

  shadeBtn(container.querySelector('#colorBtn400'), 30)
  shadeBtn(container.querySelector('#colorBtn700'), 70)
  shadeBtn(container.querySelector('#colorBtn1000'), 100)

  document.body.appendChild(container)
}

const dwellBtnsGazedAtTest = createTestPage({
  name: 'Shaded Btns',
  drawPage: drawDwellBtnsGazedAt
})

export {
  dwellBtnsGazedAtTest
}
