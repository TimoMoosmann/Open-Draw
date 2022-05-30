/* global expect, test */
import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import {
  arrangeEquallySizedDwellBtnsToParallelMenu,
  arrangeOneBtnToLowerRight
} from 'Src/main_program/dwell_btn_patterns.js'

function getTestViewport () {
  return createPos({
    x: 1600, y: 1000
  })
}

function getTestMinDistToEdge () {
  return createPos({
    x: 200, y: 200
  })
}

function getTestDistToNeighbor () {
  return createPos({
    x: 150, y: 150
  })
}

function arrangeToParallelMenuWithTestSettings (args) {
  if (!Object.prototype.hasOwnProperty.call(args, 'minDistToEdge')) {
    args.minDistToEdge = getTestMinDistToEdge()
  }
  if (!Object.prototype.hasOwnProperty.call(args, 'distToNeighbor')) {
    args.distToNeighbor = getTestDistToNeighbor()
  }
  if (!Object.prototype.hasOwnProperty.call(args, 'viewport')) {
    args.viewport = getTestViewport()
  }
  return arrangeEquallySizedDwellBtnsToParallelMenu(args)
};

const createSimpleDwellBtn = ({
  domId,
  center = createPos({ x: 0, y: 0 }),
  size = createPos({ x: 200, y: 200 })
}) => {
  return createDwellBtn({
    center,
    domId,
    size
  })
}

function createTestDwellBtns (numBtns) {
  const btns = []
  for (let i = 1; i <= numBtns; i++) {
    btns.push(createSimpleDwellBtn({ domId: 'btn' + i }))
  }
  return btns
};

const createTestDwellBtnsFromArrangedPositions =
  (arrangedPositions, startIdx = 0) => {
    let currBtnId = startIdx + 1
    const arrangedDwellBtns = []
    for (const row of arrangedPositions) {
      for (const arrangedPos of row) {
        arrangedDwellBtns.push(createSimpleDwellBtn({
          domId: 'btn' + currBtnId,
          center: createPos(arrangedPos)
        }))
        currBtnId++
      }
    }
    return arrangedDwellBtns
  }

const createTestNextBtn = (
  dwellBtnParams = {}
) => {
  return createSimpleDwellBtn({ domId: 'next', ...dwellBtnParams })
}

const createTestPrevBtn = (
  dwellBtnParams = {}
) => {
  return createSimpleDwellBtn({ domId: 'prev', ...dwellBtnParams })
}

function createTestGetNextBtn (
  expectedStartIdx,
  dwellBtnParams = {}
) {
  return givenStartIdx => {
    if (expectedStartIdx === false) {
      // test fails, because in these cases the function should not be called.
      expect(true).toBe(false)
    }
    expect(givenStartIdx).toBe(expectedStartIdx)
    return createTestNextBtn(dwellBtnParams)
  }
}

function createTestGetPrevBtn (
  expectedEndIdx,
  dwellBtnParams = {}
) {
  return givenEndIdx => {
    if (expectedEndIdx === false) {
      // test fails, because in these cases the function should not be called.
      expect(true).toBe(false)
    }
    expect(givenEndIdx).toBe(expectedEndIdx)
    return createTestPrevBtn(dwellBtnParams)
  }
}

function deleteActionsFromDwellBtns (dwellBtnArr) {
  for (let i = 0; i < dwellBtnArr.length; i++) {
    deleteActionFromDwellBtn(dwellBtnArr[i])
  }
};

function deleteActionFromDwellBtn (dwellBtn) {
  delete dwellBtn.action
}

/*
 * Test arrangeEquallySizedDwellBtnsToParallelMenu
 */

test('Illegal equallySizedDwellBtns should throw an error', () => {
  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: 42
  })).toThrow(
    'equallySizedDwellBtns: Object of type EquallySizedDwellBtns ' +
    'is an Array with at least one element.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: []
  })).toThrow(
    'equallySizedDwellBtns: Object of type EquallySizedDwellBtns ' +
    'is an Array with at least one element.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: [42]
  })).toThrow(
    'equallySizedDwellBtns: DwellBtn: Illegal DwellBtn Object, ' +
    'domId needs to be a string'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: [
      createDwellBtn({ domId: 'small', size: createPos({ x: 10, y: 5 }) }),
      createDwellBtn({ domId: 'larger', size: createPos({ x: 100, y: 50 }) })
    ]
  })).toThrow(
    'equallySizedDwellBtns: DwellBtns are not sized equally.'
  )
})

