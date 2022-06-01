import { dwellBtnsMenuTest } from 'TestViews/pages/menu.js'
import { dwellBtnArrangedLowerRightTest } from 'TestViews/pages/lower_right_btn.js'
import { dwellBtnsTest } from 'TestViews/pages/dwell_btns.js'
import { dwellBtnsAndDrawingCanvasTest } from 'TestViews/pages/canvas_and_dwell_btns.js'
import { dwellBtnsWithColorDotTest } from 'TestViews/pages/dwell_btns_with_color_dot.js'
import { colorMenuTest } from 'TestViews/pages/color_menu.js'

import 'Assets/css/test_views.css'

const testPages = [
  dwellBtnsMenuTest,
  dwellBtnArrangedLowerRightTest,
  dwellBtnsTest,
  dwellBtnsAndDrawingCanvasTest,
  dwellBtnsWithColorDotTest,
  colorMenuTest
]

function main () {
  const container = document.createElement('div')
  container.id = 'startTestBtnsContainer'
  document.body.appendChild(container)

  for (const testPage of testPages) {
    const startTestBtn = document.createElement('button')
    startTestBtn.className = 'startTestBtn'
    startTestBtn.innerHTML = testPage.name
    startTestBtn.addEventListener('click', () => {
      document.body.innerHTML = ''
      testPage.drawPage()
    })
    container.appendChild(startTestBtn)
  }
}

main()
