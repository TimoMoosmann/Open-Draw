/* global MutationObserver */
import { drawLines } from './main.js'
import { createElementFromHTML } from '../util/browser.js'

import { html } from 'common-tags'

import '../../assets/css/style.css'
import '../../assets/css/main_program.css'
import '../../assets/css/main_menu.css'

const getMainProgramContainer = () => createElementFromHTML(html`
  <div id="mainProgramContainer"></div>
`)

const getDwellBtnContainer = () => createElementFromHTML(html`
  <div class="dwellBtnContainer">
  </div>
`)

const getDwellBtnDomEl = dwellBtn => {
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
      <button id="${dwellBtn.domId}" class="dwellBtnSingle"
        style="width:${btnWidth}px; height:${btnHeight}px;
          left:${left}px; top:${top}px"
      >
      </button>
    </div>
  `)
  const btnEl = btnContainer.querySelector('.dwellBtnSingle')
  btnEl.style.backgroundImage = `url(${dwellBtn.icon})`
  btnEl.addEventListener('click', dwellBtn.action)
  return btnContainer
}

const getMainMenuPage = () => createElementFromHTML(html`
  <div id="mainMenuContainer">
    <button id="drawBtn" class="dwellBtn">
      <h2>Draw</h2>
    </button>
    <button id="moveBtn" class="dwellBtn">
      <h2>Move & Zoom</h2>
    </button>
    <button id="editBtn" class="dwellBtn">
      <h2>Edit</h2>
    </button>
    <button id="colorBtn" class="dwellBtn">
      <h2>Color</h2>
    </button>
  </div>
`)

const getDrawingCanvasInContainer = () => {
  const drawingCanvasContainer = createElementFromHTML(html`
    <div id="canvasContainer">
      <canvas id="drawingCanvas">
      </canvas>
    </div>
  `)
  const drawingCanvas = drawingCanvasContainer.querySelector('#drawingCanvas')
  let canvasReady = false
  let stack = []
  drawingCanvas.drawLines = lines => {
    if (canvasReady) {
      drawLines({ drawingCanvas, lines })
    } else {
      stack = stack.concat(lines)
    }
  }

  const drawingCanvasAddedToDocumentObserver = new MutationObserver(
    (mutations, observer) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.contains(drawingCanvas)) {
            fitCanvasToContainer(drawingCanvas)
            observer.disconnect()
            canvasReady = true
            drawingCanvas.drawLines(stack)
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

const fitCanvasToContainer = canvas => {
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
}

export {
  getDrawingCanvasInContainer, getMainMenuPage, getDwellBtnDomEl,
  getDwellBtnContainer, getMainProgramContainer
}
