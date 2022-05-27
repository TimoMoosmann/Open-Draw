import { createPos, scalePos } from 'Src/data_types/pos.js'
import { vh, vw } from 'Src/util/browser.js'

import { minDistToEdgeInPct } from 'Settings'

function getMinDistToEdge () {
  return createPos({
    x: (1 / 100) * vw() * minDistToEdgeInPct.x,
    y: (1 / 100) * vh() * minDistToEdgeInPct.y
  })
}

function getSmallDistToNeighborTarget (minTargetSize) {
  return scalePos(minTargetSize, 1 / 2)
}

export { getMinDistToEdge, getSmallDistToNeighborTarget }
