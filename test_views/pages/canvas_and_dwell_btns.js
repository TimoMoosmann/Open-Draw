import { createTestPage } from 'TestViews/data_types/test_page.js'
import {
  getDwellBtnContainer, getDwellBtnDomEl, getDrawingCanvasInContainer,
  getMainProgramContainer
} from 'Src/main_program/view.js'
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createLine } from 'Src/main_program/data_types/line.js'
import { createStrokeProperties } from 'Src/main_program/data_types/stroke_properties.js'
import { getViewport, vw } from 'Src/util/browser.js'

function drawCanvasAndDwellBtnsPage () {
  const mainProgramContainer = getMainProgramContainer()

  const dwellBtnContainer = getDwellBtnContainer()
  const centeredDwellBtn = createDwellBtn({
    center: scalePosByVal(getViewport(), 1 / 2),
    domId: 'centeredDwellBtn',
    size: createPos({ x: 150, y: 100 }),
    timeTillActivation: 1000,
    title: 'Dalai Lama',
    action: () => window.alert('Have a great day.')
  })
  const upperLeftDwellBtn = createDwellBtn({
    center: createPos({ x: 0, y: 0 }),
    domId: 'centeredDwellBtn',
    size: createPos({ x: 100, y: 100 }),
    timeTillActivation: 1000,
    title: 'Desmond Tutu',
    action: () => window.alert('Ciao.')
  })
  const centeredDwellBtnEl = getDwellBtnDomEl(centeredDwellBtn)
  const upperLeftDwellBtnEl = getDwellBtnDomEl(upperLeftDwellBtn)

  const testLines = [
    createLine({
      startPoint: createPos({ x: 0, y: 0 }),
      endPoint: createPos({ x: 200, y: 200 }),
      strokeProperties: createStrokeProperties({
        color: 'blue',
        lineWidth: 2
      })
    }),
    createLine({
      startPoint: createPos({ x: vw() / 2, y: 200 }),
      endPoint: createPos({ x: vw() / 2, y: 600 }),
      strokeProperties: createStrokeProperties({
        color: 'red',
        lineWidth: 10
      })
    })
  ]

  const { drawingCanvas, drawingCanvasContainer } =
    getDrawingCanvasInContainer()

  dwellBtnContainer.appendChild(centeredDwellBtnEl)
  dwellBtnContainer.appendChild(upperLeftDwellBtnEl)
  mainProgramContainer.appendChild(dwellBtnContainer)
  mainProgramContainer.appendChild(drawingCanvasContainer)
  document.body.appendChild(mainProgramContainer)

  drawingCanvas.drawLines(testLines)
}

const dwellBtnsAndDrawingCanvasTest = createTestPage({
  name: 'DwellBtn & DrawingCanvas',
  drawPage: drawCanvasAndDwellBtnsPage
})

export {
  dwellBtnsAndDrawingCanvasTest
}
