/* global Option */
import { createPos, scalePosByVal } from 'Src/data_types/pos.js'
import { checkEllipse, createEllipse } from 'Src/main_program/data_types/ellipse.js'

import { standardDwellBtnActivationTime } from 'Settings'

import eyeIcon from 'Assets/img/eye-scanner.png'
import nextBtnIcon from 'Assets/img/right_arrow.png'
import prevBtnIcon from 'Assets/img/left_arrow.png'

function createDwellBtn ({
  action = () => {},
  center = createPos({ x: 0, y: 0 }),
  domId,
  icon = eyeIcon,
  size,
  timeTillActivation = standardDwellBtnActivationTime,
  title = false
}) {
  console.log(title)
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

function createDwellBtnFromDwellBtnAndCenter (dwellBtn, center) {
  /*
  const domId = dwellBtn.domId
  const icon = dwellBtn.icon
  */
  /*
  const timeTillActivation = dwellBtn.timeTillActivation
  const title = dwellBtn.title
  const action = dwellBtn.action
  const dwellBtnArgs = {
    action, center, domId, icon, size, timeTillActivation, title
  }
  */
  const size = scalePosByVal(dwellBtn.ellipse.radii, 2)

  if (dwellBtn.colorDot) {
    return createDwellBtnWithColorDot({
      center, size, colorDot: dwellBtn.colorDot, ...dwellBtn
    })
  }
  return createDwellBtn({ center, size, ...dwellBtn })
}

function checkDwellBtn (dwellBtn, argName) {
  const preText = argName + ': Illegal DwellBtn Object, '
  const { ellipse, domId, icon, timeTillActivation, action } = dwellBtn

  if (!(typeof domId === 'string')) {
    throw new TypeError(
      preText + 'domId needs to be a string.'
    )
  }
  if (icon && !(typeof icon === 'string')) {
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
  createDwellBtnWithColorDot,
  createDwellBtnFromDwellBtnAndCenter,
  createNextBtn,
  createPrevBtn
}
