import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { getChangeLineWidthMode } from 'Src/main_program/modes/change_line_width.js'
import { getChooseColorMode } from 'Src/main_program/modes/choose_color.js'
import { activateMode } from 'Src/main_program/modes/main.js'
import { getArrangeManyMode } from 'Src/main_program/arrange_many_btns.js'
import { getDrawLineMode } from 'Src/main_program/modes/draw_line.js'
import { getEditMode } from 'Src/main_program/modes/edit.js'
import { getMoveMode } from 'Src/main_program/modes/move.js'
// import { getParallelMenuMode } from 'Src/main_program/modes/parallel_menu.js'
import { getZoomMode } from 'Src/main_program/modes/zoom.js'

import chooseColorModeIcon from 'Assets/icons/color-wheel.png'
import editModeIcon from 'Assets/icons/edit.png'
import drawLineModeIcon from 'Assets/icons/line.png'
import moveModeIcon from 'Assets/icons/move.png'
import zoomModeIcon from 'Assets/icons/magnifying-glass.png'

function getMainMenuMode (app) {
  // const btnSize = app.minGazeTargetSize

  const getStartModeDwellBtn = ({
    domId, icon, mode, title
  }) => createDwellBtn({
    action: () => {
      activateMode(app, mode)
    },
    domId,
    icon,
    size: app.minGazeTargetSize,
    title
  })

  const lang = app.settings.lang
  const startDrawLineModeDwellBtn = getStartModeDwellBtn({
    mode: getDrawLineMode(),
    domId: 'startDrawlineModeDwellBtn',
    icon: drawLineModeIcon,
    title: (lang === 'de') ? 'Linie Zeichnen' : 'Draw Line'
  })
  const startZoomModeDwellBtn = getStartModeDwellBtn({
    mode: getZoomMode(app),
    domId: 'startZoomModeDwellBtn',
    icon: zoomModeIcon,
    title: 'Zoom'
  })
  const startMoveModeDwellBtn = getStartModeDwellBtn({
    mode: getMoveMode(app),
    domId: 'startMoveModeDwellBtn',
    icon: moveModeIcon,
    title: (lang === 'de') ? 'Bild Bewegen' : 'Move'
  })
  const startEditModeDwellBtn = getStartModeDwellBtn({
    mode: getEditMode(app),
    domId: 'startEditModeDwellBtn',
    icon: editModeIcon,
    title: (lang === 'de') ? 'Editieren' : 'Edit'
  })
  const startChooseColorModeDwellBtn = getStartModeDwellBtn({
    mode: getChooseColorMode(app),
    domId: 'startColorChooserModeDwellBtn',
    icon: chooseColorModeIcon,
    title: (lang === 'de') ? 'Farbe' : 'Color'
  })
  const startChangeLineWidthModeDwellBtn = getStartModeDwellBtn({
    mode: getChangeLineWidthMode(app),
    domId: 'startChangeLineWidthModeDwellBtn',
    title: (lang === 'de') ? 'Linienbreite' : 'Line Width'
  })

  return getArrangeManyMode(
    app,
    // btnSize,
    // equallySizedDwellBtns: [
    [
      startDrawLineModeDwellBtn,
      startZoomModeDwellBtn,
      startMoveModeDwellBtn,
      startEditModeDwellBtn,
      startChooseColorModeDwellBtn,
      startChangeLineWidthModeDwellBtn
    ]
  )
}

export {
  getMainMenuMode
}
