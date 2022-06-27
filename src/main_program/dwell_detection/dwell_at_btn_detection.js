/*
 * Dwell at Btn listener listens to a fixation detector, while
 * dwell at Btn detection only collects screenpoints that hit a button.
 */
import { createTimedGazePoint } from 'Src/main_program/dwell_detection/data_types.js'
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { shadeBtnLinear } from 'Src/main_program/view.js'
import { addScreenPointListener } from 'Src/util/main.js'

function activateBtnsOnDwell ({
  btns,
  buckets,
  id,
  shadeBtn = () => {},
  timedGazePoint
}) {
  for (let i = 0; i < btns.length; i++) {
    if (inEllipse(timedGazePoint.pos, btns[i].ellipse)) {
      const bucketList = buckets[i].list
      const activationTime = btns[i].activationTime
      const levelOneActionTriggered = buckets[i].levelOneActionTriggered
      if (bucketList.length === 0 ||
        bucketList[bucketList.length - 1].id + 1 === id
      ) {
        bucketList.push(createBucketListItem({
          id, time: timedGazePoint.time
        }))
        const dwellAtBtnDuration =
          bucketList[bucketList.length - 1].time - bucketList[0].time
        if (
          dwellAtBtnDuration >= activationTime &&
          levelOneActionTriggered === false
        ) {
          btns[i].action()
          if (btns[i].levelTwoAction) {
            buckets[i].levelOneActionTriggered = true
          } else {
            buckets[i] = createEmptyBucket()
          }
          shadeBtn(btns[i].domId, 0)
        } else if (dwellAtBtnDuration >= activationTime * 2) {
          buckets[i] = createEmptyBucket()
          if (btns[i].levelTwoAction) btns[i].levelTwoAction()
        } else {
          const activationProgress = levelOneActionTriggered
            ? (dwellAtBtnDuration - activationTime) / activationTime
            : dwellAtBtnDuration / activationTime
          shadeBtn(btns[i].domId, activationProgress)
        }
      }
    } else {
      buckets[i] = createEmptyBucket()
      shadeBtn(btns[i].domId, 0)
    }
  }
}

function activateDwellBtnGazeListener ({
  app,
  dwellBtns,
  getDwellBtnBackgroundColor
}) {
  const buckets = dwellBtns.map(() => createEmptyBucket())
  let id = 0
  addScreenPointListener(app, 'dwell_at_btn', (gazePoint, elapsedTime) => {
    const timedGazePoint = createTimedGazePoint({
      pos: gazePoint,
      time: elapsedTime
    })

    activateBtnsOnDwell({
      btns: dwellBtns,
      buckets,
      id,
      shadeBtn: (id, progress) => {
        shadeBtnLinear(id, progress, getDwellBtnBackgroundColor)
      },
      timedGazePoint
    })
    id++
  })
}

function createEmptyBucket () {
  return {
    list: [],
    levelOneActionTriggered: false
  }
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
  createBucketListItem,
  createEmptyBucket
}
