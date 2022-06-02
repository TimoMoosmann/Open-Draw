import { getViewport } from 'Src/util/browser.js'
import { dividePositions, scalePosByPos, scalePosByVal } from 'Src/data_types/pos.js'
import { minDistToEdgeInPct } from 'Settings'

function popRandomItem (arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
};

function getPosRelativeToViewport ({
  pos, viewport = getViewport()
}) {
  return dividePositions(pos, viewport)
}

function getAbsPosFromPosRelativeToViewport (
  relPos, viewport = getViewport()
) {
  return scalePosByPos(relPos, viewport)
}

function getMinDistToEdgeFromSettings () {
  return scalePosByPos(
    getViewport(),
    scalePosByVal(minDistToEdgeInPct, 1 / 100)
  )
}

export {
  getAbsPosFromPosRelativeToViewport,
  getMinDistToEdgeFromSettings,
  getPosRelativeToViewport,
  popRandomItem
}
