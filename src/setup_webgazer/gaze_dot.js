import { getGazePoint } from 'Src/setup_webgazer/view.js'
import { addScreenPointListener, removeScreenPointListener } from 'Src/util/main.js'

class GazeDot {
  #interval
  gazeListenerName = 'gaze_dot'

  constructor ({
    app,
    color,
    refreshesPerSecond,
    rootEl
  }) {
    this.app = app
    this.refreshInterval = 1000 / refreshesPerSecond
    this.screenDot = new ScreenDot(rootEl, color)
    this.screenDot.setColor(color)
  }

  setColor (color) {
    this.screenDot.setColor(color)
  }

  show () {
    this.screenDot.show()
    let lastDrawnTime = -1
    addScreenPointListener(
      this.app.webgazer, this.app.mouseListeners, this.gazeListenerName,
      (gazePoint, time) => {
        if (!gazePoint) return
        if (
          lastDrawnTime === -1 || time - lastDrawnTime >= this.refreshInterval
        ) {
          if (gazePoint) this.screenDot.changePosition(gazePoint)
          lastDrawnTime = time
        }
      }
    )
  }

  hide () {
    this.screenDot.hide()
    removeScreenPointListener(this.app, this.gazeListenerName)
  }
}

class ScreenDot {
  constructor (rootEl, color) {
    this.domEl = getGazePoint()
    rootEl.appendChild(this.domEl)
    this.setColor(color)
  }

  show () {
    this.domEl.style.visibility = 'visible'
  }

  hide () {
    this.domEl.style.visibility = 'hidden'
  }

  setColor (color) {
    this.domEl.style.backgroundColor = color
  }

  changePosition (newPos) {
    this.domEl.style.left = newPos.x + 'px'
    this.domEl.style.top = newPos.y + 'px'
  }
}

function getGazeDot (args) {
  return new GazeDot(args)
}

export {
  getGazeDot,
  ScreenDot
}
