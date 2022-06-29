import { createElementFromHTML } from 'Src/util/browser.js'

import { html } from 'common-tags'

import 'Assets/css/main_program.css'

function getLineWidthDisplay ({
  lineWidth,
  left,
  top,
  anchorIsCenterX,
  anchorIsCenterY,
  lang
}) {
  const displayEl = createElementFromHTML(html`
    <div
      id="lineWidthDisplayContainer"
      style="left: ${left}px;top: ${top}px"
    >
      <h2>
        ${(lang === 'de') ? 'Linienbreite' : 'Line Width'}:
        <span id="lineWidth">${lineWidth}</span>
      </h2>
    </div>
  `)
  if (anchorIsCenterX) {
    displayEl.style.transform = 'translateX(-50%)'
  }
  if (anchorIsCenterY) {
    displayEl.style.transform += 'translateY(-50%)'
  }
  return displayEl
}

export {
  getLineWidthDisplay
}
