import { getGazePoint } from 'Src/setup_webgazer/view.js'
import { addGazeListener, removeGazeListener } from 'Src/webgazer_extensions/helper.js'

class GazeDot {
  #interval
  gazeListenerName = 'gaze_dot'

  constructor ({
    color,
    refreshesPerSecond,
    rootEl,
    webgazer
  }) {
    this.refreshInterval = 1000 / refreshesPerSecond
    this.webgazer = webgazer
    this.screenDot = new ScreenDot(rootEl, color)
    this.screenDot.setColor(color)
  }

  setColor (color) {
    this.screenDot.setColor(color)
  }

  show () {
    this.screenDot.show()
    let lastDrawnTime = -1
    addGazeListener(this.webgazer, this.gazeListenerName, (gazePoint, time) => {
      if (
        lastDrawnTime === -1 || time - lastDrawnTime >= this.refreshInterval
      ) {
        if (gazePoint) this.screenDot.changePosition(gazePoint)
        lastDrawnTime = time
      }
    })
  }

  hide () {
    this.screenDot.hide()
    removeGazeListener(this.webgazer, this.gazeListenerName)
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
