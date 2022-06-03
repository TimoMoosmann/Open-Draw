import { createDwellBtnWithColorDot } from 'Src/main_program/data_types/dwell_btn.js'
import { startMainMenuClosedMode } from 'Src/main_program/main.js'
import { drawAndActivateParallelMenu } from 'Src/main_program/parallel_menu.js'
import { closeDwellBtnScreen } from 'Src/main_program/util.js'
import { colors } from 'Settings'

function startChooseColorMode (app) {
  const btnSize = app.minGazeTargetSize
  const colorDwellBtns = []
  for (let i = 1; i < colors.length; i++) {
    colorDwellBtns.push(createDwellBtnWithColorDot({
      action: () => {
        closeDwellBtnScreen(app)
        app.state.color = colors[i]
        startMainMenuClosedMode(app)
      },
      colorDot: colors[i],
      domId: 'colorBtn' + i,
      icon: false,
      size: btnSize
    }))
  }

  drawAndActivateParallelMenu({
    app,
    btnSize,
    equallySizedDwellBtns: colorDwellBtns
  })
}

export {
  startChooseColorMode
}
