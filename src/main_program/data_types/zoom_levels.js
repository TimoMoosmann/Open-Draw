import { List, Item } from 'OtherModules/linked-list.js'

function createZoomLevels (zoomFactorHalfs) {
  if (zoomFactorHalfs[0] !== 0.5) {
    throw new Error('Initial Zoom Factor always needs to be 1.0')
  }
  const zoomLevels = new List()
  for (const zoomFactorHalf of zoomFactorHalfs) {
    let lastEl
    if (zoomLevels.tail) lastEl = zoomLevels.tail
    if (!lastEl && zoomLevels.head) lastEl = zoomLevels.head
    if (lastEl && lastEl.factor / 2 >= zoomFactorHalf) {
      throw new Error(
        'Zoom Levels needs to be definded in an ascending order.'
      )
    }
    const zoomLevel = new Item()
    zoomLevel.factor = zoomFactorHalf * 2
    zoomLevel.maxCanvasOffsetFactor = zoomFactorHalf * 2 - 1.0
    zoomLevels.append(zoomLevel)
  }
  return zoomLevels.head
}

export {
  createZoomLevels
}
