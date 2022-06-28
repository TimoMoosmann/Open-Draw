/* global Option */
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { checkEllipse, createEllipse } from 'Src/main_program/data_types/ellipse.js'

import { standardDwellBtnActivationTime } from 'Settings'

import eyeIcon from 'Assets/icons/eye.png'
import nextBtnIcon from 'Assets/icons/arrow_right.png'
import prevBtnIcon from 'Assets/icons/arrow_left.png'

function createDwellBtn ({
  action = () => {},
  secondAction = false,
  center = createPos({ x: 0, y: 0 }),
  domId,
  icon = eyeIcon,
  secondIcon = eyeIcon,
  size,
  activationTime = standardDwellBtnActivationTime,
  secondActivationTime = false,
  title = false,
  secondTitle = false
}) {
  if (secondTitle && !title) {
    throw new TypeError('DwellBtn can only have secondTitle if title exists.')
  }
  if (!secondActivationTime && secondAction) {
    secondActivationTime = 3 * activationTime
  }
  if (secondActivationTime && secondActivationTime < 2 * activationTime) {
    throw new TypeError(
      'Second activation time needs to be at least twice the activation time'
    )
  }
  return {
    action,
    secondAction,
    ellipse: createEllipse({
      center,
      radii: createPos({ x: size.x / 2, y: size.y / 2 })
    }),
    domId,
    icon,
    secondIcon,
    activationTime,
    secondActivationTime,
    size,
    title,
    secondTitle
  }
}

function createDwellBtnWithColorDot ({
  colorDot,
  ...dwellBtnArgs
}) {
  checkColor(colorDot)
  const dwellBtnWithDotColor = createDwellBtn(dwellBtnArgs)
  dwellBtnWithDotColor.colorDot = colorDot
  return dwellBtnWithDotColor
}

// From Stackoverflow:
// https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
function isColor (colorStr) {
  const s = new Option().style
  s.color = colorStr
  return s.color !== ''
}

function checkColor (colorStr) {
  if (!isColor(colorStr)) {
    throw new TypeError('No valid color string given.')
  }
}

function createNextBtn ({ action, size }) {
  return createDwellBtn({
    action,
    domId: 'nextBtn',
    icon: nextBtnIcon,
    size
  })
}

function createPrevBtn ({ action, size }) {
  return createDwellBtn({
    action,
    domId: 'prevBtn',
    icon: prevBtnIcon,
    size
  })
}

function createDwellBtnFromDwellBtn (dwellBtn) {
  const center = dwellBtn.ellipse.center
  const size = scalePosByVal(dwellBtn.ellipse.radii, 2)
  if (dwellBtn.colorDot) {
    return createDwellBtnWithColorDot({
      center, size, colorDot: dwellBtn.colorDot, ...dwellBtn
    })
  }
  return createDwellBtn({ center, size, ...dwellBtn })
}

function createDwellBtnFromDwellBtnAndCenter (dwellBtn, center) {
  // So that the original dwellBtn reamains unchanged.
  const safetyBtn = createDwellBtnFromDwellBtn(dwellBtn)
  safetyBtn.ellipse.center = center
  return createDwellBtnFromDwellBtn(safetyBtn)
}

function checkDwellBtn (dwellBtn, argName) {
  const preText = argName + ': Illegal DwellBtn Object, '
  const { ellipse, domId, icon, activationTime, action } = dwellBtn

  if (!(typeof domId === 'string')) {
    throw new TypeError(
      preText + 'domId needs to be a string.'
    )
  }
  if (icon && !(typeof icon === 'string')) {
    throw new TypeError(preText + 'icon needs to be a string.')
  }
  if (!(Number.isInteger(activationTime) && activationTime > 0)) {
    throw new TypeError(
      preText +
      'activationTime needs to be a number greater than 0.'
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
  createDwellBtnWithColorDot,
  createDwellBtnFromDwellBtn,
  createDwellBtnFromDwellBtnAndCenter,
  createNextBtn,
  createPrevBtn
}
