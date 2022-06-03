/* global MutationObserver */
import { drawLines } from 'Src/main_program/draw.js'
import { createElementFromHTML } from 'Src/util/browser.js'

import { html } from 'common-tags'

import 'Assets/css/style.css'
import 'Assets/css/main_program.css'
import 'Assets/css/main_menu.css'

function getMainProgramContainer () {
  return createElementFromHTML(html`
    <div id="mainProgramContainer"></div>
  `)
}

function getDwellBtnContainer () {
  return createElementFromHTML(html`
    <div id="dwellBtnContainer">
    </div>
  `)
}

function getDwellBtnDomEl (dwellBtn) {
  const btnWidth = dwellBtn.ellipse.radii.x * 2
  const btnHeight = dwellBtn.ellipse.radii.y * 2
  const left = dwellBtn.ellipse.center.x
  const top = dwellBtn.ellipse.center.y
  const titleTop = top - dwellBtn.ellipse.radii.y

  const dwellBtnTitleHTML = dwellBtn.title
    ? html`
      <div class="dwellBtnTitleHolder"
          style="left: ${left}px; top: calc(${titleTop}px - 1.3rem)">
        <h2 class="dwellBtnTitle">
          ${dwellBtn.title}
        </h2>
      </div>
    `
    : ''

  const btnContainer = createElementFromHTML(html`
    <div>
      ${dwellBtnTitleHTML}
      <button id="${dwellBtn.domId}" class="dwellBtn"
        style="width:${btnWidth}px; height:${btnHeight}px;
          left:${left}px; top:${top}px"
      >
      </button>
    </div>
  `)
  const btnEl = btnContainer.querySelector('.dwellBtn')

  if (dwellBtn.colorDot) {
    btnEl.appendChild(getColorDotEl(dwellBtn.colorDot))
  }

  if (dwellBtn.icon) {
    btnEl.style.backgroundImage = `url(${dwellBtn.icon})`
  }

  btnEl.addEventListener('click', dwellBtn.action)
  return btnContainer
}

function getColorDotEl (color) {
  const colorDot = createElementFromHTML(html`
    <div class="colorDot">
    </div>
  `)
  colorDot.style.backgroundColor = color
  return colorDot
}

function getDrawingCanvasInContainer () {
  const drawingCanvasContainer = createElementFromHTML(html`
    <div id="canvasContainer">
      <canvas id="drawingCanvas">
      </canvas>
    </div>
  `)
  const drawingCanvas = drawingCanvasContainer.querySelector('#drawingCanvas')
  console.log(drawingCanvas)
  let canvasReady = false
  let linesStack = []
  // Stack lines they should be drawn, but the canvas is not ready.
  drawingCanvas.drawLines = lines => {
    if (canvasReady) {
      drawLines(lines, drawingCanvas)
    } else {
      linesStack = linesStack.concat(lines)
    }
  }

  // Draw all stacked lines when the canvas is ready.
  const drawingCanvasAddedToDocumentObserver = new MutationObserver(
    (mutations, observer) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.contains(drawingCanvas)) {
            fitCanvasToContainer(drawingCanvas)
            observer.disconnect()
            canvasReady = true
            drawingCanvas.drawLines(linesStack)
          }
        }
      }
    }
  )
  drawingCanvasAddedToDocumentObserver.observe(document, {
    subtree: true, childList: true
  })

  return { drawingCanvas, drawingCanvasContainer }
}

function fitCanvasToContainer (canvas) {
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

export {
  getDrawingCanvasInContainer,
  getDwellBtnDomEl,
  getDwellBtnContainer,
  getMainProgramContainer
}