test('It is illegal to give startIdx and endIdx in one function call.', () => {
  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    startIdx: 'hello'
  })).toThrow('startIdx: Needs to be an unsigned Integer.')

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    endIdx: 'hello'
  })).toThrow('endIdx: Needs to be an unsigned Integer.')
})

test('Illegal (sized) getNextBtn return value or getPrevBtn return value ' +
  'should throw an error',
() => {
  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getNextBtn: 42
  })).toThrow(
    'getNextBtn: Needs to be a callback function.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getPrevBtn: 42
  })).toThrow(
    'getPrevBtn: Needs to be a callback function.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getNextBtn: () => 42
  })).toThrow(
    'getNextBtn return: Illegal DwellBtn Object, domId needs to be a string.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getPrevBtn: () => 42,
    startIdx: 3
  })).toThrow(
    'getPrevBtn return: Illegal DwellBtn Object, domId needs to be a string.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getNextBtn: () => createTestNextBtn({
      size: createPos({ x: 199, y: 200 })
    })
  })).toThrow(
    'getNextBtn return: Not sized like equallySizedDwellBtns.'
  )

  expect(() => arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(10),
    getPrevBtn: () => createTestPrevBtn({
      size: createPos({ x: 200, y: 199 })
    }),
    startIdx: 1
  })).toThrow(
    'getPrevBtn return: Not sized like equallySizedDwellBtns.'
  )
}
)

