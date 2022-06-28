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

function getDwellBtnDomEl (dwellBtn, getDwellBtnBackgroundColor) {
  const btnWidth = dwellBtn.ellipse.radii.x * 2
  const btnHeight = dwellBtn.ellipse.radii.y * 2
  const left = dwellBtn.ellipse.center.x
  const top = dwellBtn.ellipse.center.y
  const titleTop = top - dwellBtn.ellipse.radii.y

  const dwellBtnTitleHTML = dwellBtn.title
    ? html`
      <div class="dwellBtnTitleHolder"
          style="left: ${left}px; top: calc(${titleTop}px - 1rem)">
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

  btnEl.style.backgroundColor = getDwellBtnBackgroundColor(0.1)

  if (dwellBtn.colorDot) {
    btnEl.appendChild(getColorDotEl(dwellBtn.colorDot))
  }
  showIcon(btnEl, dwellBtn.icon)
  btnEl.addEventListener('click', dwellBtn.action)
  return btnContainer
}

function changeDwellBtnIconAndText (dwellBtn, second) {
  const btnEl = document.getElementById(dwellBtn.domId)
  showIcon(btnEl, second ? dwellBtn.secondIcon : dwellBtn.icon)
  const title = second ? dwellBtn.secondTitle : dwellBtn.title
  if (title) {
    btnEl.parentNode.querySelector('.dwellBtnTitle').innerHTML = title
  }
}

function showIcon (btnEl, icon) {
  if (btnEl && icon) {
    btnEl.style.backgroundImage = `url(${icon})`
  }
}

function shadeBtnLinear (
  btnDomId, activationProgress, getDwellBtnBackgroundColor

) {
  const btnDomEl = document.getElementById(btnDomId)
  if (btnDomEl) {
    const bgColor = getDwellBtnBackgroundColor(activationProgress / 2 + 0.1)
    // 1.0 when not focused, 0.5 when focused till activation.
    btnDomEl.style.backgroundColor = bgColor
  }
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
  const drawingCanvasDomEl =
    drawingCanvasContainer.querySelector('#drawingCanvas')
  return {
    drawingCanvasDomEl, drawingCanvasContainer
  }
}

function getBackgroundGrid () {
  return createElementFromHTML(html`
    <div id="backgroundGrid">
    </div>
  `)
}

export {
  changeDwellBtnIconAndText,
  getBackgroundGrid,
  getDrawingCanvasInContainer,
  getDwellBtnDomEl,
  getDwellBtnContainer,
  getMainProgramContainer,
  shadeBtnLinear
}
