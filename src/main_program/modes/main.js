function activateMode (app, mode) {
  if (app.activeMode) app.activeMode.stop(app)
  app.activeMode = mode
  app.activeMode.start(app)
}

export {
  activateMode
}
