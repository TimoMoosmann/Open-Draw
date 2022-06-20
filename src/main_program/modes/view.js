import { createElementFromHTML } from 'Src/util/browser.js'
import { lang } from 'Settings'

import { html } from 'common-tags'

import 'Assets/css/main_program.css'

function getLineWidthDisplay (lineWidth, left, top) {
  return createElementFromHTML(html`
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
}

export {
  getLineWidthDisplay
}