test(
  'Get two rows of dwellBtns when one row is not enough.\n' +
  'Show no prev and next buttons when they are not needed, but given.',
  () => {
    const fiveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(6),
        getNextBtn: createTestGetNextBtn(false),
        getPrevBtn: createTestGetPrevBtn(false)
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 450, y: 325 }),
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 }),
        createPos({ x: 1150, y: 675 })
      ]
    ])

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: false,
      hasPrevBtn: false
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(fiveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(fiveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'The last element of the last row should be the next button, when\n' +
  'there are buttons left in equallySiizedDwellBtns.',
  () => {
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        getNextBtn: createTestGetNextBtn(5),
        getPrevBtn: createTestGetPrevBtn(false)
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 450, y: 325 }),
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 })
      ]
    ])

    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({ x: 1150, y: 675 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: true,
      hasPrevBtn: false
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'The last element should be the next button, and the first element\n' +
  ' should be a prev button, when there are buttons left and the start\n' +
  ' index is larger than 0',
  () => {
    const startIdx = 5
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        // Should have no impact when startIdx is given.
        endIdx: 11,
        getNextBtn: createTestGetNextBtn(9),
        getPrevBtn: createTestGetPrevBtn(4),
        startIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 })
      ]
    ], startIdx)

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({ x: 450, y: 325 })
    }))
    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({ x: 1150, y: 675 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: true,
      hasPrevBtn: true
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'The last element should be the next button, when there are buttons left\n' +
  'and the start index is larger than 0, but not prev btn is defined.',
  () => {
    const startIdx = 5
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        getNextBtn: createTestGetNextBtn(10),
        startIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 450, y: 325 }),
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 })
      ]
    ], startIdx)

    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({ x: 1150, y: 675 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: true,
      hasPrevBtn: false
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'The first element should be the prev button, when there are buttons left\n' +
  'and the start index is larger than 0, but no next btn is defined.',
  () => {
    const startIdx = 5
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        getPrevBtn: createTestGetPrevBtn(4),
        startIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 }),
        createPos({ x: 1150, y: 675 })
      ]
    ], startIdx)

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({ x: 450, y: 325 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: false,
      hasPrevBtn: true
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'The first element should be the prev button, when there are no buttons\n' +
  'left and the start index is larger than 0.',
  () => {
    const startIdx = 9
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        getNextBtn: createTestGetNextBtn(false),
        getPrevBtn: createTestGetPrevBtn(8),
        startIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 })
      ]
    ], startIdx)

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({ x: 450, y: 325 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: false,
      hasPrevBtn: true
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'One big button fits nowhere',
  () => {
    const bigBtnArranged = arrangeToParallelMenuWithTestSettings({
      equallySizedDwellBtns: [
        createSimpleDwellBtn({
          domId: 'btn1',
          size: createPos({
            x: 1300, y: 400
          })
        })
      ]
    })

    const expected = {
      arrangedDwellBtns: [],
      hasNextBtn: false,
      hasPrevBtn: false
    }

    expect(bigBtnArranged).toEqual(expected)
  }
)

test(
  'When endIdx is 2 but 5 buttons are available, show only the first three.',
  () => {
    const endIdx = 2
    const fiveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(5),
        getNextBtn: createTestGetNextBtn(3),
        getPrevBtn: createTestGetPrevBtn(false),
        endIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 450, y: 325 }),
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ]
    ], 0)

    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({ x: 1150, y: 675 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: true,
      hasPrevBtn: false
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(fiveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(fiveTestBtnsArranged).toEqual(expected)
  }
)

test(
  'If endIdx is 10 show button ..., 8, 9, 10, but also prev and next buttons.',
  () => {
    const endIdx = 10
    const twelveTestBtnsArranged =
      arrangeToParallelMenuWithTestSettings({
        equallySizedDwellBtns: createTestDwellBtns(12),
        getNextBtn: createTestGetNextBtn(11),
        getPrevBtn: createTestGetPrevBtn(6),
        endIdx
      })

    const expectedArrangedDwellBtns = createTestDwellBtnsFromArrangedPositions([
      [
        createPos({ x: 800, y: 325 }),
        createPos({ x: 1150, y: 325 })
      ],
      [
        createPos({ x: 450, y: 675 }),
        createPos({ x: 800, y: 675 })
      ]
    ], endIdx - 3)

    expectedArrangedDwellBtns.unshift(createTestPrevBtn({
      center: createPos({ x: 450, y: 325 })
    }))
    expectedArrangedDwellBtns.push(createTestNextBtn({
      center: createPos({ x: 1150, y: 675 })
    }))

    const expected = {
      arrangedDwellBtns: expectedArrangedDwellBtns,
      hasNextBtn: true,
      hasPrevBtn: true
    }

    // Necassary because functions can't be compared properly.
    deleteActionsFromDwellBtns(twelveTestBtnsArranged.arrangedDwellBtns)
    deleteActionsFromDwellBtns(expected.arrangedDwellBtns)

    expect(twelveTestBtnsArranged).toEqual(expected)
  }
)

test('When the viewport is to little, no buttons should be displayed.', () => {
  const arrangedWithToSmallViewport = arrangeToParallelMenuWithTestSettings({
    equallySizedDwellBtns: createTestDwellBtns(12),
    getNextBtn: createTestGetNextBtn(false),
    getPrevBtn: createTestGetPrevBtn(false),
    viewport: createPos({ x: 1200, y: 400 })
  })

  const expected = {
    arrangedDwellBtns: [],
    hasNextBtn: false,
    hasPrevBtn: false
  }

  expect(arrangedWithToSmallViewport).toEqual(expected)
})

// Test arrangeOneBtnToLowerRight
test('When there is space for the dwellBtn place it correctly.', () => {
  const dwellBtn = createSimpleDwellBtn({ domId: 'btn' })
  const minDistToEdge = getTestMinDistToEdge()
  const viewport = getTestViewport()

  const dwellBtnArrangedToLowerRight =
    arrangeOneBtnToLowerRight({ dwellBtn, minDistToEdge, viewport })

  const expected = createSimpleDwellBtn({
    domId: 'btn',
    center: createPos({ x: 1300, y: 700 })
  })

  deleteActionFromDwellBtn(dwellBtnArrangedToLowerRight)
  deleteActionFromDwellBtn(expected)

  expect(dwellBtnArrangedToLowerRight).toEqual(expected)
})
