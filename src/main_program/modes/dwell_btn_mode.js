import { redraw } from 'Src/main_program/draw.js'
import { removeDwellBtnsAndGazeListener, showAndActivateDwellBtns } from 'Src/main_program/util.js'

class DwellBtnMode {
  active = true

  constructor (
    arrangedDwellBtns, showLines = true, showBackgroundGrid = false
  ) {
    this.arrangedDwellBtns = arrangedDwellBtns
    this.showLines = showLines
    this.showBackgroundGrid = showBackgroundGrid
  }

  start (app) {
    if (!this.active) return
    this.draw(app)
  }

  draw (app) {
    showAndActivateDwellBtns(this.arrangedDwellBtns, app)
    if (this.showLines) redraw(app)
  }

  stop (app) {
    this.active = false
    removeDwellBtnsAndGazeListener(app)
    app.drawingCanvas.clear()
  }
}

function getDwellBtnMode (arrangedDwellBtns) {
  return new DwellBtnMode(arrangedDwellBtns)
}

export {
  getDwellBtnMode
}
