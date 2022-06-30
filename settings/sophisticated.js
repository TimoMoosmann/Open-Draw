import { mainSettings } from 'NewSettings/main.js'

export const sophisticatedSettings = {
  // start with mainSettings
  ...mainSettings,
  // overite and define anything
  dwellBtnDetectionAlgorithm: 'screenpoint',
  targetSizeIsFixed: false,
  useSimpleBtnPatterns: false
}
