import { createPos } from 'Src/data_types/pos.js'
import { mainSettings } from 'Settings/main.js'

export const sophisticatedSettings = {
  // start with mainSettings
  ...mainSettings,
  // overite and define anything
  dwellBtnDetectionAlgorithm: 'screenpoint',
  targetSizeIsFixed: false,
  useSimpleBtnPatterns: false,
  // Minimum Relative Accuracy to use the program properly
  borderAccRel: createPos({ x: 0.07, y: 0.14 }),
  // Minimum recommended Relative Precision
  borderPrecRel: createPos({ x: 0.05, y: 0.09 })
}
