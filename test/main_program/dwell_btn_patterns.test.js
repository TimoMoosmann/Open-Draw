import { createDwellBtn, createPos } from '../../src/data_types.js';
import { arrangeEquallySizedDwellBtnsToParallelMenu } from '../../src/main_program/dwell_btn_patterns.js';

const getTestViewport = () => createPos({
  x: 1600, y: 1000
});

const getTestMinDistToEdge = () => createPos({
  x: 200, y: 200
});

const getTestDistToNeighbor = () => createPos({
  x: 150, y: 150
});

const arrangeToParallelMenuWithTestSettings = args => {
  return arrangeEquallySizedDwellBtnsToParallelMenu({
    ...args,
    minDistToEdge: getTestMinDistToEdge(),
    distToNeighbor: getTestDistToNeighbor(),
    viewport: getTestViewport()
  });
};

const createSimpleDwellBtn = ({
  domId,
  center = createPos({x: 0, y: 0}),
  size = createPos({x: 200, y: 200})
})=> {
  return createDwellBtn({
    center,
    domId,
    size
  });
};

const createTestDwellBtns = numBtns => {
  const btns = [];
  for (let i = 1; i <= numBtns; i++) {
    btns.push(createSimpleDwellBtn({domId: 'btn' + i}));
  }
  return btns;
};

const createTestDwellBtnsFromArrangedPositions =
  (arrangedPositions, startIdx = 0) => {
    let currBtnId = startIdx + 1;
    const arrangedDwellBtns = [];
    for (const row of arrangedPositions) {
      for (const arrangedPos of row) {
        arrangedDwellBtns.push(createSimpleDwellBtn({
          domId: 'btn' + currBtnId,
          center: createPos(arrangedPos)
        }));
        currBtnId++;
      }
    }
    return arrangedDwellBtns; 
  };

const createTestNextBtn = (dwellBtnParams = {})=> {
  return createSimpleDwellBtn({domId: 'next', ...dwellBtnParams});
};

const createTestPrevBtn = (dwellBtnParams = {}) => {
  return createSimpleDwellBtn({domId: 'prev', ...dwellBtnParams});
};

const deleteActionsFromDwellBtns = dwellBtnArr => {
  for (let i = 0; i < dwellBtnArr.length; i++) {
    delete dwellBtnArr[i]['action'];
  }
};

/*
 * Test arrangeEquallySizedDwellBtnsToParallelMenu
 */

test('Illegal equallySizedDwellBtns should throw an error', () => {
  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: 42
  })).toThrow(
    'equallySizedDwellBtns: Object of type EquallySizedDwellBtns ' +
    'is an Array with at least one element.'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: []
  })).toThrow(
    'equallySizedDwellBtns: Object of type EquallySizedDwellBtns ' +
    'is an Array with at least one element.'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: [42]
  })).toThrow(
    'equallySizedDwellBtns: DwellBtn: Illegal DwellBtn Object, ' +
    'domId needs to be a string'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: [
      createDwellBtn({domId: 'small', size: createPos({x: 10, y: 5})}),
      createDwellBtn({domId: 'larger', size: createPos({x: 100, y: 50})}),
    ]
  })).toThrow(
    'equallySizedDwellBtns: DwellBtns are not sized equally.'
  );
});

test('Illegal (sized) next or prevBtn should throw an error', () => {
  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    nextBtn: 42
  })).toThrow(
    'nextBtn: Illegal DwellBtn Object, domId needs to be a string.'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    prevBtn: 42
  })).toThrow(
    'prevBtn: Illegal DwellBtn Object, domId needs to be a string.'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    nextBtn: createTestNextBtn({size: createPos({x: 199, y: 200})})
  })).toThrow(
    'nextBtn: Not sized like equallySizedDwellBtns.'
  );

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    prevBtn: createTestPrevBtn({size: createPos({x: 200, y: 199})})
  })).toThrow(
    'prevBtn: Not sized like equallySizedDwellBtns.'
  );
});

test(
  'Get two rows of dwellBtns when one row is not enough.\n' +
  'Show no prev and next buttons when they are not needed, but given.',
  () => {

    const fiveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(6),
        nextBtn: createTestNextBtn(),
        prevBtn: createTestPrevBtn()
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 450, y: 325}),
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
        createPos({x: 800, y: 675}),
        createPos({x: 1150, y: 675}),
      ]
    ]);

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 5
    };

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(fiveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(fiveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'The last element of the last row should be the next button, when\n' +
  'there are buttons left in equallySiizedDwellBtns.',
  () => {

    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        nextBtn: createTestNextBtn(),
        prevBtn: createTestPrevBtn()
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 450, y: 325}),
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
        createPos({x: 800, y: 675}),
      ]
    ]);

    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({x: 1150, y: 675})
    }));

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 4
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(twelveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'The last element should be the next button, and the first element\n' +
  ' should be a prev button, when there are buttons left and the start\n' +
  ' index is larger than 0',
  () => {

    const startIdx = 5;
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        nextBtn: createTestNextBtn(),
        prevBtn: createTestPrevBtn(),
        startIdx
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
        createPos({x: 800, y: 675}),
      ]
    ], startIdx);

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({x: 450, y: 325})
    }));
    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({x: 1150, y: 675})
    }));

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 8
    };

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(twelveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'The last element should be the next button, when there are buttons left\n' +
  'and the start index is larger than 0, but not prev btn is defined.',
  () => {

    const startIdx = 5;
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        nextBtn: createTestNextBtn(),
        startIdx
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 450, y: 325}),
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
        createPos({x: 800, y: 675}),
      ]
    ], startIdx);

    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({x: 1150, y: 675})
    }));

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 9
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(twelveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'The first element should be the prev button, when there are buttons left\n' +
  'and the start index is larger than 0, but no next btn is defined.',
  () => {

    const startIdx = 5;
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        prevBtn: createTestPrevBtn(),
        startIdx
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
        createPos({x: 800, y: 675}),
        createPos({x: 1150, y: 675}),
      ]
    ], startIdx);

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({x: 450, y: 325})
    }));

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 9
    };

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(twelveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'The first element should be the prev button, when there are no buttons\n' +
  'left and the start index is larger than 0.',
  () => {
    const startIdx = 9;
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        nextBtn: createTestNextBtn(),
        prevBtn: createTestPrevBtn(),
        startIdx
      });

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({x: 800, y: 325}),
        createPos({x: 1150, y: 325}),
      ],
      [
        createPos({x: 450, y: 675}),
      ]
    ], startIdx);

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({x: 450, y: 325})
    }));

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      lastArrangedBtnIdx: 11
    };

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns);
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns);

    expect(twelveTestBtnsArranged).toEqual(expected);
  }
);

test(
  'One big button fits nowhere',
  () => {
    const bigBtnArranged = arrangeToParallelMenuWithTestSettings({
      equallySizedDwellBtns: [
        createSimpleDwellBtn({domId: 'btn1', size: createPos({
          x: 1300, y: 400
        })})
      ]
    });

    const expected = {
      arrangedDwellBtns: [],
      lastArrangedBtnIdx: -1
    };

    expect(bigBtnArranged).toEqual(expected);
  }
);

