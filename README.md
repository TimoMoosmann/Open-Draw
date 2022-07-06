# Open Draw

## How to use

- Simply visit the [Open Draw Project](open-draw-project.org) website.
- Or [Install](#install) and [Run](#run-open-draw) Open Draw.

## Program Overview

### Simple Mode
- Most stable version of the application.
- Visit [/debug](open-draw-project.org/debug) to explore.
- Visit [/](open-draw-project.org/) to use the app with your eyes.

### Sophisticated Mode
- Uses buttons with variable size, and a more space-saving, but unstable gaze detection algorithm.
- Try at [/sophisticated_debug](open-draw-project.org/sophisticated_debug) and use at [/sophisticated](open-draw-project.org/sophisticated).

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

```console
npm install
```

## Run
```console
npm run build && npm run serve
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

- Visit [/calibration_study](open-draw-project.org/calibration-study) to try out the study procedure which can be applied to participants.
- For each participant a study protocol will be generated at `study_protocols/`.
- If there is no existing `db/study_data.db` file, Node will create one and appends the results for each participant.
- That file can be evaluated by running:
```console
cd db/
node data_evaluation.js
```
