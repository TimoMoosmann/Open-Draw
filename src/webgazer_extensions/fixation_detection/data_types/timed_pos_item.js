import { Item } from 'OtherModules/linked-list.js'

function createTimedPosItem ({ timestamp, pos }) {
  const it = new Item()
  it.timestamp = timestamp
  it.pos = pos
  return it
}

export {
  createTimedPosItem
}
