import '../../assets/css/style.css';

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

const getWindowCoordinates = (element) => {
  const boundingRect = element.getBoundingClientRect();
  return createPos({
    x: Math.round(boundingRect.x + (boundingRect.width / 2)),
    y: Math.round(boundingRect.y + (boundingRect.height / 2))
  });
}

function encodeFormAsURI(form) {
  const encodedDataPairs = [];
  form.querySelectorAll('input').forEach((input) => {
    encodedDataPairs.push(encodeURIComponent(input.name) + '='
      + encodeURIComponent(input.value));
  });
  return encodedDataPairs.join('&').replace(/%20/g, '+');
}

export {createElementFromHTML, getWindowCoordinates, vh, vw};

