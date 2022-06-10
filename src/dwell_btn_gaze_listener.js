import { isPos } from 'Src/data_types/pos.js'
import { inEllipse } from 'Src/main_program/data_types/ellipse.js'
import { shadeBtn } from 'Src/main_program/evaluate_fixations.js'

function activateBtnsOnDwell (btns, buckets, timedGazePoint, id) {
  for (let i = 0; i < btns.length; i++) {
    if (inEllipse(timedGazePoint.pos, btns[i].ellipse)) {
      const bucket = buckets[i]
      if (bucket.length === 0 || bucket[bucket.length - 1].id + 1 === id) {
        bucket.push(createBucketItem({
          id, time: timedGazePoint.time
        }))
        const dwellAtBtnDuration =
          bucket[bucket.length - 1].time - bucket[0].time
        if (
          dwellAtBtnDuration >= btns[i].activationTime
        ) {
          btns[i].action()
          buckets[i] = []
          shadeBtn(btns[i].domId, 0)
        } else {
          const activationProgress =
            dwellAtBtnDuration / btns[i].activationTime
          shadeBtn(btns[i].domId, activationProgress)
        }
      }
    } else {
      buckets[i] = []
      shadeBtn(btns[i].domId, 0)
    }
  }
}

function activateDwellBtnGazeListener (dwellBtns, webgazer) {
  const buckets = dwellBtns.map(() => [])
  let id = 0
  webgazer.setGazeListener((gazePoint, elapsedTime) => {
    const timedGazePoint = createTimedGazePoint({
      pos: gazePoint,
      time: elapsedTime
    })
    activateBtnsOnDwell(dwellBtns, buckets, timedGazePoint, id)
    id++
  })
}

function createTimedGazePoint ({ pos, time }) {
  isTimedGazePoint(arguments[0])
  return { pos, time }
}

function isTimedGazePoint (timedGazePoint) {
  const { pos, time } = timedGazePoint
  return isPos(pos) && Number.isInteger(time)
}

function createBucketItem ({ id, time }) {
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
  createBucketItem,
  createTimedGazePoint
}
