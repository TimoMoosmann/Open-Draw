import { createPos } from 'Src/data_types/pos.js'
import { createDwellBtn } from 'Src/main_program/data_types/dwell_btn.js'

function createStandardDwellBtn ({ domId, action }) {
  return createDwellBtn({
    domId,
    size: createPos({ x: 200, y: 100 }),
    activationTime: 1000,
    action
  })
}

export {
  createStandardDwellBtn
}
