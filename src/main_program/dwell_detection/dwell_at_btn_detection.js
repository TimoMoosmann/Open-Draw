/*
 * Dwell at Btn listener listens to a fixation detector, while
 * dwell at Btn detection only collects screenpoints that hit a button.
 */
import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { getTimeSpan } from 'Src/main_program/dwell_detection/util.js'
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { changeDwellBtnIconAndText, shadeBtnLinear } from 'Src/main_program/view.js'
import { addScreenPointListener } from 'Src/util/main.js'

function activateBtnsOnDwell ({
  btns,
  buckets,
  changeIconAndText = () => {},
  id,
  shadeBtn = () => {},
  timedGazePoint
}) {
  for (let i = 0; i < btns.length; i++) {
    let progress = 0
    if (inEllipse(timedGazePoint.pos, btns[i].ellipse)) {
      const bucket = buckets[i]
      const activationTime = btns[i].activationTime
      const secondActivationTime = btns[i].secondActivationTime
      const newBucketItem = createBucketListItem({
        id, time: timedGazePoint.time
      })
      if (
        bucket.length === 0 ||
        bucket[bucket.length - 1].id + 1 === id
      ) {
        bucket.push(newBucketItem)
        const dwellAtBtnDuration = getTimeSpan(bucket.map(el => el.time))

        if (dwellAtBtnDuration >= activationTime) {
          const prevDwellAtBtnDuration = bucket.length > 1
            ? getTimeSpan(bucket.map(el => el.time).slice(0, -1))
            : false
          if (!btns[i].secondAction) {
            buckets[i] = []
            btns[i].action()
          } else if (
            prevDwellAtBtnDuration && prevDwellAtBtnDuration < activationTime
          ) {
            changeIconAndText(btns[i], true)
          }
        }
        if (
          btns[i].secondAction &&
          dwellAtBtnDuration >= btns[i].secondActivationTime
        ) {
          changeIconAndText(btns[i], false)
          buckets[i] = []
          btns[i].secondAction()
        }
        progress = dwellAtBtnDuration > activationTime && secondActivationTime
          ? (dwellAtBtnDuration - activationTime) /
            (secondActivationTime - activationTime)
          : dwellAtBtnDuration / activationTime
      } else {
        buckets[i] = [newBucketItem]
      }
    } else {
      if (
        getTimeSpan(buckets[i].map(el => el.time)) >= btns[i].activationTime
      ) {
        btns[i].action()
      }
      buckets[i] = []
    }
    shadeBtn(btns[i].domId, progress)
  }
}

function activateDwellBtnGazeListener ({
  app,
  dwellBtns,
  getDwellBtnBackgroundColor
}) {
  const buckets = dwellBtns.map(() => [])
  let id = 0
  addScreenPointListener(
    app.webgazer,
    app.mouseListeners,
    'dwell_at_btn',
    (gazePoint, elapsedTime) => {
      if (!gazePoint) return
      const timedGazePoint = createTimedGazePoint({
        pos: gazePoint,
        time: elapsedTime
      })

      activateBtnsOnDwell({
        btns: dwellBtns,
        buckets,
        changeIconAndText: changeDwellBtnIconAndText,
        id,
        shadeBtn: (id, progress) => {
          shadeBtnLinear(id, progress, getDwellBtnBackgroundColor)
        },
        timedGazePoint
      })
      id++
    }
  )
}

function createBucketListItem ({ id, time }) {
  isBucketItem(arguments[0])
  return { id, time }
}

function isBucketItem (bucketItem) {
  const { id, time } = bucketItem
  return Number.isInteger(id) && Number.isInteger(time)
}

export {
  activateDwellBtnGazeListener,
  activateBtnsOnDwell,
  createBucketListItem
}
