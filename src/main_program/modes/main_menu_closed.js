import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeOneBtnToLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuMode } from 'Src/main_program/modes/main_menu.js'

import { standardDwellBtnActivationTime } from 'Settings'

import openMenuIcon from 'Assets/icons/menu.png'

function getMainMenuClosedMode (app) {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => {
      activateMode(app, getMainMenuMode(app))
    },
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: app.minGazeTargetSize,
    activationTime: standardDwellBtnActivationTime,
    title: 'Open Menu'
  })

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn
  })

  return getDwellBtnMode([arrangedOpenMainMenuDwellBtn])
}

export {
  getMainMenuClosedMode
}
