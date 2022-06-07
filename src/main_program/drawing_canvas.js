/* global MutationObserver */
import { clearCanvas, drawLinesOnCanvas } from 'Src/main_program/draw.js'

function getDrawingCanvas (canvasDomEl) {
  return new DrawingCanvas(canvasDomEl)
}

class DrawingCanvas {
  canvasDomEl
  canvasReady = false
  linesStack = []

  constructor (canvasDomEl) {
    this.canvasDomEl = canvasDomEl

    // Draw all stacked lines when the canvas is ready.
    const drawingCanvasObserver = new MutationObserver(
      (mutations, observer) => {
        for (const mutation of mutations) {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.contains(this.canvasDomEl)) {
              observer.disconnect()
              this.canvasReady = true
              this.drawLines(this.linesStack)
            }
          }
        }
      }
    )
    // When the canvas is already part of the body, the observer is unnecassary
    // and also wouldn't be stopped.
    if (!document.body.querySelector(this.canvasDomEl.id)) {
      this.canvasReady = true
      drawingCanvasObserver.observe(document, {
        subtree: true, childList: true
      })
    }
  }

  drawLines (lines, zoom = false) {
    if (this.canvasReady) {
      fitCanvasToContainer(this.canvasDomEl)
      drawLinesOnCanvas(lines, this.canvasDomEl, zoom)
    } else {
      // Stack lines when the canvas is not ready.
      this.linesStack = lines.concat(lines)
    }
  }

  clear () {
    clearCanvas(this.canvasDomEl)
  }
}

function fitCanvasToContainer (canvas) {
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

export {
  getDrawingCanvas
}
