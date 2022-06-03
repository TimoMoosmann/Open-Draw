import { getViewport } from 'Src/util/browser.js'
import { dividePositions, scalePosByPos } from 'Src/data_types/pos.js'

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

export {
  getAbsPosFromPosRelativeToViewport,
  getPosRelativeToViewport,
  popRandomItem
}
