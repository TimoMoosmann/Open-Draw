import { createPos } from 'Src/data_types/pos.js'

import { lang } from 'Settings'

function calcCalibrationScore ({ acc, borderAcc, perfectAcc }) {
  if (acc.x < perfectAcc.x) acc.x = perfectAcc.x
  if (acc.y < perfectAcc.y) acc.y = perfectAcc.y

  const onePctX = (borderAcc.x - perfectAcc.x) / 50
  const onePctY = (borderAcc.y - perfectAcc.y) / 50

  const pctFromPerfect = createPos({
    x: Math.round((acc.x - perfectAcc.x) / onePctX),
    y: Math.round((acc.y - perfectAcc.y) / onePctY)
  })
  return createPos({
    x: (pctFromPerfect.x > 100) ? 0 : 100 - pctFromPerfect.x,
    y: (pctFromPerfect.y > 100) ? 0 : 100 - pctFromPerfect.y
  })
}

function getCalibrationScoreEvaluation ({
  borderAcc,
  colorCodes,
  perfectAcc,
  borderPrec,
  minForGreen = 80,
  minForYellow = 65,
  minForOrange = 50,
  relAcc,
  relPrec,
  trys = false
}) {
  const calibrationScore = calcCalibrationScore({
    acc: relAcc, borderAcc, perfectAcc
  })

  const getAccScoreColorFixed = score => getAccScoreColor({
    score,
    minForGreen,
    minForOrange,
    minForYellow
  })
  const accScoreColor = createPos({
    x: getAccScoreColorFixed(calibrationScore.x),
    y: getAccScoreColorFixed(calibrationScore.y)
  })
  const minAccScoreColor = calibrationScore.x < calibrationScore.y
    ? accScoreColor.x
    : accScoreColor.y

  let precStatus = (lang === 'de') ? 'schlecht' : 'bad'
  let precStatusColor = 'red'
  if (relPrec.x <= borderPrec.x && relPrec.y <= borderPrec.y) {
    precStatus = (lang === 'de') ? 'gut' : 'good'
    precStatusColor = 'green'
  }
  let proceedBtnActive = true
  let message = ''
  switch (minAccScoreColor) {
    case 'red':
      message += (lang === 'de')
        ? 'Die Zielgenaugkeit ist zu niedrig um das Programm richtig ' +
          'benutzen zu können.'
        : 'Your accuracy is too low to use the program properly.'
      break
    case 'orange':
      message += (lang === 'de')
        ? 'Die Zielgenaugkeit ist gut genug um das Programm benutzen zu können.'
        : 'Your accuracy is just enough to use the program.'
      break
    case 'yellow':
      message += (lang === 'de')
        ? 'Die Zielgenaugkeit ist gut um das Programm zu benutzen.'
        : 'Your accuracy is good enough to use the program.'
      break
    case 'green':
      message += (lang === 'de')
        ? 'Perfekte Zielgenauigkeit.'
        : 'Your accuracy is good.'
      break
  }

  if (precStatusColor === 'red') {
    message = addToStringWithNewLine(
      message, (lang === 'de')
        ? 'Die Stabilität der Blickpunkte ist zu schlecht um das Programm ' +
          'richtig zu benutzen.'
        : 'Your precision is too low to use the program properly.'
    )
  }

  if (minAccScoreColor === 'red' || precStatusColor === 'red') {
    if (!trys || trys.trys > 0) {
      message = addToStringWithNewLine(
        message, (lang === 'de')
          ? 'Kalibriere nochmal, oder fahre mit eingeschränkter Qualität fort.'
          : 'Please calibrate again, or proceed with limited quality.'
      )
    } else {
      proceedBtnActive = false
      message = addToStringWithNewLine(message, (lang === 'de')
        ? 'Bitte kalibriere erneut.'
        : 'Please calibrate again.'
      )
    }
  }

  if (colorCodes) {
    for (const key of Object.keys(accScoreColor)) {
      accScoreColor[key] = colorCodes[accScoreColor[key]]
    }
    precStatusColor = colorCodes[precStatusColor]
  }

  if (trys) trys.trys++
  return createCalibrationScoreEvalOut({
    accScore: calibrationScore,
    accScoreColor,
    precStatus,
    precStatusColor,
    message,
    proceedBtnActive
  })
}

function getAccScoreColor ({
  minForGreen,
  minForOrange,
  minForYellow,
  score
}) {
  let accScoreColor = 'red'
  if (score >= minForGreen) {
    accScoreColor = 'green'
  } else if (score >= minForYellow) {
    accScoreColor = 'yellow'
  } else if (score >= minForOrange) {
    accScoreColor = 'orange'
  }
  return accScoreColor
}

function addToStringWithNewLine (str, appendStr) {
  return (str.length > 0) ? str + '<br>' + appendStr : appendStr
}

function createCalibrationScoreEvalOut ({
  accScore,
  accScoreColor,
  precStatus,
  precStatusColor,
  message,
  proceedBtnActive
}) {
  return ({
    accScore,
    accScoreColor,
    precStatus,
    precStatusColor,
    message,
    proceedBtnActive
  })
}

export {
  calcCalibrationScore, createCalibrationScoreEvalOut,
  getCalibrationScoreEvaluation
}
