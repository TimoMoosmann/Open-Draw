import { createPos } from 'Src/data_types/pos.js'
import { mean } from 'Src/util/math.js'

function getCenterPoint (posArr) {
  return createPos({
    x: Math.round(mean(posArr.map(pos => pos.x))),
    y: Math.round(mean(posArr.map(pos => pos.y)))
  })
}

export {
  getCenterPoint
}
