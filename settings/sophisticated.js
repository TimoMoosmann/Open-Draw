import { createPos } from 'Src/data_types/pos.js'
import { mainSettings } from 'Settings/main.js'

export const sophisticatedSettings = {
  // start with mainSettings
  ...mainSettings,

  // overwrite and define anything
  dwellBtnDetectionAlgorithm: 'screenpoint',
  targetSizeIsFixed: false,
  useSimpleBtnPatterns: false,
  // Minimum Relative Accuracy to use the program properly
  borderAccRel: createPos({ x: 0.07, y: 0.15 }),
  // Minimum recommended Relative Precision
  borderPrecRel: createPos({ x: 0.06, y: 0.1 }),

  minDistToEdgeRel: createPos({ x: 0.08, y: 0.08 }),
}
