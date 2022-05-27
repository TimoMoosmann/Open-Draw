/* global MutationObserver */
function createFaceDetector ({
  faceFeedbackBox = document.getElementById('webgazerFaceFeedbackBox'),
  onDetectionStatusChanged = isFaceDetected => {}
} = {}) {
  return {
    faceFeedbackBox,
    onDetectionStatusChanged,

    start () {
      let prevFaceDetected = this.isFaceDetected()
      this.observer = new MutationObserver((mutationsList) => {
        const faceDetected = this.isFaceDetected()
        if (prevFaceDetected !== faceDetected) {
          this.onDetectionStatusChanged(faceDetected)
          prevFaceDetected = faceDetected
        }
      })
      this.observer.observe(this.faceFeedbackBox, { attributeFilter: ['style'] })
      // Initial call for not missing an event
      this.onDetectionStatusChanged(this.isFaceDetected())
    },

    stop () {
      this.observer.disconnect()
    },

    isFaceDetected () {
      return this.faceFeedbackBox.style.borderColor === 'green'
    }
  }
}

export {
  createFaceDetector
}
