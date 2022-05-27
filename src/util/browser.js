import { createPos } from 'Src/data_types/pos.js'

import { oneLineTrim } from 'common-tags'

function vw () {
  return Math.max(document.documentElement.clientWidth ||
    0, window.innerWidth || 0)
}

function vh () {
  return Math.max(document.documentElement.clientHeight ||
    0, window.innerHeight || 0)
}

function getViewport () {
  return createPos({ x: vw(), y: vh() })
}

function createElementFromHTML (html, parentEl) {
  const div = document.createElement('div')
  div.innerHTML = html
  const el = div.firstChild
  if (parentEl) {
    parentEl.appendChild(el)
  }
  return el
}

function getElementCenter (element) {
  const boundingRect = element.getBoundingClientRect()
  return createPos({
    x: Math.round(boundingRect.x + (boundingRect.width / 2)),
    y: Math.round(boundingRect.y + (boundingRect.height / 2))
  })
}

function getElementRadii (el) {
  const boundingRect = el.getBoundingClientRect()
  return createPos({
    x: Math.round(boundingRect.width / 2),
    y: Math.round(boundingRect.height / 2)
  })
}

// For debug purposes
function drawDotOnScreen (pos) {
  const dot = createElementFromHTML(oneLineTrim`
    <div id="dot" style="
      position:absolute;
      left:${pos.x}px;top:${pos.y}px;
      width: 10px; height: 10px;
      margin: 0; padding:0;
      border-radius: 50%;
      background-color: green;
      transform: translate(-50%, -50%)">
    </div>
  `)
  document.body.appendChild(dot)
}

function encodeFormAsURI (form) {
  const encodedDataPairs = []
  form.querySelectorAll('input').forEach((input) => {
    encodedDataPairs.push(encodeURIComponent(input.name) + '=' +
      encodeURIComponent(input.value))
  })
  return encodedDataPairs.join('&').replace(/%20/g, '+')
}

export {
  createElementFromHTML,
  encodeFormAsURI,
  drawDotOnScreen,
  getElementCenter,
  getElementRadii,
  getViewport,
  vh,
  vw
}
