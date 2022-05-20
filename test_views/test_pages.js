import { dwellBtnAndDrawingCanvasTestPage } from './canvas_and_dwell_btns.js'
import { createTestPage } from './data_types.js'
import { createDwellBtn, createPos } from '../src/data_types.js';
import {
  arrangeEquallySizedDwellBtnsToParallelMenu,
  arrangeOneBtnToLowerRight
} from '../src/main_program/dwell_btn_patterns.js';
import { getDwellBtnContainer, getDwellBtnDomEl } from '../src/main_program/view.js';
import { vh, vw } from '../src/util/browser.js';

const drawDwellBtnsPage = () => {
  const container = getDwellBtnContainer();

  const dwellBtnUpperLeft = createDwellBtn({
    center: createPos({x: 150, y: 150}),
    domId: 'dwelBtn1',
    size: createPos({x: 100, y: 100}),
    timeTillActivation: 1000,
    action: () => alert('moin') });

  const dwellBtnUpperLeftLeft = createDwellBtn({
    center: createPos({x: 0, y: 0}),
    domId: 'dwelBtn2',
    size: createPos({x: 100, y: 100}),
    timeTillActivation: 1000,
    action: () => alert('moin')
  });
  const upperLeftBtnEl = getDwellBtnDomEl(dwellBtnUpperLeft);
  const upperLeftLeftBtnEl = getDwellBtnDomEl(dwellBtnUpperLeftLeft);

  const dwellBtnCenter = createDwellBtn({
    center: createPos({x: vw()/2, y: vh()/2}),
    domId: 'dwelBtn3',
    size: createPos({x: 150, y: 100}),
    timeTillActivation: 1000,
    title: 'Dalai Lama',
    action: () => alert('moin')
  });
  const centerBtnEl = getDwellBtnDomEl(dwellBtnCenter);

  container.appendChild(upperLeftBtnEl);
  container.appendChild(upperLeftLeftBtnEl);
  container.appendChild(centerBtnEl);
  document.body.appendChild(container);
};

const testDwellBtns = createTestPage({
  name: 'Dwell Btns',
  drawPage: drawDwellBtnsPage
})

const createStandardDwellBtn = ({domId, action}) => createDwellBtn({
  domId,
  size: createPos({x: 200, y: 100}),
  timeTillActivation: 1000,
  action
});

const drawMenu = ({
  distToNeighbor = createPos({x: 100, y: 50}),
  endIdx = false,
  equallySizedDwellBtns,
  minDistToEdge = createPos({x: 100, y: 50}),
  startIdx = 0
}) => {

  console.log('viewport: ');
  console.log(createPos({x: vw(), y: vh()}));

  const container = getDwellBtnContainer();

  const getNextBtn = newStartIdx => createStandardDwellBtn({
    domId: 'nextBtn',
    action: () => {
      container.remove();
      drawMenu({
        equallySizedDwellBtns,
        startIdx: newStartIdx
      })
    }
  });

  const getPrevBtn = newEndIdx => createStandardDwellBtn({
    domId: 'prevBtn',
    action: () => {
      container.remove();
      drawMenu({
        equallySizedDwellBtns,
        endIdx: newEndIdx
      })
    }
  });

  const {arrangedDwellBtns, hasNextBtn, hasPrevBtn} =
    arrangeEquallySizedDwellBtnsToParallelMenu({
      distToNeighbor,
      endIdx,
      equallySizedDwellBtns,
      minDistToEdge,
      getNextBtn,
      getPrevBtn,
      startIdx,
      viewport: createPos({x: vw(), y: vh()})
    });

  console.log(equallySizedDwellBtns);

  console.log(arrangedDwellBtns);

  for (const arrangedDwellBtn of arrangedDwellBtns) {
    const arrangedDwellBtnDomEl = getDwellBtnDomEl(arrangedDwellBtn);
    container.appendChild(arrangedDwellBtnDomEl);
  }
  document.body.appendChild(container);
};

const drawDwellBtnsMenu = () => {

  const numTestDwellBtns = 15;

  const testDwellBtns = [];
  for (let i = 0; i < numTestDwellBtns; i++) {
    const domId = 'btn' + i;
    testDwellBtns.push(createStandardDwellBtn({
      action: () => alert(domId),
      domId
    }));
  }

  drawMenu({
    equallySizedDwellBtns: testDwellBtns
  });
};

const drawDwellBtnToLowerRight = () => {
  const domId = 'btn';
  const dwellBtn = createStandardDwellBtn({
    action: () => alert(domId),
    domId,
    title: domId
  });

  const arrangedDwellBtn = arrangeOneBtnToLowerRight({
    dwellBtn,
    minDistToEdge: createPos({x: 100, y: 100}),
    viewport: createPos({x: vw(), y: vh()})
  });

  const container = getDwellBtnContainer();
  container.appendChild(getDwellBtnDomEl(arrangedDwellBtn));
  document.body.appendChild(container);
};

const dwellBtnsMenu = createTestPage({
  name: 'Dwell Btns Menu',
  drawPage: drawDwellBtnsMenu
});

const dwellBtnArrangedLowerRight = createTestPage({
  name: 'Dwell Btn arranged lower right',
  drawPage: drawDwellBtnToLowerRight
});
  
const testPages = [
  dwellBtnsMenu,
  dwellBtnArrangedLowerRight,
  testDwellBtns,
  dwellBtnAndDrawingCanvasTestPage
];

const getTestPages = () => testPages;

export {
  getTestPages
};

