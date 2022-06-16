import { createDwellBtnWithColorDot } from 'Src/main_program/data_types/dwell_btn.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuClosedMode } from 'Src/main_program/modes/main_menu_closed.js'
import { getParallelMenuMode } from 'Src/main_program/modes/parallel_menu.js'
import { colors } from 'Settings'

function getChooseColorMode (app) {
  const btnSize = app.minGazeTargetSize
  const colorDwellBtns = []
  for (let i = 1; i < colors.length; i++) {
    colorDwellBtns.push(createDwellBtnWithColorDot({
      action: () => {
        app.state.color = colors[i]
        activateMode(app, getMainMenuClosedMode(app))
      },
      colorDot: colors[i],
      domId: 'colorBtn' + i,
      icon: false,
      size: btnSize
    }))
  }

  return getParallelMenuMode({
    app,
    btnSize,
    equallySizedDwellBtns: colorDwellBtns,
    showLines: false
  })
}

export {
  getChooseColorMode
}
