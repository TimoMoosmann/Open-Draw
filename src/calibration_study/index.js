/* global XMLHttpRequest, webgazer */
import {
  getClickCalibrationInstructionsPage,
  getClickCalibrationIntroductionPage, getGazeCalibrationInstructionsPage,
  getGazeCalibrationIntroductionPage, getGreetingPage, getParticipantDataPage,
  getThankYouPage, getValidationInstructionsPage
} from 'Src/calibration_study/view.js'
import { createDetailedGazeAtTargetData } from 'Src/calibration_study/data_types/detailed_gaze_at_target_data.js'
import { runClickCalibration, runGazeCalibration, runValidation } from 'Src/calibration/main.js'
import { setupWebgazer } from 'Src/setup_webgazer/main.js'
import { encodeFormAsURI } from 'Src/util/browser.js'
import { popRandomItem } from 'Src/util/main.js'
import { showWebgazerVideoWhenFaceIsNotDetected } from 'Src/webgazer_extensions/setup/main.js'

function setup () {
  let serverAddress
  if (process.env.NODE_ENV === 'production') {
    serverAddress = 'https://open-draw-project.org'
  } else {
    serverAddress = 'http://localhost:3000'
  }
  return serverAddress
}

function showPage (page) {
  return document.body.appendChild(page)
}

function doActionOnSubmitClicked ({ action, page }) {
  return page.querySelector('button[type=submit]')
    .addEventListener('click', action)
}

function showPageUntilSubmit (page) {
  return new Promise(resolve => {
    showPage(page)
    doActionOnSubmitClicked({
      page,
      action: () => {
        page.remove()
        resolve()
      }
    })
  })
}

function showParticipantDataPageTillProtocolIsCreated ({
  page, serverAddress
}) {
  return new Promise(resolve => {
    showPage(page)
    doActionOnSubmitClicked({
      page,
      action: evt => {
        evt.preventDefault()
        createProtocol({
          onSuccess: serverProtocolData => {
            page.remove()
            resolve(serverProtocolData)
          },
          participantDataForm: page.querySelector('form'),
          serverAddress
        })
      }
    })
  })
}

async function main () {
  const serverAddress = setup()
  const webgazerLocal = webgazer
  await showPageUntilSubmit(getGreetingPage())
  const participantDataPage = getParticipantDataPage()
  const serverProtocolData =
    await showParticipantDataPageTillProtocolIsCreated({
      page: participantDataPage,
      serverAddress
    })
  await setupWebgazer({
    webgazer: webgazerLocal,
    bigTitle: false,
    title: 'Jetzt, richten sie noch ihre Kamera ein.'
  })
  showWebgazerVideoWhenFaceIsNotDetected(webgazerLocal)

  let currentTaskNum = 1
  let targetsNums, calibrationTypes
  if (process.env.NODE_ENV === 'production') {
    targetsNums = [5, 9, 13]
    calibrationTypes = ['click', 'gaze']
  } else {
    targetsNums = [5, 9]
    calibrationTypes = ['gaze']
  }
  const numTasks = targetsNums.length * calibrationTypes.length
  const numValidationTargets = 4
  let calibrationType = popRandomItem(calibrationTypes)
  while (calibrationType) {
    let runCalibration
    let calibrationTypeIntroduction
    let getCalibrationTaskInstructionsPage
    switch (calibrationType) {
      case 'click':
        runCalibration = async ({ numTargets, webgazer }) => {
          webgazer.addMouseEventListeners()
          await runClickCalibration({
            numTargets,
            webgazer
          })
          webgazer.removeMouseEventListeners()
        }
        calibrationTypeIntroduction = getClickCalibrationIntroductionPage()
        getCalibrationTaskInstructionsPage =
          getClickCalibrationInstructionsPage
        break
      case 'gaze':
        runCalibration = runGazeCalibration
        calibrationTypeIntroduction = getGazeCalibrationIntroductionPage()
        getCalibrationTaskInstructionsPage = getGazeCalibrationInstructionsPage
        webgazer.removeMouseEventListeners()
        break
      default:
        throw new Error(`No Calibration type: ${calibrationType} available.`)
    }
    await showPageUntilSubmit(calibrationTypeIntroduction)
    currentTaskNum = await tasksForTypeConduction({
      runCalibration,
      calibrationType,
      getCalibrationTaskInstructionsPage,
      currentTaskNum,
      numTasks,
      numValidationTargets,
      serverAddress,
      serverProtocolData,
      targetsNums: [...targetsNums],
      webgazer: webgazerLocal
    })
    calibrationType = popRandomItem(calibrationTypes)
  }
  document.body.appendChild(getThankYouPage())
}

const tasksForTypeConduction = async ({
  runCalibration,
  calibrationType,
  getCalibrationTaskInstructionsPage,
  currentTaskNum,
  numTasks,
  numValidationTargets,
  serverProtocolData,
  serverAddress,
  targetsNums,
  webgazer
}) => {
  while (targetsNums.length > 0) {
    const numCalibrationTargets = popRandomItem(targetsNums)
    await showPageUntilSubmit(getCalibrationTaskInstructionsPage({
      currentTaskNum, numTasks, numTargets: numCalibrationTargets
    }))
    webgazer.showPredictionPoints(false)
    webgazer.clearData()
    await runCalibration({
      numTargets: numCalibrationTargets,
      webgazer
    })
    await showPageUntilSubmit(getValidationInstructionsPage(
      numValidationTargets
    ))
    const validationData = await runValidation({
      numTargets: numValidationTargets,
      webgazer
    })
    // send validation data to server
    appendResultsToProtocol({
      calibrationType,
      numCalibrationTargets,
      serverProtocolData,
      serverAddress,
      validationData
    })
    currentTaskNum += 1
    webgazer.showPredictionPoints(true)
  }
  return currentTaskNum
}

function createProtocol ({
  onSuccess,
  participantDataForm,
  serverAddress
}) {
  const invalidInputEl = document.getElementById('invalidInput')
  const serverErrorEl = document.getElementById('serverError')
  invalidInputEl.hidden = true
  serverErrorEl.hidden = true
  const createProtocolReq = new XMLHttpRequest()
  createProtocolReq.onreadystatechange = () => {
    if (createProtocolReq.readyState === 4) {
      switch (createProtocolReq.status) {
        case (200):
          onSuccess(
            JSON.parse(createProtocolReq.responseText)
          )
          break
        case (400):
          invalidInputEl.hidden = false
          break
        case (500):
          serverErrorEl.hidden = false
          break
      }
    }
  }
  createProtocolReq.open('POST', serverAddress + '/create-study-protocol')
  createProtocolReq.setRequestHeader(
    'Content-type', 'application/x-www-form-urlencoded')
  createProtocolReq.send(encodeFormAsURI(participantDataForm))
}

function appendResultsToProtocol ({
  calibrationType,
  numCalibrationTargets,
  serverProtocolData,
  serverAddress,
  validationData
}) {
  const resultsReq = new XMLHttpRequest()
  resultsReq.open('POST', `${serverAddress}/append-validation-data-to-protocol`)
  resultsReq.setRequestHeader('Content-Type', 'application/jsoncharset=UTF-8')
  resultsReq.send(JSON.stringify({
    calibrationType,
    numCalibrationTargets,
    serverProtocolData,
    validationDataExtended: validationData.map(gazeAtTargetData => {
      return createDetailedGazeAtTargetData(gazeAtTargetData)
    })
  }))
}

main()
