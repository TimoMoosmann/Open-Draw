/* global webgazer */
import { createAndStartApp } from 'Src/startup_helper.js'
import { mainSettings } from 'NewSettings/main.js'

async function main () {
  await createAndStartApp(mainSettings)
  /*
  const app = {
    settings: mainSettings,
    rootDomEl: document.body,
    state: {
      lines: [
        createLine({
          startPoint: createPos({ x: 100, y: 200 }),
          endPoint: createPos({ x: 400, xy: 300 }),
          strokeProperties: createStrokeProperties({
            color: 'blue',
            lineWidth: 5
          })
        }),
        createLine({
          startPoint: createPos({ x: 150, y: 50 }),
          endPoint: createPos({ x: 2200, y: 1300 }),
          strokeProperties: createStrokeProperties({
            color: 'red',
            lineWidth: 2
          })
        }),
        createLine({
          startPoint: createPos({ x: 700, y: 10 }),
          endPoint: createPos({ x: 2, y: 423 }),
          strokeProperties: createStrokeProperties({
            color: 'red',
            lineWidth: 2
          })
        })
      ],
      newLineProperties: createStrokeProperties({
        color: 'blue',
        lineWidth: defaultLineWidth
      }),
      zoom: createZoom()
    }
  }
  // For edit Mode to work with predefined lines
  app.state.linesBuffer = JSON.parse(JSON.stringify(app.state.lines))
  app.state.linesBufferIdx = app.state.linesBuffer.length - 1

  const { drawingCanvasDomEl, drawingCanvasContainer } =
    getDrawingCanvasInContainer()
  app.rootDomEl.appendChild(drawingCanvasContainer)
  app.drawingCanvas = getDrawingCanvas(drawingCanvasDomEl)

  const backgroundGrid = getBackgroundGrid()
  app.rootDomEl.appendChild(backgroundGrid)
  app.showBackgroundGrid = show => {
    show
      ? backgroundGrid.style.visibility = 'visible'
      : backgroundGrid.style.visibility = 'hidden'
  }

  app.gazeDot = getGazeDot({
    app,
    color: standardGazeDotColor,
    refreshesPerSecond: gazeDotRefreshesPerSecond,
    rootEl: app.rootDomEl
  })
  if (app.settings.eyeModeOn) {
    await setupWebgazerNormal(app)
    activateMode(app, getCalibrationMode())
    document.addEventListener('keydown', event => {
      if (event.key === 'r' && app.activeMode.name !== 'calibration') {
        activateMode(app, getCalibrationMode())
      }
    })
  } else {
    const acc = getAbsPosFromPosRelativeToViewport(borderAcc)
    const prec = getAbsPosFromPosRelativeToViewport(borderPrec)

    app.minGazeTargetSize = app.settings.getMinTargetSize[
      app.settings.dwellBtnDetectionAlgorithm
    ](acc, prec)
    app.dispersionThreshold = app.settings.getDispersionThreshold(prec)

    // print how many btns fit in x and y direction every time the app
    // is started with eyeModeOn === false
    console.log('Number of buttons that fit on the screen:')
    console.log(calcNumBtnsFitOnScreen(app))

    activateMode(app, getMainMenuClosedMode(app))
  }
  */
}

main()
