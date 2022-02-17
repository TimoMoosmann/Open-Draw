import {createPos} from '../data_types.js';

const vw = () => {
  return Math.max(document.documentElement.clientWidth
    || 0, window.innerWidth || 0);
};

const vh = () => {
  return Math.max(document.documentElement.clientHeight
    || 0, window.innerHeight || 0);
};

function createElement(elemName, id="", classList = [], attributes = []) {
  let elem = document.createElement(elemName);
  elem.id = id;
  elem.classList.add(...classList);
  attributes.forEach((attr) => elem.setAttribute(attr[name], attr[value]));
  return elem;
}

function createElementFromHTML(html, parentEl) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const el = div.firstChild;
  if (parentEl) {
    parentEl.appendChild(el);
  }
  return el;
}

function getWholeWindowContainer(id, extraClasses=[], attributes=[]) {
  return createElement('div', id, ['wholeWindowContainer', ...extraClasses],
    attributes);
}

const getElementCenter = element => {
  const boundingRect = element.getBoundingClientRect();
  return createPos({
    x: Math.round(boundingRect.x + (boundingRect.width / 2)),
    y: Math.round(boundingRect.y + (boundingRect.height / 2))
  });
};

const getElementRadii = el => {
  const boundingRect = el.getBoundingClientRect();
  return createPos({
    x: Math.round(boundingRect.width / 2),
    y: Math.round(boundingRect.height / 2)
  });
};

import {oneLineTrim} from 'common-tags';
// For debug purposes
const drawDotOnScreen = pos => {
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
  `);
  document.body.appendChild(dot);
};

function encodeFormAsURI(form) {
  const encodedDataPairs = [];
  form.querySelectorAll('input').forEach((input) => {
    encodedDataPairs.push(encodeURIComponent(input.name) + '='
      + encodeURIComponent(input.value));
  });
  return encodedDataPairs.join('&').replace(/%20/g, '+');
}

export {
  createElementFromHTML, drawDotOnScreen, getElementCenter, getElementRadii,
  vh, vw
};

