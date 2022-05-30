/* global expect, test */
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'
import { createDwellBtnProgress } from 'Src/main_program/data_types/dwell_btn_progress.js'
import { evaluateEyeFixationsAtDwellBtns } from 'Src/main_program/evaluate_fixations.js'
import { createPos } from 'Src/data_types/pos.js'
import { createFixation } from 'Src/webgazer_extensions/fixation_detection/data_types/fixation.js'

function getNoCurrentBtn () {
  return createDwellBtnProgress({
    btnId: false, progressInPct: 0
  })
}

test(
  'Fixation outside of button should not trigger an action.\n' +
  'Current button should be redrawn with 0% progress.',
  done => {
    const currentBtn = createDwellBtnProgress({
      btnId: 'testBtn', progressInPct: 30
    })
    let onGazeAtBtnTriggered = false

    const testDwellBtnCenterd = createDwellBtn({
      center: createPos({ x: 350, y: 300 }),
      domId: 'testBtn',
      size: createPos({ x: 300, y: 200 }),
      timeTillActivation: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })

    const btnProgress0 = createDwellBtnProgress({
      btnId: 'testBtn',
      progressInPct: 0
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
      dwellBtns: [testDwellBtnCenterd],
      fixation: shortFixationUpperLeft,
      currentBtn,
      onGazeAtBtn: targetBtn => {
        onGazeAtBtnTriggered = true
        expect(targetBtn).toEqual(btnProgress0)
      }
    })
    expect(currentBtn).toEqual(getNoCurrentBtn())

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCenterd],
      fixation: longFixationLowerRight,
      currentBtn,
      // if callback is triggered the test fails
      onGazeAtBtn: target => expect(true).toBe(false)
    })
    expect(currentBtn).toEqual(getNoCurrentBtn())

    // Give buffer for callbacks to finish.
    setTimeout(() => {
      expect(onGazeAtBtnTriggered).toBe(true)
      done()
    }, 200)
  }
)

test(
  'A false fixation (is triggerd at the end of a fixation), ' +
  'should not trigger an action, but reset currentBtn to null' +
  'and redraw current button with 0 progress',
  done => {
    const currentBtn = createDwellBtnProgress({
      btnId: 'testBtn2', progressInPct: 50
    })
    let onGazeAtBtnTriggered = false
    const testDwellBtnCenterd = createDwellBtn({
      center: createPos({ x: 700, y: 500 }),
      domId: 'testBtn2',
      size: createPos({ x: 300, y: 200 }),
      timeTillActivation: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })

    const falseFixation = false
    const btnProgress0 = createDwellBtnProgress({
      btnId: 'testBtn2',
      progressInPct: 0
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCenterd],
      fixation: falseFixation,
      currentBtn,
      onGazeAtBtn: targetBtn => {
        onGazeAtBtnTriggered = true
        expect(targetBtn).toEqual(btnProgress0)
      }
    })
    expect(currentBtn).toEqual(getNoCurrentBtn())
    // Give buffer for callbacks to finish.
    setTimeout(() => {
      expect(onGazeAtBtnTriggered).toBe(true)
      done()
    }, 200)
  }
)

test(
  'Fixation inside a dwell button where time is less than the activation time,' +
  'should trigger a redraw with the progress of the button.',
  done => {
    const currentBtn = getNoCurrentBtn()
    let onGazeAtBtnTriggered = false
    const testDwellBtnCenterd = createDwellBtn({
      center: createPos({ x: 600, y: 450 }),
      domId: 'testBtn3',
      size: createPos({ x: 300, y: 200 }),
      timeTillActivation: 1000,
      // if action is triggered the test fails
      action: () => expect(true).toBe(false)
    })

    const shortFixationCenter = createFixation({
      center: createPos({ x: 700, y: 400 }),
      duration: 400
    })
    const btnProgress40 = createDwellBtnProgress({
      btnId: 'testBtn3',
      progressInPct: 40
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCenterd],
      fixation: shortFixationCenter,
      currentBtn,
      onGazeAtBtn: targetBtn => {
        onGazeAtBtnTriggered = true
        expect(currentBtn).toEqual(btnProgress40)
      }
    })
    expect(currentBtn).toEqual(btnProgress40)
    // Give buffer for possible callback calls to finish.
    setTimeout(() => {
      expect(onGazeAtBtnTriggered).toBe(true)
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
    const currentBtn = getNoCurrentBtn()
    let btnActionTriggeredCount = 0
    let onGazeAtBtnTriggeredFirst = false
    let onGazeAtBtnTriggeredSecond = false
    const testDwellBtnCenterd = createDwellBtn({
      center: createPos({ x: 700, y: 400 }),
      domId: 'testBtn4',
      size: createPos({ x: 300, y: 200 }),
      timeTillActivation: 1000,
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
      btnId: 'testBtn4',
      progressInPct: 100
    })

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCenterd],
      fixation: longFixationAtCenter,
      currentBtn,
      onGazeAtBtn: targetBtn => {
        onGazeAtBtnTriggeredFirst = true
        expect(targetBtn).toEqual(btnProgress100)
      }
    })
    expect(currentBtn).toEqual(btnProgress100)

    evaluateEyeFixationsAtDwellBtns({
      dwellBtns: [testDwellBtnCenterd],
      fixation: evenLongerFixationAtCenter,
      currentBtn,
      onGazeAtBtn: targetBtn => {
        onGazeAtBtnTriggeredSecond = true
        expect(targetBtn).toEqual(btnProgress100)
      }
    })
    expect(currentBtn).toEqual(btnProgress100)

    // Give buffer for callbacks to finish.
    setTimeout(
      () => {
        expect(onGazeAtBtnTriggeredFirst).toBe(true)
        expect(onGazeAtBtnTriggeredSecond).toBe(true)
        expect(btnActionTriggeredCount).toBe(1)
        done()
      }, 200
    )
  }
)
