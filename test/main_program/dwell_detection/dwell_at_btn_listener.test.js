/* global expect, test */
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createDwellBtnProgress, evaluateEyeFixationsAtDwellBtns } from 'Src/main_program/dwell_detection/dwell_at_btn_listener.js'
import { createPos } from 'Src/data_types/pos.js'
import { createFixation } from 'Src/webgazer_extensions/fixation_detection/data_types/fixation.js'

function getNoCurrentBtnProgress () {
  return createDwellBtnProgress()
}

test(
  'Fixation outside of button should not trigger an action.\n' +
  'Current button should be redrawn with 0% progress.',
  done => {
    let displayCurrentBtnProgressTriggered = false

    const testDwellBtnCentered = createDwellBtn({
      center: createPos({ x: 350, y: 300 }),
      domId: 'testBtn',
      size: createPos({ x: 300, y: 200 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })
    const currentBtnProgress = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 0.3
    })

    const btnProgress0 = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 0
    })
    const shortFixationUpperLeft = createFixation({
      center: createPos({ x: 200, y: 200 }),
      duration: 300
    })
    const longFixationLowerRight = createFixation({
      center: createPos({ x: 1200, y: 700 }),
      duration: 3000
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: shortFixationUpperLeft,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        displayCurrentBtnProgressTriggered = true
        expect(targetBtn).toEqual(btnProgress0)
      }
    })
    expect(currentBtnProgress).toEqual(getNoCurrentBtnProgress())

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: longFixationLowerRight,
      currentBtnProgress,
      // if callback is triggered the test fails
      displayCurrentBtnProgress: target => expect(true).toBe(false)
    })
    expect(currentBtnProgress).toEqual(getNoCurrentBtnProgress())

    // Give buffer for callbacks to finish.
    setTimeout(() => {
      expect(displayCurrentBtnProgressTriggered).toBe(true)
      done()
    }, 200)
  }
)

test(
  'A false fixation (is triggerd at the end of a fixation), ' +
  'should not trigger an action, but reset currentBtnProgress to 0' +
  'and redraw current button with 0 progress',
  done => {
    let displayCurrentBtnProgressTriggered = false
    const testDwellBtnCentered = createDwellBtn({
      center: createPos({ x: 700, y: 500 }),
      domId: 'testBtn2',
      size: createPos({ x: 300, y: 200 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })
    const currentBtnProgress = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered, progress: 0.5
    })

    const falseFixation = false
    const btnProgress0 = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 0
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: falseFixation,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        displayCurrentBtnProgressTriggered = true
        expect(targetBtn).toEqual(btnProgress0)
      }
    })
    expect(currentBtnProgress).toEqual(getNoCurrentBtnProgress())
    // Give buffer for callbacks to finish.
    setTimeout(() => {
      expect(displayCurrentBtnProgressTriggered).toBe(true)
      done()
    }, 200)
  }
)

test(
  'Fixation inside a dwell button where time is less than the activation time,' +
  'should trigger a redraw with the progress of the button.',
  done => {
    let displayCurrentBtnProgressTriggered = false
    const testDwellBtnCentered = createDwellBtn({
      center: createPos({ x: 600, y: 450 }),
      domId: 'testBtn3',
      size: createPos({ x: 300, y: 200 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })
    const currentBtnProgress = getNoCurrentBtnProgress()

    const shortFixationCenter = createFixation({
      center: createPos({ x: 700, y: 400 }),
      duration: 400
    })
    const btnProgress40 = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 0.4
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: shortFixationCenter,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        displayCurrentBtnProgressTriggered = true
        expect(currentBtnProgress).toEqual(btnProgress40)
      }
    })
    expect(currentBtnProgress).toEqual(btnProgress40)
    // Give buffer for possible callback calls to finish.
    setTimeout(() => {
      expect(displayCurrentBtnProgressTriggered).toBe(true)
      done()
    }, 200
    )
  }
)

test(
  'A Fixation inside a dwell button which is long enough, should trigger ' +
  'a redraw with the 100% progress, and invoke the buttons action.' +
  'But if an action was already triggerd it should be blocked for the ' +
  'follwing even longer fixations.',
  done => {
    const currentBtnProgress = getNoCurrentBtnProgress()
    let btnActionTriggeredCount = 0
    let displayCurrentBtnProgressTriggeredFirst = false
    let displayCurrentBtnProgressTriggeredSecond = false
    const testDwellBtnCentered = createDwellBtn({
      center: createPos({ x: 700, y: 400 }),
      domId: 'testBtn4',
      size: createPos({ x: 300, y: 200 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => btnActionTriggeredCount++
    })

    const longFixationAtCenter = createFixation({
      center: createPos({ x: 700, y: 500 }),
      duration: 1200
    })
    const evenLongerFixationAtCenter = createFixation({
      center: createPos({ x: 850, y: 400 }),
      duration: 1400
    })
    const btnProgress100 = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 1
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: longFixationAtCenter,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        displayCurrentBtnProgressTriggeredFirst = true
        expect(targetBtn).toEqual(btnProgress100)
      }
    })
    expect(currentBtnProgress).toEqual(btnProgress100)

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered],
      fixation: evenLongerFixationAtCenter,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        displayCurrentBtnProgressTriggeredSecond = true
        expect(targetBtn).toEqual(btnProgress100)
      }
    })
    expect(currentBtnProgress).toEqual(btnProgress100)

    // Give buffer for callbacks to finish.
    setTimeout(
      () => {
        expect(displayCurrentBtnProgressTriggeredFirst).toBe(true)
        expect(displayCurrentBtnProgressTriggeredSecond).toBe(true)
        expect(btnActionTriggeredCount).toBe(1)
        done()
      }, 200
    )
  }
)

test(
  'displayCurrentBtnProgress should only be triggered one time, when there ' +
  'is more than one Button',
  done => {
    let timesDisplayCurrentBtnProgressTriggered = 0

    const testDwellBtnCentered = createDwellBtn({
      center: createPos({ x: 350, y: 300 }),
      domId: 'testBtn',
      size: createPos({ x: 300, y: 200 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })
    const testDwellBtnUpperLeft = createDwellBtn({
      center: createPos({ x: 100, y: 100 }),
      domId: 'testBtn2',
      size: createPos({ x: 100, y: 100 }),
      activationTime: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })
    const currentBtnProgress = createDwellBtnProgress({
      dwellBtn: false,
      progress: 0
    })

    const btnProgress30 = createDwellBtnProgress({
      dwellBtn: testDwellBtnCentered,
      progress: 0.3
    })

    const shortFixationUpperLeft = createFixation({
      center: createPos({ x: 300, y: 300 }),
      duration: 300
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCentered, testDwellBtnUpperLeft],
      fixation: shortFixationUpperLeft,
      currentBtnProgress,
      displayCurrentBtnProgress: targetBtn => {
        timesDisplayCurrentBtnProgressTriggered++
        expect(targetBtn).toEqual(btnProgress30)
      }
    })
    expect(currentBtnProgress).toEqual(btnProgress30)

    // Give buffer for callbacks to finish.
    setTimeout(() => {
      expect(timesDisplayCurrentBtnProgressTriggered).toBe(1)
      done()
    }, 200)
  }
)
