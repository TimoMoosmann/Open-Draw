import { checkNumericPos, checkPositiveNumericPos } from 'Src/data_types/pos.js'

function createEllipse ({ center, radii }) {
  return { center, radii }
}

function checkEllipse (ellipse, argName) {
  checkNumericPos(ellipse.center, argName + '.center')
  checkPositiveNumericPos(ellipse.radii, argName + '.radii')
}

function inEllipse (pos, ellipse) {
  return ((
    (Math.pow(pos.x - ellipse.center.x, 2) / Math.pow(ellipse.radii.x, 2)) +
    (Math.pow(pos.y - ellipse.center.y, 2) / Math.pow(ellipse.radii.y, 2))
  ) <= 1)
}

export {
  checkEllipse,
  createEllipse,
  inEllipse
}
