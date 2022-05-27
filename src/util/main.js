import { getViewport } from 'Src/util/browser.js'
import { dividePositions } from 'Src/data_types/pos.js'

function popRandomItem (arr) {
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
};

function getPosRelativeToViewport ({
  pos, viewport = getViewport()
}) {
  return dividePositions(pos, viewport)
}

export {
  getPosRelativeToViewport,
  popRandomItem
}
