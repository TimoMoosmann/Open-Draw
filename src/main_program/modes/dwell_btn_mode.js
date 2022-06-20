import { redraw } from 'Src/main_program/draw.js'
import { removeDwellBtnsAndGazeListener, showAndActivateDwellBtns } from 'Src/main_program/util.js'

class DwellBtnMode {
  active = true
  #onStart
  #onStop

  constructor (
    arrangedDwellBtns, {
      onStart = () => {},
      onStop = () => {},
      showLines = true
    } = {}
  ) {
    this.arrangedDwellBtns = arrangedDwellBtns
    this.#onStart = onStart
    this.#onStop = onStop
    this.showLines = showLines
  }

  start (app) {
    this.#onStart()
    if (!this.active) return
    this.draw(app)
  }

  draw (app) {
    showAndActivateDwellBtns(this.arrangedDwellBtns, app)
    if (this.showLines) redraw(app)
  }

  stop (app) {
    this.#onStop()
    this.active = false
    removeDwellBtnsAndGazeListener(app)
    app.drawingCanvas.clear()
  }
}

function getDwellBtnMode (arrangedDwellBtns, additional) {
  return new DwellBtnMode(arrangedDwellBtns, additional)
}

export {
  getDwellBtnMode
}
