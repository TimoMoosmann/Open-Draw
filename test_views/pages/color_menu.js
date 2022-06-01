import { createTestPage } from 'TestViews/data_types/test_page.js'
import { createPos } from 'Src/data_types/pos.js'
import { getChooseColorMenuPage } from 'Src/main_program/modes/choose_color.js'

function drawChooseColorMenu () {
  const appContainer = document.body
  const btnSize = createPos({ x: 200, y: 150 })
  const distToNeighborBtn = createPos({ x: 100, y: 100 })
  const onColorChoosenAction = color => window.alert(color + ' choosen')

  const colorMenu = getChooseColorMenuPage({
    appContainer,
    btnSize,
    distToNeighborBtn,
    onColorChoosenAction
  })
  return colorMenu
}

const colorMenuTest = createTestPage({
  name: 'Color Menu',
  drawPage: drawChooseColorMenu
})

export {
  colorMenuTest
}
