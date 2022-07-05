import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { arrangeOneBtnToLowerRight } from 'Src/main_program/dwell_btn_patterns.js'
import { getDwellBtnMode } from 'Src/main_program/modes/dwell_btn_mode.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getMainMenuMode } from 'Src/main_program/modes/main_menu.js'
import { getAbsPosFromPosRelativeToViewport } from 'Src/util/main.js'

import { standardDwellBtnActivationTime } from 'Settings/main.js'

import openMenuIcon from 'Assets/icons/menu.png'

function getMainMenuClosedMode (app) {
  const openMainMenuDwellBtn = createDwellBtn({
    action: () => activateMode(app, getMainMenuMode(app)),
    domId: 'openMainMenuBtn',
    icon: openMenuIcon,
    size: app.minGazeTargetSize,
    activationTime: standardDwellBtnActivationTime,
    title: (app.settings.lang === 'de') ? 'Menü Öffnen' : 'Open Menu'
  })

  const arrangedOpenMainMenuDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn: openMainMenuDwellBtn,
    minDistToEdge: getAbsPosFromPosRelativeToViewport(
      app.settings.minDistToEdgeRel
    )
  })

  return getDwellBtnMode([arrangedOpenMainMenuDwellBtn])
}

export {
  getMainMenuClosedMode
}
