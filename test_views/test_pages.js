import { createDwellBtn, createPos } from '../src/data_types.js';
import { getDwellBtnContainer, getDwellBtnDomEl } from '../src/main_program/view.js';
import { vh, vw } from '../src/util/browser.js';

const createTestPage = ({
  name,
  getPage
}) => ({
  name,
  getPage
});

const getDwellBtnsPage = () => {
  const container = getDwellBtnContainer();

  const dwellBtnUpperLeft = createDwellBtn({
    center: createPos({x: 0, y: 0}),
    domId: 'dwelBtn1',
    size: createPos({x: 200, y: 100}),
    timeTillActivation: 1000,
    action: () => alert('moin')
  });
  const upperLeftBtnEl = getDwellBtnDomEl(dwellBtnUpperLeft);

  const dwellBtnCenter = createDwellBtn({
    center: createPos({x: vw()/2, y: vh()/2}),
    domId: 'dwelBtn2',
    size: createPos({x: 250, y: 200}),
    timeTillActivation: 1000,
    action: () => alert('moin')
  });
  const centerBtnEl = getDwellBtnDomEl(dwellBtnCenter);

  container.appendChild(upperLeftBtnEl);
  container.appendChild(centerBtnEl);
  return container;
};

const testDwellBtns = createTestPage({
  name: 'Dwell Btns',
  getPage: getDwellBtnsPage
})

const testPages = [
  testDwellBtns
];

const getTestPages = () => testPages;

export {
  getTestPages
};

