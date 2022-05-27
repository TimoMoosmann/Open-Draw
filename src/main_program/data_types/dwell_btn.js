import { createPos, scalePos } from 'Src/data_types/pos.js'
import { checkEllipse, createEllipse } from 'Src/main_program/data_types/ellipse.js'

import { standardDwellBtnActivationTime } from 'Settings'

import eyeIcon from 'Assets/img/eye-scanner.png'

function createDwellBtn ({
  action = () => {},
  center = createPos({ x: 0, y: 0 }),
  domId,
  icon = eyeIcon,
  size,
  timeTillActivation = standardDwellBtnActivationTime,
  title = false
}) {
  return {
    action,
    ellipse: createEllipse({
      center,
      radii: createPos({ x: size.x / 2, y: size.y / 2 })
    }),
    domId,
    icon,
    timeTillActivation,
    title
  }
}

function createDwellBtnFromDwellBtnAndCenter (dwellBtn, center) {
  return createDwellBtn({
    center,
    domId: dwellBtn.domId,
    icon: dwellBtn.icon,
    size: scalePos(dwellBtn.ellipse.radii, 2),
    timeTillActivation: dwellBtn.timeTillActivation,
    action: dwellBtn.action
  })
}

function checkDwellBtn (dwellBtn, argName) {
  const preText = argName + ': Illegal DwellBtn Object, '
  const { ellipse, domId, icon, timeTillActivation, action } = dwellBtn

  if (!(typeof domId === 'string')) {
    throw new TypeError(
      preText + 'domId needs to be a string.'
    )
  }
  if (!(typeof icon === 'string')) {
    throw new TypeError(preText + 'icon needs to be a string.')
  }
  if (!(Number.isInteger(timeTillActivation) && timeTillActivation > 0)) {
    throw new TypeError(
      preText +
      'timeTillActivation needs to be a number greater than 0.'
    )
  }
  if (!(typeof action === 'function')) {
    throw new TypeError(preText + 'action needs to be function.')
  }

  checkEllipse(ellipse, argName)
}

export {
  checkDwellBtn,
  createDwellBtn,
  createDwellBtnFromDwellBtnAndCenter
}
