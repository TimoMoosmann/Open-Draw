# Open Draw

Draw a simple draft with your eyes. The only thing you need is normal webcam.

## How to use

- Simply visit [Open Draw](https://open-draw.onrender.com) (Can load slowly).
  - Note: Firefox and Brave browsers might not work. Use Chrome, or Chromium instead.
- Or [Install](#install) and [Run](#run) Open Draw.

## Program Overview

### Simple Mode
- Most stable version of the application.
- Visit [/hover](https://open-draw.onrender.com/hover) to explore.
- Visit [/](https://open-draw.onrender.com/) to use the app with your eyes.

### Sophisticated Mode
- Uses buttons with variable size, and uses space more efficiently. But the gaze detection algorithm is unstable.
- Try at [/sophisticated_hover](https://open-draw.onrender.com/sophisticated_hover) and use at [/sophisticated](https://open-draw.onrender.com/sophisticated).

## Instructions

### Dwell Buttons

- Dwell Buttons are the core of the application and could basically be the core of any webcam eye controlled program.
- Just stare at the center of the buttons to activate them. (Hover over them in debug mode.)

### Draw Line Mode

1. Stare at a point on the screen. → A dot will appear.
2. Confirm
    - Keep staring if you like that dot to be the starting point of the line. → An Ellipse will appear around the dot.
    - Stare at another location if you don't like the current point. → Another dot will appear.
3. Stare at another point, that lies outside that circle around your first point. → A line will appear.
4. Confirm
    - Keep staring if you want that line to be drawn. → The line will be drawn.
    - Look at another location if you don't like that point to be drawn. → Line disappears.

### Two Level Dwell Buttons

- In the Move Page of Simple Mode there is one special Dwell Button to Switch between Pages, or Quit the Page.
- Stare at the button until it switches its Symbol. If you look at another location, the first action (Switch) is activated, if you keep staring, the second action (Quit) is activated.

## Install

Node.js is required.

Before you install the program, make sure SQLite3 is on your computer, otherwise there might be some complications.

```console
npm install && npm run build
```

## Run
```console
npm run serve
```

## Settings

All settings are defined in settings/main.js. Some of them are overwritten in settings/sophisticated.js for the sophisticated mode.

Some important ones are:
- eyeModeOn: Sets whether the application is controlled by mouse, or eyes.
- dwellBtnDetectionAlgorithm: Either 'bucket', or 'screenpoint'; has a big impact on stability and button sizes.
- useSimpleBtnPatterns: Controls the layout of dwell button pages.
- lookStateDwellDuration: Sets how long the user needs to look at a point until it appears on the screen. (In draw line mode)
- drawStateDwellDuration: Sets how long the user needs to keep looking until the point is confirmed. (In draw line mode)
- standardDwellBtnActivationTime: Sets how long it takes to activate a dwell button.
- numCalibrationTargets: The number of targets to calibrate webgazer.
- calibrationType: 'gaze' to calibrate webgazer just by looking, and 'click' to calibrate by clicking targets.

# Calibration Study

This repository also includes a setup for an experiment to find out the about the accuracy of webgazer after a certain calibration procedure.

- Visit [/calibration_study](https://open-draw-project.org/calibration-study) to try out the study procedure which can be applied to participants.
- For each participant a study protocol will be generated at `study_protocols/`.
- If there is no existing `db/study_data.db` file, Node will create one and appends the results for each participant.
- That file can be evaluated by running:
```console
cd db/
node data_evaluation.js
```
